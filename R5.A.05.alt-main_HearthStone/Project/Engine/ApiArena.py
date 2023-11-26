from flask import Flask, jsonify, request, render_template, abort
import json
from character import *
from engine import *
from arena import *
from http import *
import http.client


app = Flask(__name__)

# Fonctions utilitaires
@app.route('/')
def arena():
    return render_template('arena.html')

def load_data():
    with open('./gamesData.json') as json_file:
        return json.load(json_file)
    
def load_data_of_character(character_id):
    with open('./gamesData.json') as json_file:
        return json.load(json_file)["charactersList"][character_id]
    
def write_data(data):
    with open('./gamesData.json', 'w') as outfile:
        json.dump(data, outfile)

@app.route('/alldata/', methods=['GET'])
def get_all_datas():
    return jsonify(load_data())
# ---------------------------------- Routes prof ----------------------------------
#good
# - GET - /character/id/ - récupérer un personnages - cid
@app.route('/character/<character_id>', methods=['GET'])
def get_character(character_id):
    arena = Arena(engine._arena)
    characters = arena._playersList
    for character in characters:
        if character.isId(character_id):
            return jsonify(character, 200)
    return jsonify({"error": "Personnage non trouvé"}), 404
#good
# - GET - /characters/ - récupéré les personnages d'une arène
@app.route('/characters/', methods=['GET'])
def get_characters():
    arena = Arena(engine._arena)
    return jsonify(arena._playersList,200)

#pas good
# # - POST - /character/join/ - ajouter un personnage à une arène - cid, teamid, life, strength, armor, speed
@app.route('/character/join', methods=['POST'])
def join_character():
    engine = Engine()
    character_id = request.json.get('characterId')

    for characters in engine._arena._playersList:
        if character in characters:
            character = get_character(character_id)
            _ = http.client.HTTPSConnection("ADDRESS").request("POST", "/character/join", character)
            engine._arena.removePlayer(character)
            return jsonify({"message": "Personnage server switch"}), 200
    
    character = CharacterProxy(character_id, request.json.get('teamId'), request.json.get('life'), request.json.get('strength'), request.json.get('armor'), request.json.get('speed'))
    engine._arena.addPlayer(character)
    return jsonify({"message": "Personnage ajouté"}), 200

#pas good
#- POST - /character/<character_id>/action/<action_id>/target - ajouter une action à un personnage - cid, action, target
@app.route('/character/action/<character_id>/<action_id>/<target_id>', methods=['GET'])
def action_character(character_id,action_id,target_id):
    dataCharacters = get_character(character_id)
    dataTarget = get_character(target_id)
    character = CharacterProxy(character_id, dataCharacters["teamId"], dataCharacters["life"], dataCharacters["strength"], dataCharacters["armor"], dataCharacters["speed"])
    target = CharacterProxy(target_id, dataTarget["teamId"], dataTarget["life"], dataTarget["strength"], dataTarget["armor"], dataTarget["speed"])
    if(target):
        character.setTarget(target.getId())
    if action_id == actionToStr(ACTION.HIT):
        character.setAction(ACTION.HIT)
        return jsonify({"message": "Personnage ajouté"}), 200
    elif action_id == actionToStr(ACTION.BLOCK):
        character.setAction(ACTION.BLOCK)
        return jsonify({"message": "Personnage ajouté"}), 200
    elif action_id == actionToStr(ACTION.DODGE):
        character.setAction(ACTION.DODGE)
        return jsonify({"message": "Personnage ajouté"}), 200
    elif action_id == actionToStr(ACTION.FLY):
        character.setAction(ACTION.FLY)
        return jsonify({"message": "Personnage ajouté"}), 200
    else:
        return jsonify({"error": "Action non trouvée"}), 404

# ---------------------------------- Données ----------------------------------

# Routes get de l'API
@app.route('/arenass/', methods=['GET'])
def get_all_arenas():
    return jsonify(load_data()["arenasList"])

@app.route('/characterss/', methods=['GET'])
def get_all_characters():
    return jsonify(load_data()["charactersList"])


@app.route('/arenas/<arena_id>', methods=['GET'])
def get_specific_arena(arena_id):
    data = load_data()["arenasList"]
    if arena_id in data:
        return jsonify(data[arena_id])
    else:
        return jsonify({"error": "Arène non trouvé"}), 404

@app.route('/characters/<character_id>', methods=['GET'])
def get_specific_character(character_id):
    data = load_data()["charactersList"]
    if character_id in data:
        return jsonify(data[character_id])
    else:
        return jsonify({"error": "Personnage non trouvé"}), 404

# Routes add de l'API
@app.route('/addData/', methods=['POST'])
def add_arena(arena_id):
    data = load_data()["arenasList"]
    if arena_id in data:
        abort(400, "Arène déjà existante")
    data[arena_id].append(arena_id)
    write_data(data)
    return jsonify(data), 200 

@app.route('/addData/characters/<character_id>', methods=['POST'])
def add_character(character_id):
    data = load_data()
    if character_id in data["characters"]:
        abort(400, "Personnage déjà existant")
    data["characters"][character_id] = request.json
    write_data(data)
    return jsonify(data), 200

#---------------------------------- Routes test ----------------------------------
@app.route('/updateCharacterData/', methods=['POST'])
def update_character_data():
    try:
        data = load_data()

        character_id = str(request.json.get('characterId'))
        new_life = int(request.json.get('newLife'))
        new_armor = int(request.json.get('newArmor'))

        if character_id in data["charactersList"]:
            data["charactersList"][character_id]['life'] = new_life
            data["charactersList"][character_id]['armor'] = new_armor
            if new_armor <= 0:
                data["charactersList"][character_id]['armor'] = 0
            if new_life <= 0:
                del data["charactersList"][character_id]
            write_data(data)
            return jsonify({'success': True, 'charactersList': data["charactersList"]})
        else:
            return jsonify({'success': False, 'error': f'Character not found: {character_id}'}), 404
    except Exception as e:
        print("Error:", e)
        return jsonify({'success': False, 'error': 'Internal Server Error'}), 500

# Démarrer le serveur
if __name__ == '__main__':
    engine = Engine()
    app.run(debug=True)
    engine.run()

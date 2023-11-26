let url_img_character = "../static/img_character.PNG";
function populateSelect(elementId, data, prefix) {
    const selectElement = document.getElementById(elementId);

    Object.keys(data).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${prefix} ${key}`;
        selectElement.appendChild(option);
    });
}

fetch('/characterss/')
    .then(response => response.json())
    .then(data => populateSelect('character', data, 'Character'));

fetch('/arenass/')
    .then(response => response.json())
    .then(data => populateSelect('arena', data, 'Arena'));


document.getElementById('fetchArenas').addEventListener('click', function () {
    fetch('/arenass')
        .then(response => response.json())
        .then(arenasList => {
            document.getElementById('arenas').innerHTML = "";
            for (const arenaId in arenasList) {
                if (arenasList.hasOwnProperty(arenaId)) {
                    const characters = arenasList[arenaId].characters;
                    const arenaElement = document.createElement('li');
                    arenaElement.textContent = `Arène ${arenaId}: ${characters.join(', ')}`;
                    document.getElementById('arenas').appendChild(arenaElement);
                }
            }
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById('fetchCharacters').addEventListener('click', function () {
    fetch('/characterss')
        .then(response => response.json())
        .then(charactersList => {
            const characterTable = document.getElementById('characterTable');
            characterTable.innerHTML = "";

            for (const characterId in charactersList) {
                if (charactersList.hasOwnProperty(characterId)) {
                    const characterInfo = charactersList[characterId];
                    const characterElement = document.createElement('div');
                    characterElement.classList.add('card');

                    characterElement.innerHTML = `
                        <div class="card-inner">
                            <div class="character-container">
                                <img src="${url_img_character}" alt="Image of character"><br>
                                Personnage ${characterId}:<br>
                                Life: ${characterInfo.life},<br>
                                Strength: ${characterInfo.strength},<br>
                                Armor: ${characterInfo.armor},<br>
                                Speed: ${characterInfo.speed}, <br>
                                TeamId: ${characterInfo.teamId}
                            </div>
                        </div>`;
                        characterTable.appendChild(characterElement);
                }
            }
        })
        .catch(error => console.error('Error:', error));
});


document.getElementById('fetchAll').addEventListener('click', function () {
    fetch('/alldata')
        .then(response => response.json())
        .then(data => {
            const charactersList = data.charactersList;
            const arenasList = data.arenasList;
            document.getElementById('all').innerHTML = "";
            for (const arenaId in arenasList) {
                if (arenasList.hasOwnProperty(arenaId)) {
                    const characters = arenasList[arenaId].characters;
                    const arenaElement = document.createElement('li');
                    arenaElement.textContent = `Arène ${arenaId}: ${characters.join(', ')}`;
                    document.getElementById('all').appendChild(arenaElement);
                }
            }
            for (const characterId in charactersList) {
                if (charactersList.hasOwnProperty(characterId)) {
                    const characterInfo = charactersList[characterId];
                    const characterElement = document.createElement('li');
                    characterElement.textContent = `Personnage ${characterId}: 
                        Life: ${characterInfo.life}, 
                        Strength: ${characterInfo.strength}, 
                        Armor: ${characterInfo.armor}, 
                        Speed: ${characterInfo.speed},
                        TeamId: ${characterInfo.teamId}`;
                    document.getElementById('all').appendChild(characterElement);
                }
            }
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById('clearAll').addEventListener('click', function() {
    document.getElementById('arenas').innerHTML = '';
    document.getElementById('characterTable').innerHTML = '';
    document.getElementById('all').innerHTML = '';
});
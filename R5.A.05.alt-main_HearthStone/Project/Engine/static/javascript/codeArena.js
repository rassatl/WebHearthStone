let url_img_character = "../static/img/img_character.PNG";
let url_img_character2 = "../static/img/img_character2.PNG";

let playerGameTeamId = 1;
let isPlayerTurn = true;

document.getElementById('fetchCharactersForArena').addEventListener('click', function () {
    fetch('/characterss')
        .then(response => response.json())
        .then(charactersList => {
            const characterTablePlayer = document.getElementById('ally_trey');
            const characterTableEnemy = document.getElementById('ennemy_trey');
            characterTableEnemy.innerHTML = "";
            characterTablePlayer.innerHTML = "";

            for (const characterId in charactersList) {
                if (charactersList.hasOwnProperty(characterId)) {
                    const characterInfo = charactersList[characterId];
                    const characterElement = document.createElement('div');
                    characterElement.classList.add('card');
                    characterElement.classList.add('h-full');
                    characterElement.classList.add('w-[7vw]');
                    characterElement.dataset.teamId = characterInfo.teamId;
                    characterElement.dataset.life = characterInfo.life;
                    characterElement.dataset.strength = characterInfo.strength;
                    characterElement.dataset.armor = characterInfo.armor;
                    characterElement.dataset.speed = characterInfo.speed;

                    characterElement.draggable = isPlayerTurn;
                    characterElement.addEventListener('dragstart', dragstart);
                    // let imgAleatoir;
                    // if (Math.random() < 0.5) {
                    //     imgAleatoir = url_img_character;
                    // } else {
                    //     imgAleatoir = url_img_character2;
                    // }

                    // characterElement.innerHTML = `
                    // <div class="card">
                    //     <img src="../static/theUltimateCard.png" class="card-image" draggable="false">
                    //     <p>aze</p>
                    // </div>`;
                    
                    // characterElement.innerHTML = `
                    // <span></span>
                    // <div class="card-inner">
                    //     <div class="character-container">
                    //         <img src="${url_img_character}" alt="Image of character"
                    //             data-character-id="${characterId}"
                    //             data-team-id="${characterInfo.teamId}"
                    //             data-life="${characterInfo.life}"
                    //             data-strength="${characterInfo.strength}"
                    //             data-armor="${characterInfo.armor}"
                    //             data-speed="${characterInfo.speed}"><br>
                    //         Life: ${characterInfo.life}<br>
                    //         Strength: ${characterInfo.strength}<br>
                    //         Armor: ${characterInfo.armor}<br>
                    //         Speed: ${characterInfo.speed}
                    //     </div>
                    // </div>`;
                    if (characterInfo.teamId == 1) {
                        characterTablePlayer.appendChild(characterElement);
                    } else {
                        characterTableEnemy.appendChild(characterElement);
                    }
                    const arrowEnemyElement = document.getElementById('arrowEnemy');
                    const arrowFriendElement = document.getElementById('arrowFriend');
                    if (playerGameTeamId == 1) {
                        arrowEnemyElement.style.visibility = 'hidden';
                        arrowFriendElement.style.visibility = 'visible';
                    } else {
                        arrowEnemyElement.style.visibility = 'visible';
                        arrowFriendElement.style.visibility = 'hidden';
                    }

                }
            }
        })
        .catch(error => console.error('Error:', error));
});

function allowDrop(ev) {
    ev.preventDefault();
}

function dragstart(ev) {
    ev.dataTransfer.setData("application/json", JSON.stringify({ cardId: ev.currentTarget.id, html: ev.currentTarget.outerHTML }));
    ev.dataTransfer.setDragImage(ev.currentTarget, 0, 0);
}

function drop(ev) {
    ev.preventDefault();

    // Variables
    const probabilite = 0.4;
    const nombreAleatoire = Math.random();

    var data = ev.dataTransfer.getData("application/json");

    if (data) {
        var { cardId, html } = JSON.parse(data);

        var tempContainerEnemy = document.createElement("div");
        tempContainerEnemy.innerHTML = ev.target.innerHTML;
        var tempContainerFriend = document.createElement("div");
        tempContainerFriend.innerHTML = html;
        var tempContainerFriendTeamId = tempContainerFriend.innerHTML.match(/data-team-id="([^"]*)"/)[1];
        var tempContainerEnemyTeamId = tempContainerEnemy.innerHTML.match(/data-team-id="([^"]*)"/)[1];

        if (tempContainerFriendTeamId != playerGameTeamId)
            return;

        if (ev.target.classList.contains("card") || ev.target.classList.contains("card-inner") || ev.target.classList.contains("character-container")) {
            if (tempContainerFriendTeamId == tempContainerEnemyTeamId) {
                return;
            } else {
                var tempContainerFriendStrength = tempContainerFriend.innerHTML.match(/data-strength="([^"]*)"/)[1];
                var tempContainerEnemyLife = tempContainerEnemy.innerHTML.match(/data-life="([^"]*)"/)[1];
                var tempContainerEnemyId = tempContainerEnemy.innerHTML.match(/data-character-id="([^"]*)"/)[1];
                var tempContainerEnemyArmor = tempContainerEnemy.innerHTML.match(/data-armor="([^"]*)"/)[1];
                console.log("armuravant" + tempContainerEnemyArmor)
                if (nombreAleatoire < probabilite || tempContainerEnemyArmor == 0) {
                    tempContainerEnemyLife = tempContainerEnemyLife - tempContainerFriendStrength;
                } else {
                    tempContainerEnemyArmor = tempContainerEnemyArmor - tempContainerFriendStrength;
                }
                console.log("armurapres" + tempContainerEnemyArmor)
                fetch('/updateCharacterData/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        characterId: tempContainerEnemyId,
                        newLife: tempContainerEnemyLife,
                        newArmor: tempContainerEnemyArmor,
                    }),
                })
                    .then(response => response.json())
                    .then(updatedCharactersList => {
                        document.getElementById('fetchCharactersForArena').click();
                    })
                    .catch(error => console.error('Error updating character life:', error));
            }
        } else {
            console.log("Target is not a card");
            return;
        }
    } else {
        console.error("No data transferred during drag");
    }
}

document.getElementById('changeTurnButton').addEventListener('click', function () {
    isPlayerTurn = !isPlayerTurn;
    playerGameTeamId = playerGameTeamId == 1 ? 2 : 1;
    const arrowEnemyElement = document.getElementById('arrowEnemy');
    const arrowFriendElement = document.getElementById('arrowFriend');
    if (playerGameTeamId == 1) {
        arrowEnemyElement.style.visibility = 'hidden';
        arrowFriendElement.style.visibility = 'visible';
    } else {
        arrowEnemyElement.style.visibility = 'visible';
        arrowFriendElement.style.visibility = 'hidden';
    }
    alert("isPlayerTurn: " + isPlayerTurn + ", playerGameTeamId: " + playerGameTeamId);
});


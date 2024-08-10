var gameData = { 
    gold: 0,
    goldPerClick: 1,
    goldPerClickCost: 10
}

function mineGold() {
    gameData.gold += gameData.goldPerClick;
    document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined";
}

function buyGoldPerClick() {
    if (gameData.gold >= gameData.goldPerClickCost) {
        gameData.gold -= gameData.goldPerClickCost
        gameData.goldPerClick += 1
        gameData.goldPerClickCost *= 2
        document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined"
        document.getElementById("perClickUpgrade").innerHTML = "Upgrade Pickaxe (Currenty level " 
            + gameData.goldPerClick + ") Cost: " + gameData.goldPerClickCost + " Gold"
    }
}

function saveGame() {
    var save = gameData;
    localStorage.setItem("save", JSON.stringify(save));
}

function loadGame() {
    var savegame = JSON.parse(localStorage.getItem("save"));
    if (savegame != null) {
        gameData = savegame;
        console.log("gameData updated")
        console.log("savegame")
        console.log(savegame)
        console.log("gameData")
        console.log(gameData)
    }
    updateUI();
}

function deleteSave() { 
    localStorage.removeItem("save");
}

function updateUI() {
    document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined";
    document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined"
    document.getElementById("perClickUpgrade").innerHTML = "Upgrade Pickaxe (Currenty level " 
        + gameData.goldPerClick + ") Cost: " + gameData.goldPerClickCost + " Gold"
}

var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("save", JSON.stringify(gameData))
},15000)

var mainGameLoop = window.setInterval(function() {
    mineGold()
}, 1000)

window.onload = loadGame();
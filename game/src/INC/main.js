var gameData = { 
    gold: 0,
    goldPerClick: 1,
    goldPerClickCost: 10,
    dwarves: 0,
    goldCostPerDwarf: 100,
    goldMinedPerDwarf: 10
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

function buyDwarves() {
    if (gameData.gold >= gameData.goldCostPerDwarf) {
        gameData.gold -= gameData.goldCostPerDwarf
        gameData.dwarves += 1
        gameData.goldCostPerDwarf *= 2
        document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined"
        document.getElementById("dwarves").innerHTML = "Buy Dwarves (Currenty have " 
            + gameData.dwarves + ") Cost: " + gameData.goldCostPerDwarf + " Gold"
    }
}

function updateStatus (txt) {
    document.getElementById("statusText").setAttribute("class", "text-fade");
    setTimeout(() => {
        document.getElementById("statusText").innerHTML = txt;
        document.getElementById("statusText").setAttribute("class", "text-show");
    }, 500);
    setTimeout(() => {
        document.getElementById("statusText").setAttribute("class", "text-fade");
        setTimeout(() => {
            document.getElementById("statusText").innerHTML = "";
        }, 500);      
    }, 2000);
}

function saveGame() {
    var save = gameData;
    localStorage.setItem("save", JSON.stringify(save));
    updateStatus("Game Saved");
}

function loadGame() {
    var savegame = JSON.parse(localStorage.getItem("save"));
    if (savegame != null) {
        gameData = savegame;
    }
    updateUI();
    updateStatus("Game Loaded");
}

function deleteSave() { 
    localStorage.removeItem("save");
    window.location.reload();
    updateStatus("Game Reset");
}

function updateUI() {
    document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined";
    document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined"
    document.getElementById("perClickUpgrade").innerHTML = "Upgrade Pickaxe (Currenty level " 
        + gameData.goldPerClick + ") Cost: " + gameData.goldPerClickCost + " Gold"
    document.getElementById("dwarves").innerHTML = "Buy Dwarves (Currenty have " 
        + gameData.dwarves + ") Cost: " + gameData.goldCostPerDwarf + " Gold"
}

var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("save", JSON.stringify(gameData))
},15000)

var mainGameLoop = window.setInterval(function() {
    dwarfMiners()
}, 1000)

function dwarfMiners() {
    gameData.gold += gameData.dwarves * gameData.goldMinedPerDwarf
    document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined";
}

window.onload = loadGame();
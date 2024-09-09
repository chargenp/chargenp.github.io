var gameData = {
	pebbles: 0,
	shardlevel: 1,
	shardcost: 20,
	shardpower: 1,
	shardproduction: 0,
	fey: 0,
	feycost: 100,
	feypower: 1,
	feyproduction: 0,
	feyinterval: 5000,
	gold: 0,
	dwarves: 0,
	dwarfcost: 10,
	dwarfpower: 2,
	dwarfproduction: 0,
	dwarfinterval: 3000
};

function bribeDwarf() {
	if (gameData.gold >= gameData.dwarfcost) {
		gameData.gold -= gameData.dwarfcost;
		gameData.dwarves += 1;
		calcDwarfProduction();
		calcDwarfCost();
		updateUI();
	}
}

function dwarfProduction() {
	gameData.pebbles += gameData.dwarfproduction;
	updateCurrencies();
}

function calcDwarfCost() {
	gameData.dwarfcost = Math.round(10 * ((2.3)**(gameData.dwarves)));
}

function calcDwarfProduction() {
	gameData.dwarfproduction = ((1 * gameData.shardlevel) * gameData.shardpower) * ((1 * gameData.dwarves) * gameData.dwarfpower); // (pebble function) * (base * owned) * multipliers
}

function feyProduction() {
	if (gameData.pebbles >= gameData.feyproduction) {
		gameData.pebbles -= gameData.feyproduction;
		gameData.gold += gameData.feyproduction;
		updateCurrencies();
	}
}

function recruitFey() {
	if (gameData.pebbles >= gameData.feycost) {
		gameData.pebbles -= gameData.feycost;
		gameData.fey += 1;
		calcFeyProduction();
		calcFeyCost();
		updateUI();
	}
}

function calcFeyCost() {
	gameData.feycost = Math.round(100 * ((1.9)**(gameData.fey)));
}

function calcFeyProduction() {
	gameData.feyproduction = ((1 * gameData.fey) * gameData.feypower); // (base * owned) * multipliers
}

function calcShardCost() {
	gameData.shardcost = Math.round(20 * ((1.5)**(gameData.shardlevel - 1)));
	
}

function makePebbles() {
	gameData.pebbles += gameData.shardproduction;
	document.getElementById("pebbles").innerHTML = gameData.pebbles + " Pebbles";
}

function calcShardProduction() {
	gameData.shardproduction = ((1 * gameData.shardlevel) * gameData.shardpower); // (base * owned) * multipliers
}

function increaseShardSize() {
	if (gameData.pebbles >= gameData.shardcost) {
		gameData.pebbles -= gameData.shardcost;
		gameData.shardlevel += 1;

		calcShardCost();
		calcShardProduction();
		calcDwarfProduction();
		updateUI();
	}
}

function updateCurrencies() {
	document.getElementById("pebbles").innerHTML = gameData.pebbles + " Pebbles";
	document.getElementById("gold").innerHTML = gameData.gold + " Gold";
}

function updateUI() {
	calcDwarfCost();
	calcFeyCost();
	calcShardCost();
	calcDwarfProduction();
	calcFeyProduction();
	calcShardProduction();
	updateCurrencies();
	document.getElementById("shardlevel").innerHTML = "Shard&nbspSize:&nbsp;" + gameData.shardlevel  + "&ensp;&ensp;" + gameData.shardproduction + "&nbspPebbles&nbsp/&nbspclick";
	document.getElementById("shardcost").innerHTML = "Cost: " + gameData.shardcost + "&ensp;&ensp;"; 
	var ratio = 
	document.getElementById("fey").innerHTML = gameData.fey + "&nbspFey&nbspCreatures" + "&ensp;&ensp;" 
		+ gameData.feyproduction + "&nbspGold&nbspConversion&nbsp/&nbsp" + (gameData.feyinterval/1000) + "s";
	document.getElementById("feycost").innerHTML = "Cost: " + gameData.feycost + "&ensp;&ensp;" ;
	document.getElementById("dwarfcost").innerHTML = "Cost: " + gameData.dwarfcost + "&ensp;&ensp;";
	document.getElementById("dwarves").innerHTML = gameData.dwarves + "&nbspDwarves&nbspBribed&ensp;&ensp;" 
		+ gameData.dwarfproduction + "&nbspPebbles&nbsp/&nbsp" + (gameData.dwarfinterval/1000) + "s";
	
	
}

function updateStatus(txt) {
	document.getElementById("statustext").innerHTML = txt;
	document.getElementById("statustext").setAttribute("class", "text-show");
	setTimeout(() => { 
		document.getElementById("statustext").setAttribute("class", "text-hide");
	}, 1000);
}

function saveGame(txt) {
	localStorage.setItem("save", JSON.stringify(gameData));
	saveCheckboxStates();
	updateStatus(txt);
}

function loadGame() {
	var savegame = JSON.parse(localStorage.getItem("save"));
	if (savegame != null) {
		Object.keys(gameData).forEach(key => {
			if (Object.hasOwnProperty.call(savegame, key)){
				gameData[key] = savegame[key];		
			}
		});
	}
	loadCheckboxStates();
	updateUI();
	updateStatus("game loaded");
}

function deleteGame() {
	localStorage.removeItem("save");
	localStorage.removeItem("cb1-6");
	location.reload();
}

function saveCheckboxStates() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	checkboxes.forEach((checkbox) => {
		localStorage.setItem(checkbox.id, checkbox.checked);
	});
}

function loadCheckboxStates() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	checkboxes.forEach((checkbox) => {
		const savedState = localStorage.getItem(checkbox.id);
		if (savedState != null) {
			checkbox.checked = savedState === 'true';
			if(document.getElementById('cb1-6').checked) {
				savegameloop = window.setInterval(function(){
					saveGame("Autosaved");
				}, 15000); 
			}
			else {
				clearInterval(savegameloop);
			}
		}
	});
}

var savegameloop;

var feyloop = window.setInterval(function() {
	if (gameData.fey > 0) {
		feyProduction();
	}
}, gameData.feyinterval);

var dwarfloop = window.setInterval(function() {
	if (gameData.dwarves > 0) {
		dwarfProduction();
	}
}, gameData.dwarfinterval);


//Jquery
 $(document).ready(function() {
	loadGame();
    $('.tabContent').not(':first').hide();
    $('.tabs a').click(function() {  
      $('.tabContent').hide();
      $('.tabs a').removeClass('active');
      $(this).addClass('active');
      var tab = $(this).data('tab');
      $('#' + tab).show();
 	});

	$('.autosave').on("click", function() {
		var checkboxes = $('input[type="checkbox"]');
		checkboxes.prop("checked", !checkboxes.prop("checked"));
		if(document.getElementById('cb1-6').checked) {
			savegameloop = window.setInterval(function(){
				saveGame("Autosaved");
			}, 15000); 
		}
		else {
			clearInterval(savegameloop);
		}	
		saveCheckboxStates();
	});

	$('#cb1-6').change(function() {
		saveCheckboxStates();
		if(document.getElementById('cb1-6').checked) {
			savegameloop = window.setInterval(function(){
				saveGame("Autosaved");
			}, 15000); 
		}
		else {
			clearInterval(savegameloop);
		}	
	});
	
 });



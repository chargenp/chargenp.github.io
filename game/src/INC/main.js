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

function saveGame() {
	localStorage.setItem("save", JSON.stringify(gameData));
	saveCheckboxStates();
	updateStatus("Saved");
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
			if (checkbox.checked === true) {
				savegameloop = window.setInterval(function() {
				localStorage.setItem("save", JSON.stringify(gameData));
				updateStatus("Autosaved");
				}, 15000);
			}
		}
	});
}

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => { 
	checkbox.addEventListener('change', saveCheckboxStates);
	checkbox.addEventListener('change', (event) => {
		if (event.currentTarget.checked) {
			savegameloop = window.setInterval(function() {
				localStorage.setItem("save", JSON.stringify(gameData));
				updateStatus("Autosaved");
			}, 5000);
		} else {
			clearInterval(savegameloop);
		}
	});			
});
	
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

$(document).ready(function(){
	loadGame();
});

 $(document).ready(function() {
    // Hide all tab content except the first
    $('.tabContent').not(':first').hide();
    // Bind click event to tabs links
    $('.tabs a').click(function() {  
      //Hide all tab content
      $('.tabContent').hide();
      // Remove active class from all tabs links
      $('.tabs a').removeClass('active');
      // Add active class to clicked tab link
      $(this).addClass('active');
      // Get data-tab attribute value
      var tab = $(this).data('tab');
      // Show corresponding tab content
      $('#' + tab).show();
    });
  });

 



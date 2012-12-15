

var SpawnMinions = require("./spawn-minions.js");

var sp = new SpawnMinions();
	sp.armyGo(
		["./minion.js", "testing1"],
		["./minion.js", "testing2"]
	)
	.warReport(function(e, pos, data, result){
		console.log("e", e)
		console.log("pos", pos)
		console.log("data", data)
		console.log("result", result)
	})
	.conquered(function(e){
		console.log(e);
	});


var SpawnMinions = require("./spawn-minions.js");

var sp = new SpawnMinions();
	sp.armyGo(
		["./minion.js", "testing1"],
		["./minion.js", "testing2"],
		["./minion.js", "testing3"],
		["./minion.js", "testing4"],
		["./minion.js", "testing5"],
		["./minion.js", "testing6"],
		["./minion.js", "testing7"],
		["./minion.js", "testing8"],
		["./minion.js", "testing9"],
		["./minion.js", "testing10"],
		["./minion.js", "testing11"],
		["./minion.js", "testing12"],
		["./minion.js", "testing13"]
	)
	.warReport(function(e, pos, data, result){
		// REMOVE THIS TO SEE EACH PROCESSES RESULT
		return;
		console.log("e", e)
		console.log("pos", pos)
		console.log("data", data)
		console.log("result", result)
	})
	.conquered(function(e){
		console.log(e);
	});

	var queueCheck = setInterval(function(){
		console.log("Queue - " + sp.queue.length);
		console.log("processQueue - " + sp.processQueue.length);
		console.log("finishedQueue - " + sp.finishedQueue.length);
		if(sp.finishedQueue.length !== 0 && sp.processQueue.length === 0 && sp.queue.length === 0 ){
			clearInterval(queueCheck);
		};
	}, 500);

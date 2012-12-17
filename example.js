

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
	// Executed when the thread reports STDOUT data event
	.signalFlare(function(pos, messageData, data){
		// REMOVE THIS TO SEE EACH PROCESSES RESULT
		return;
		console.log("pos", pos) // position of minion request as above in armyGo() [....]
		console.log("messageData", messageData) // single instance of buffer output
		console.log("data", data) // all of the buffer output concatenated
	})
	// Executed when a minion exits
	.warReport(function(e, pos, data, result){
		// REMOVE THIS TO SEE EACH PROCESSES RESULT
		return;
		console.log("e", e) // Error
		console.log("pos", pos) // position of minion request as above in armyGo() [....]
		console.log("data", data) // all of the buffer output concatenated
		console.log("result", result) // Passed back from thread/minion
	})
	// Executed when all of the minions are finished
	.conquered(function(e){
		console.log(e); // Error
	});

	var queueCheck = setInterval(function(){
		console.log("queue - " + sp.queue.length); // waiting to process
		console.log("processQueue - " + sp.processQueue.length); // in process
		console.log("finishedQueue - " + sp.finishedQueue.length); // finished processing
		if(sp.finishedQueue.length !== 0 && sp.processQueue.length === 0 && sp.queue.length === 0 ){
			clearInterval(queueCheck);
		};
	}, 500);

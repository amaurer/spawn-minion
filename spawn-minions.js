
var child_process = require('child_process');
var numCPUs = require('os').cpus().length;

function SpawnMinions(){
	this.processes = [];
};

SpawnMinions.prototype.armyGo = function(processScript, argumentArray) {
	for (var i = 0, len = argumentArray.length; i<len; i++) {
		this.processes.push(
			child_process.exec(processScript, argumentArray[i], function(error, stdout, stderr){
				console.log(arguments);
			})
		);
	};
				console.log(this.processes);
};

/*
grep.on('exit', function (code, signal) {
  console.log('child process terminated due to receipt of signal '+signal);
});
*/

module.exports = SpawnMinions;
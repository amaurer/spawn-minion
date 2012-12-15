
var child_process = require('child_process');


function SpawnMinions(){
	this.numCPUs = require('os').cpus().length;
	this.processes = [];
	this.queue = [];
	this.processQueue = [];
	this.finishedQueue = [];
	this._cb = {
		report : function(){},
		done : function(){}
	};
	this.uuid = require("node-uuid");
};

SpawnMinions.prototype.armyGo = function() {

	/*
		arguments pattern
			[
				[path, arg, arg],
				[path, arg, arg]
			]
	*/

	// copy args for queue
	for (var i = 0, len = arguments.length; i<len; i++) {
		this.queue.push({
			args : arguments[i],
			data : "",
			e : null,
			pos : i,
			uid : this.uuid.v1()
		});
	};
	for (i = 0, len = this.numCPUs; i<len; i++) {
		this.processJob();
	};

	return this;
};

SpawnMinions.prototype.conquered = function(cb) {
	this._cb.done = cb;
	return this;
};

SpawnMinions.prototype.warReport = function(cb) {
	this._cb.report = cb;
	return this;
};

SpawnMinions.prototype.wasError = function(cb) {
	for (var i = 0, len = this.finishedQueue.length; i<len; i++) {
		if(this.finishedQueue[i].e) return true;
	};
	return false;
};

SpawnMinions.prototype.getJob = function(queueName, uid) {
	for (var i = 0, x, len = this[queueName].length; i<len; i++) {
		if(this[queueName][i].uid === uid) return i;
	};
	return null;
};

SpawnMinions.prototype.processJob = function() {
	
	// None left, finish the job
	if(this.queue.length === 0){
		if(this.processQueue.length === 0){
			// nothing left to do
			this._cb.done(this.wasError());
			return true;
		} else {
			// None left to process but things are still running
			return false;
		}
	};


	var node;
	var self = this;
	var queueObject = this.queue.pop();
	var jobUID = queueObject.uid;

	this.processQueue.push(queueObject);
	node = child_process.spawn("node", queueObject.args);

	node.stdout.on("data", function(databuffer){
		var processPos = self.getJob("processQueue", jobUID);
		self.processQueue[processPos].data += databuffer.toString();
	});

	node.on("close", function(e, param){
		var processPos = self.getJob("processQueue", jobUID);
		var finishedJob = self.processQueue.splice(processPos, 1)[0];
			finishedJob.e = (e === 0)? null : e;

		// report back to the user and add to finished Queue
		self._cb.report(finishedJob.e, finishedJob.pos, finishedJob.data, param);
		self.finishedQueue.push(finishedJob);

		// Proccess Next Job
		self.processJob();
	});
	
	return this;
};

module.exports = SpawnMinions;
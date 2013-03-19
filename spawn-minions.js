
var child_process = require('child_process');


function SpawnMinions(){
	this.childProcessName = 'node';
	this.numCPUs = require('os').cpus().length;
	this.queue = [];
	this.processQueue = [];
	this.finishedQueue = [];
	this._cb = {
		report : function(){},
		done : function(){},
		incomingData : function(){}
	};
	this.uuid = require("node-uuid");
};

SpawnMinions.prototype.setChildProcessName = function(name) {
	if(name){
		this.child_process_name = name;
	}
	return this;
};

SpawnMinions.prototype.addJob = function() {
	var nextJobIdx = this.queue.length;
	for (var i = 0, len = arguments.length; i<len; i++) {
		this.queue.push({
			args : arguments[i],
			data : "",
			e : null,
			pos : nextJobIdx + i,
			uid : this.uuid.v1()
		});
	}
	return this;
};
SpawnMinions.prototype.start = function() {
	for (var i = 0, len = this.numCPUs; i<len; i++) {
		this.processJob();
	};
	return this;
}

SpawnMinions.prototype.armyGo = function() {

	/*
		arguments pattern
			(
				[path, arg, arg],
				[path, arg, arg]
			)
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

SpawnMinions.prototype.signalFlare = function(cb) {
	this._cb.incomingData = cb;
	return this;
};

SpawnMinions.prototype.causalty = function(cb) {
	this._cb.errorHandler = cb;
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
	var childProcessName = this.child_process_name;

	this.processQueue.push(queueObject);
	node = child_process.spawn(childProcessName, queueObject.args); // CHANGED from 'node' to 'coffee'

	node.stdout.on("data", function(databuffer){
		var stringdata = databuffer.toString();
		var processPos = self.getJob("processQueue", jobUID);
		var job = self.processQueue[processPos];
			job.data += stringdata;
		// report a data message to the user
		self._cb.incomingData(job.pos, stringdata, job.data);
	});

	node.stderr.on("data", function(){
		console.log("on stderr this = ",this,", args = ",arguments);
		if(self._cb.errorHandler)
			self._cb.errorHandler.apply(this, arguments)
	});

	node.on("close", function(e, param){
		var processPos = self.getJob("processQueue", jobUID);
		var job = self.processQueue.splice(processPos, 1)[0];
			job.e = (e === 0)? null : e;

		// report back to the user and add to finished Queue
		self._cb.report(job.e, job.pos, job.data, param);
		self.finishedQueue.push(job);

		// Proccess Next Job
		self.processJob();
	});
	
	return this;
};

module.exports = SpawnMinions;

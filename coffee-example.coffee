#!/usr/bin/env coffee

SpawnMinions = require './spawn-minions.js'

sp = new SpawnMinions()
sp.setChildProcessName 'coffee'

for i in [1..13]
	sp.addJob ["./minion.coffee", "testing#{i}"]

sp.start()

#// Executed when a message or data is sent from the process. Used for sending back data instead of text
.causalty( (e) -> console.log('error', e.toString()) )

#// Executed when the thread reports STDOUT data event
.signalFlare( (pos, messageData, data) ->
	#// REMOVE THIS TO SEE EACH PROCESSES RESULT
	return
	console.log("pos", pos) #// position of minion request as above in armyGo() [....]
	console.log("messageData", messageData) #// single instance of buffer output
	console.log("data", data) #// all of the buffer output concatenated
)

#// Executed when a minion exits
.warReport((e, pos, data, result) ->
	#// REMOVE THIS TO SEE EACH PROCESSES RESULT
	return
	console.log 'e', e  #// Error
	console.log 'pos', pos # // position of minion request as above in armyGo() [....]
	console.log 'data', data # // all of the buffer output concatenated
)

#// Executed when all of the minions are finished
.conquered((e) -> console.log(e) )

#// Remove this to see the queue
#
queueCheckFunc = () ->
	console.log "queue - #{sp.queue.length}" #// waiting to process
	console.log "processQueue - #{sp.processQueue.length}" #// in process
	console.log "finishedQueue - #{sp.finishedQueue.length}" #// finished processing
	clearInterval queueCheck if sp.finishedQueue.length isnt 0 and
		sp.processQueue.length is 0 and
		sp.queue.length is 0
queueCheck = setInterval queueCheckFunc,500


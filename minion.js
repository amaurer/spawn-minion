var timeDur = Math.random(2000, 5000) * 10000;
console.log(timeDur)
setTimeout(function(){
	console.log(process.argv)
}, timeDur);

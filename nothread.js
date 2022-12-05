var crypto = require('crypto');

setInterval(function() {

	var id = Math.random();
	var data = crypto.randomBytes(1024 * 1024);

	var h = crypto.createHash('sha256');
	h.update(data);

	console.log('thread complete', id, h.digest('hex'));
			
}, 20);

var crypto = require('crypto');
const {Worker, isMainThread, MessageChannel, parentPort} = require('node:worker_threads');

setInterval(function() {

	const {port1, port2} = new MessageChannel();

	var id = Math.random();
	var data = crypto.randomBytes(1024 * 1024);

	port2.on('message', function(m) {
		// message from worker thread
		console.log('thread complete', id, m.h);

	}.bind({id: id}));

	if (isMainThread) {
		// start worker thread
		const worker = new Worker(__filename);
		// send required data to worker
		worker.postMessage({port1: port1, id: id, data: data}, [port1]);

	} else {

		parentPort.once('message', (value) => {
			// process
			console.log('processing data for', value.id);

			var h = crypto.createHash('sha256');
			h.update(value.data);
			
			// return data after processing
			value.port1.postMessage({h: h.digest('hex')});

		});

	}

}, 20);

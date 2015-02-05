var app = require('../app');
var http = require('http');
var port = 3000;

app.set('port', port);

// create http server
var server = http.createServer(app);

// listen on port
server.listen(port);
server.on('listening', onListening);

function onListening () {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	console.log('Listening on ' + bind);	
}
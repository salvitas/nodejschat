var express = require('express');
var app = express.createServer();

var io = require('socket.io').listen(app);

var port = process.env.PORT || 8888;

app.configure(function() {
	app.set('view options', {
		layout: false
	});
	
	app.use(express.static(__dirname + '/static'));
});

io.configure(function() {
	io.disable('log');
});

app.listen(port, function() {
	console.log("Listening on port " + port);
});


app.get('/', function(request, response) {
	response.render('main.jade');

});

require('./io')(io);
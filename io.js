

module.exports = function(io) {
	io.sockets.on('connection', function(socket) {
		console.log('Client connected');
	
		socket.on('set_nickname', function(nickname, callback) {
			console.log('Setting nickname: ' + nickname + '...');
		
			var isAvailable = isNicknameAvailable(nickname);
			if(isAvailable) {
				socket.nickname = nickname;
				socket.color = getRndColor();
				console.log('Setting nickname: ' + nickname + '...OK - color:' + socket.color);
				sendMessage('SERVER', 'User @' + nickname + ' has connected.', socket.color);
			} else {
				console.log('Setting nickname: ' + nickname + '...KO');
			}
			
			callback(isAvailable);
			
			
		}); 
	
		socket.on('message', function(message) {
			sendMessage(socket.nickname, message, socket.color);
		});
		
		socket.on('disconnect', function() {
			sendMessage('SERVER', 'User @' + socket.nickname + ' has disconnected! ');
		});
		
	});
	
	var sendMessage = function(nickname, message, color) {
		io.sockets.emit('message', nickname, message, color);
	};
	
	var isNicknameAvailable = function(nickname) {
		var clients = io.sockets.clients();
		
		for(var client in clients) {
			if(clients.hasOwnProperty(client)) {
				client = clients[client];
				
				if(client.nickname == nickname)
					return false;
			}
		}
		
		return true;
	};
	
	var getRndColor = function() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * 15)];
	    }
	    return color;
	}
}
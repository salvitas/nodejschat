$(function() {
	var login = $('#login'),
		chat = $('#chat'),
		alert = $('#alert');
		messages = $('#messages');
		typing = $('#typing');
	var socket = io.connect('/');
	
	socket.on('connect', function() {
		console.log('Connected with socket');
		
		init();
	});
	
	var init = function() {	
		chat.hide();
		
		$('#nickname').keyup(function(e) {
			var code = e.wich || e.keyCode;
		
			if(code == 13) {
				setNickname($(this).val());
			}
		});
		
		$('#message').keyup(function(e) {
			var code = e.wich || e.keyCode;
		
			if(code == 13) {
				sendMessage($(this).val());
				$(this).val('');
				typing.html('');
			} else {
				sendTyping();
			}
		});
		
	}
	
	var setNickname = function(nickname) {
		socket.emit(
			'set_nickname', 
			nickname, 
			function(is_available) {
				if (is_available) {
					console.log('Nickname ' + nickname + ' is available');
					
					setUpChat(nickname);
				} else {
					console.log('Nickname ' + nickname + ' is not available!');
					addAlert('SERVER: User @' + nickname + ' is online, use different nickname!');
				}
		});
	};
	
	var setUpChat = function(nickname) {
		login.hide();
		chat.show();
		
		$('#submit-message').click(function() {
			sendMessage($('#message').val());
			$('#message').val('');
		});
		
		socket.on('message', function(nickname, message, color) {
			addMessage(nickname, message, color);
		});
		
		socket.on('is_typing', function(nickname, message, color) {
			inserTyping(nickname, message, color);
		});
	};
	
	var sendMessage = function(msg) {
		socket.emit('message', msg);
	};
	
	var sendTyping = function(msg) {
		socket.emit('is_typing');
	};
	
	var addMessage = function(nickname, message, color) {
		messages.append($('<li style="color:'+color+'">@' + nickname +' >> ' + message +'</li>'));
	};
	
	var inserTyping = function(nickname, message, color) {
		typing.html($('<p style="color:'+color+'">@' + nickname + ' ' + message +'</p>'));
	};
	
	var addAlert = function(message) {
		alert.append($('<p class="alert">' + message + '</p>'));
	};
	
});

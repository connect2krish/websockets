var http = require('http');
var express = require('express')
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.PORT || 3000);

console.log("Server running....");

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	console.log('Conneted');
	connections.push(socket);
	console.log('Conneted: %s sockets connected ', connections.length);

	//disconnect
	socket.on('disconnect', function(data) {
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected ', connections.length);
	});

	//send message
	socket.on('send message', function(data) {
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	//new users

	socket.on('new user', function(data, callback) {
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames() {
		io.sockets.emit('get users', users);
	}
});


//
// // Start the server at port 8080
// var server = http.createServer(function(req, res) {
// 	// Send HTML headers and message
// 	res.writeHead(200,{ 'Content-Type': 'text/html' });
// 	res.end('<h1>Hello Socket Lover!</h1>');
// });
// server.listen(8080);
//
// // Create a Socket.IO instance, passing it our server
// var socket = io.listen(server);
//
// // Add a connect listener
// socket.on('connection', function(client){
//
// 	// Create periodical which ends a message to the client every 5 seconds
// 	var interval = setInterval(function() {
// 		client.send('This is a message from the server!  ' + new Date().getTime());
// 	},5000);
//
// 	// Success!  Now listen to messages to be received
// 	client.on('message',function(event){
// 		console.log('Received message from client!',event);
// 	});
// 	client.on('disconnect',function(){
// 		clearInterval(interval);
// 		console.log('Server has disconnected');
// 	});
//
// });

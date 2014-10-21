
'use strict';

var SocketEngine = {

	socket: null,
	board: null,

	start: function(board) {
		this.socket = io();

		this.board = board;

		this.socket.emit('open', board);

		this.socket.on('chat message', function(msg){
		});
	},

	boardMessage: function(msg) {
		this.socket.emit('board message', msg);
	}
};

module.exports = SocketEngine;
/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Net = require('../assets/js/collab-engine');


var ChatObject = React.createClass({
	render: function() {
		var content = '';

		switch(this.props.data.typeid) {
			case 1:
				content = (<div className="chat-object">
					<img src={this.props.data.picsrc} />
					<span className="chat-message">{this.props.data.msg}</span>
				</div>);
				break;
			case 2:
				content = (<div></div>);
				break;
		}

		return (<div key={this.props.id} className="chat">
				<span className="meta">{this.props.data.title + " "}</span>
				<time className="time timeago" dateTime={(new Date(this.props.data.timestamp)).toISOString()}></time>
				<span className="time"></span>
				<span className="from"> via {this.props.data.from}</span>
				{content}
			</div>);
	}
});


var ChatFrame = React.createClass({
	getInitialState: function() {
		return {
			chats: [],
		}
	},

	componentWillMount: function() {
		Action.netBoardMessage((data) => {
			this.addChat(data);
		});
	},
	componentDidUpdate: function() {
		$('.chat-box').timeago('refresh');
		var box = this.refs.chatscroll.getDOMNode();
  		box.scrollTop = box.scrollHeight;
	},
	componentDidMount: function() {
		$('.chat-box').timeago();
	},

	componentWillUnmount: function() {
		console.debug('TODO: unsubscribe netBoardMessage');
	},

	addChat: function(data) {
		var chats = this.state.chats;
		chats.push(data);
		this.setState({chats: chats});
	},

	renderChatObj: function(chat) {

	},

	onSubmit: function(e) {
		Net.boardMessage(this.refs.chatinput.getDOMNode().value);
		this.refs.chatinput.getDOMNode().value = '';
		e.preventDefault();
		return false;
	},

	render: function() {
		var chats = this.state.chats.map(function(v) {
			return (<ChatObject data={v}/>);
		});
		return (
			<div className="chat-box">
				<div ref="chatscroll" className="chat-scroll">
					<div className="chat">
						<span className="meta">
							<a target="_blank" href="https://quip.com/ijIwAr1tOkQ1">Please read this first.</a>
						</span>
					</div>
					{chats}
				</div>
				<form onSubmit={this.onSubmit}>
					<input type="text" ref="chatinput" />
				</form>
			</div>
		);
	}
})
;
module.exports = ChatFrame;
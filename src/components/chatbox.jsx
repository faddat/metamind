/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');


var ChatMessage = React.createClass({

				// <time className="time timeago" dateTime={(new Date(this.props.data.timestamp)).toISOString()}></time>
				// <span className="time"></span>
				// <span className="from"> via {this.props.data.from}</span>
	render: function() {
		return false;
	}
});

var ChatObject = React.createClass({
	propTypes: {
		t: React.PropTypes.number
	},
	render: function() {
		// switch(this.props.data.t) {
		// 	case 1:
		// 		content = (<div className="chat-object">
		// 			// <img src={this.props.data.picsrc} />
		// 			// <span className="chat-message">{this.props.data.msg}</span>
		// 		</div>);
		// 		break;
		// 	case 2:
		// 		content = (<div></div>);
		// 		break;
		// }

		return (<div className="chat">
				<span className="meta">{this.props.data.text + " "}</span>
				{this.props.children}
			</div>);
	}
});


var ChatFrame = React.createClass({
    mixins: [Reflux.ListenerMixin],

    propTypes: {
    	id: React.PropTypes.string
    },

	getInitialState: function() {
		return {
			chats: [],
		}
	},

	componentWillMount: function() {
		Store.mapchat.openChannel(this.props.id);

		this.listenTo(Store.mapchat, this.onChat);
	},

	componentWillUnmount: function() {
		Store.mapchat.closeChannel();
	},

	componentDidUpdate: function() {
		// $('.chat-box').timeago('refresh');
		var box = this.refs.chatscroll.getDOMNode();
  		box.scrollTop = box.scrollHeight;
	},

	componentDidMount: function() {
		// $('.chat-box').timeago();
	},

	onChat(data) {
		this.setState({
			chats: data.chats
		});
	},

	onSubmit: function(e) {
		Store.mapchat.create({
			t: 0,
			text: this.refs.chatinput.getDOMNode().value
		});
		this.refs.chatinput.getDOMNode().value = '';
		e.preventDefault();
		return false;
	},

	render: function() {
		var chats = this.state.chats.map(function(v) {
			return (<ChatObject key={v.id} data={v} />);
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
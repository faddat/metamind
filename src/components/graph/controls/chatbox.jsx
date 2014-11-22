/**

 * @jsx React.DOM
 */

var React = require('react');
var Reflux = require('reflux');
var ChatUsers = require('./chatusers.jsx');

var ChatMessage = React.createClass({

	chatStyle: ReactStyle({
		maxWidth: 500,
		margin: '12px 0',
		position: 'relative'
	}),

	chatObjectStyle: ReactStyle({
		fontSize: '12pt',
		marginLeft: 40,
	}),

	chatMessageStyle: ReactStyle({
		fontSize: '12pt',
		display: 'block',
		opacity: '0.9',

	}),

	chatMessageImageStyle: ReactStyle({
		position: 'absolute',
		left: 0,
		top: 2,
		width: 35,
		height: 35,
		borderRadius: 18,
		boxShadow: '0 5px 5px rgba(0, 0, 0, 0.4);'
	}),

	chatTime: ReactStyle({
		opacity: '0.4'
	}),

	chatFrom: ReactStyle({
		opacity: '0.4'
	}),

	chatMeta: ReactStyle({
		opacity: '0.7',
		fontWeight: '500'
	}),

	render: function() {
		return (<div styles={this.chatStyle}>
				<ChatUsers />
				<img src={this.props.data.picsrc} styles={this.chatMessageImageStyle} />
				<div styles={this.chatObjectStyle}>
					<span styles={this.chatMeta}>{this.props.data.email}</span>
					<time className="time timeago" dateTime={(new Date(this.props.data.timestamp)).toISOString()}></time>
					<span className="time"></span>
					<span styles={this.chatFrom}> via web</span>
					<span styles={this.chatMessageStyle}>{this.props.data.text}</span>
				</div>
			</div>);
	}
});

var ChatObject = React.createClass({
	propTypes: {
		t: React.PropTypes.number
	},
	render: function() {
		var innerComponent;

		// if (this.props.t === 1) {
			innerComponent = (<ChatMessage data={this.props.data} />);
		// }


		return <div>{innerComponent}</div>;
	}
});

var ChatFrame = React.createClass({
    mixins: [Reflux.connect(Store.appdata, "appdata"), Reflux.connect(Store.chat, "chat")],


    getInitialState: function() {
    	return {
    		active: false,
    		appdata: false,
    		chat: {
    			chats: [],
    			users: {}
    		}
    	};
    },

    propTypes: {
    	id: React.PropTypes.string
    },

	chatBoxStyle: ReactStyle({
		color: 'rgba(0, 0, 0, 0.8)',
		fontFamily: 'Georgia,Baskerville,sans-serif',
	  	transform: 'translate3d(0,0,0)',
		// background: 'hsla(50, 0%, 90%, 1)',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		width: 380,
	    zIndex: '100',
		// background: 'rgba(255, 255, 255, 0.9)',
	}),

	chatScrollStyle: ReactStyle({
		position: 'absolute',
	    bottom: 0,
		paddingLeft: 15,
		paddingRight: 15,
	    left: 0,
	    right: 0,
	    top: 75,
	    marginBottom: '3em',
		overflowY: 'hidden',
	}),

	form: ReactStyle({
		position: 'absolute',
		bottom: 10,
		left: 10,
		right: 10
	}),

	input: ReactStyle({
		padding: '1em',
		width: '100%',
		boxSizing: 'border-box',
		border: 'solid 2px #2384D1',
		background: 'transparent',
	}),

	active: ReactStyle({
		overflowY: 'auto',
	}),


	componentWillMount: function() {
		Store.chat.openChannel(this.props.id);
	},

	componentWillUnmount: function() {
		Store.chat.closeChannel();
	},

	componentDidUpdate: function() {
		// $('var = .timeago('refresh' = ReactStyle(;
		var box = this.refs.chatscroll.getDOMNode();
  		box.scrollTop = box.scrollHeight;
	},

	componentDidMount: function() {

	},

	onSubmit: function(e) {
		Store.chat.create({
			t: 1,
			text: this.refs.chatinput.getDOMNode().value,
			timestamp: new Date(),
			email: this.state.appdata.user.email,
			picsrc: this.state.appdata.user.picsrc
		});
		this.refs.chatinput.getDOMNode().value = '';
		e.preventDefault();
		return false;
	},
	chatActivate(e) {
		this.setState({active: !this.state.active});
	},

	render: function() {
		var chats = _.map(this.state.chat.chats, function(v, k) {
			return (<ChatObject key={'chatobject' + k} data={v} />);
		});

		return (
			<div styles={this.chatBoxStyle}>
				<ChatUsers users={this.state.chat.users} />
				<div ref="chatscroll" styles={this.state.active ? [this.chatScrollStyle, this.active] : this.chatScrollStyle} onClick={this.chatActivate} >
					{chats}
				</div>
				<form styles={this.form} onSubmit={this.onSubmit}>
					<input styles={this.input} type="text" ref="chatinput" />
				</form>
			</div>
		);
	}
})
;
module.exports = ChatFrame;
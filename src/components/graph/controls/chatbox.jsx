/**

 * @jsx React.DOM
 */

var React = require('react');
var Reflux = require('reflux');
var ChatUsers = require('./chatusers.jsx');
var NavButton = require('./../../component/nav.jsx').NavButton;

var ChatMessage = React.createClass({

	chatStyle: ReactStyle({
		maxWidth: 500,
		margin: '12px 0',
		position: 'relative'
	}),

	chatObjectStyle: ReactStyle({
		fontSize: 12,
		marginLeft: 44,
	}),

	chatMessageStyle: ReactStyle({
		fontSize: 13,
		display: 'block',
		opacity: '1',
		whiteSpace: 'pre-wrap',
		wordWrap: 'break-word',
		wordBreak: 'break-all',
		lineHeight:'1.4',
		marginTop: 0,
		paddingLeft: 10,
		marginLeft: -7,
	}),

	chatMessageImageStyle: ReactStyle({
		position: 'absolute',
		left: 0,
		top: 0,
		width: 24,
		height: 24,
		borderRadius: 18,
		boxShadow: '0 2px 2px rgba(0, 0, 0, 0.4);',
	}),

	chatTime: ReactStyle({
		opacity: '0.4'
	}),

	chatFrom: ReactStyle({
		opacity: '0.4'
	}),

	chatMeta: ReactStyle({
		opacity: '0.7',
		fontWeight: '700',
		marginTop: 10,
		lineHeight: 14,
		display: 'inline-block',
		marginBottom: 6,
	}),

	messages: ReactStyle({
		marginTop: 1,
		paddingTop: 4,
		marginBottom: 4,
	}),

	online: ReactStyle({
		display: 'inline-block',
		position: 'absolute',
		background: '#44ab44',
		border: '1px solid #3a9f3a',
		top: 14,
		left: 33,
		height: 7,
		width: 7,
		borderRadius: 3,
	}),

	offline: ReactStyle({
		display: 'inline-block',
		position: 'absolute',
		background: '#cccccc',
		border: '1px solid #9a9a9a',
		top: 14,
		left: 33,
		height: 7,
		width: 7,
		borderRadius: 3,
	}),

	other: [],


	render: function() {
		var messages = _.map(this.props.messages, (v, k) => {
			return <span styles={this.chatMessageStyle}>{v}</span>
		});

		var online = this.props.online ? (<span styles={this.online} />) :  (<span styles={this.offline} />);

		return (<div styles={this.chatStyle}>
				<img src={this.props.data.picsrc} styles={this.chatMessageImageStyle} />
				{online}
				<div styles={this.chatObjectStyle}>
					<span styles={this.chatMeta}>{this.props.data.email}</span>
					<time className="time timeago" dateTime={(new Date(this.props.data.timestamp)).toISOString()}></time>
					<span className="time"></span>
				</div>
				<div styles={this.messages}>
					{messages}
				</div>
			</div>);
	}
});

var ChatFrame = React.createClass({
    mixins: [Reflux.connect(api.auth, "appdata"), Reflux.connect(rt.chat, "chat"), Navigation],


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
		color: 'rgba(0, 0, 0, 0.9)',
		background: 'hsl(203, 22%, 98%)',
		borderRight: '1px solid rgba(0, 0, 0, 0.2)',
		fontFamily: 'Georgia,Baskerville,sans-serif',
	  	transform: 'translate3d(0,0,0)',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		width: 265,
	    zIndex: '100',
	}),

	chatScrollStyle: ReactStyle({
		position: 'absolute',
	    bottom: 0,
	    top: 64,
	    width: '100%',
	    marginTop: 'auto',
	    marginBottom: '3em',
		overflowY: 'hidden',
		overflowX: 'hidden',
		background: 'rgba(255, 255, 255, 1.5)',
	}),

	scrollInnerStyles: ReactStyle({
		position: 'absolute',
		bottom: 0,
		paddingLeft: 15,
		paddingRight: 25,
	    left: 0,
	    right: 0,

	}),

	form: ReactStyle({
		position: 'absolute',
		bottom: 13,
		left: 10,
		right: 10
	}),

	login: ReactStyle({
		position: 'absolute',
		bottom: 4,
		left: 10,
		right: 10,
		lineHeight: '2em',
		fontSize: 11,
		margin: 'auto',
		textAlign: 'center',
		borderTop: '1px solid rgba(0, 0, 0, 0.2)',
	}),

	input: ReactStyle({
		padding: '0.5em',
		width: '100%',
		boxSizing: 'border-box',
		border: 'solid 1px hsl(203, 45%, 72%)',
		borderRadius: 3,
		background: 'white',
		overflow: 'hidden',
	}),

	active: ReactStyle({
		overflowY: 'auto',
	}),

	readonly: ReactStyle({
		 // marginBottom: 0,
	}),

	componentWillMount: function() {
		rt.chat.openChannel(this.props.id);
	},

	componentWillUnmount: function() {
		rt.chat.closeChannel();
	},

	componentDidUpdate: function() {
		// $('var = .timeago('refresh' = ReactStyle(;
		var box = this.refs.chatscroll.getDOMNode();
  		box.scrollTop = box.scrollHeight;
	},

	componentDidMount: function() {

	},

	onSubmit: function(e) {
		rt.chat.create({
			user: this.state.appdata.user.id,
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

	renderSquishedChats() {
		var chats = this.state.chat.chats;

		var chatElems = [];

		//squish chats from same user
		if (chats.length > 0) {
			var squishStart = 0;
			var messages = [chats[0].text];

			for (var i = 1; i < chats.length; i++) {
				if (chats[i].user == chats[i - 1].user) {
					messages.push(chats[i].text);
				} else {
					chatElems.push(<ChatMessage
										online={typeof this.state.chat.users[chats[squishStart].user] !== 'undefined'}
										key={'chatobject' + (squishStart)}
										data={chats[squishStart]}
										messages={messages} />);
					squishStart = i;
					messages = [chats[i].text];
				}
			};

			//Final Element
			chatElems.push(<ChatMessage
								online={typeof this.state.chat.users[chats[squishStart].user] !== 'undefined'}
								key={'chatobject' + (squishStart)}
								data={chats[squishStart]}
								messages={messages} />);
		}

		return chatElems;
	},

	goLogin() {
		this.transitionTo('/');
	},

	render: function() {
		var chatElems = this.renderSquishedChats();

		var scrollStyles = [this.chatScrollStyle];
		if (this.state.active) {
			scrollStyles.push(this.active);
		}

		if (this.props.readonly) {
			scrollStyles.push(this.readonly);
		}
				// <ChatUsers users={this.state.chat.users} />

		return (
			<div styles={this.chatBoxStyle}>
				<div ref="chatscroll" styles={scrollStyles} onClick={this.chatActivate}>
					<div styles={this.scrollInnerStyles}>
						{chatElems}
					</div>
				</div>
				<form styles={this.form} style={{display: this.props.readonly ? 'none' :'block'}} onSubmit={this.onSubmit}>
					<input styles={this.input} type="text" ref="chatinput" placeholder="share a message..." />
				</form>

				<div styles={this.login} style={{display: !this.props.readonly ? 'none' :'block'}}>
					<NavButton onClick={this.goLogin} text="collaborate" />
				</div>
			</div>
		);
	},
});

module.exports = ChatFrame;
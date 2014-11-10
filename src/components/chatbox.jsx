/**

 * @jsx React.DOM
 */

var React = require('react');
var Reflux = require('reflux');
var ReactStyle = require('react-style');
var ChatUsers = require('./chatusers.jsx');

var ChatMessage = React.createClass({

	chatStyle: ReactStyle({
		maxWidth: 500,
		margin: '12px 0'
	}),

	chatObjectStyle: ReactStyle({
		marginTop: 3,
		position: 'relative'
	}),

	chatMessageStyle: ReactStyle({
		marginLeft: 35,
		borderRadius: 2,
		display: 'inline-block',
		background: 'white',
		padding: '0.8em'
	}),

	chatMessageImageStyle: ReactStyle({
		position: 'absolute',
		left: 0,
		top: 0,
		width: 35,
		height: 35,
		borderRadius: 18
	}),

	chatTime: ReactStyle({
		opacity: 0.4
	}),

	chatFrom: ReactStyle({
		opacity: 0.4
	}),

	chatMeta: ReactStyle({
		fontWeight: 500
	}),

	render: function() {
		console.log('this.props.data', this.props.data);
		return (<div styles={this.chatStyle}>
				<ChatUsers />
				<span styles={this.chatMeta}>{this.props.data.email}</span>
				<time className="time timeago" dateTime={(new Date(this.props.data.timestamp)).toISOString()}></time>
				<span className="time"></span>
				<span styles={this.chatFrom}> via web</span>
				<div styles={this.chatObjectStyle}>
					<img src={this.props.data.picsrc} styles={this.chatMessageImageStyle} />
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
    mixins: [Reflux.connect(Store.appdata, "appdata"), Reflux.connect(Store.mapchat, "chats")],


    getInitialState: function() {
    	return {
    		appdata: false,
    		chats: []
    	};
    },

    propTypes: {
    	id: React.PropTypes.string
    },

	chatBoxStyle: ReactStyle({
		color: 'rgba(0, 0, 0, 0.8)',
		fontFamily: 'Georgia,Baskerville,sans-serif',
	  	transform: 'translate3d(0,0,0)',
		background: 'hsla(50, 0%, 90%, 1)',
		position: 'absolute',
		top: 44,
		bottom: 0,
		left: 0,
		width: 380,
		backgroundImage: 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42gEFAPr/AAAAAE0AUgBOVWHfgwAAAABJRU5ErkJggg==\')',
	    backgroundRepeat: 'repeat-y',
	    backgroundPosition: 'center right',
	    backgroundSize: '1px 1px',
	    fontSize: 13,
	    zIndex: 15
	}),

	chatScrollStyle: ReactStyle({
		position: 'absolute',
	    bottom: '5em',
		paddingLeft: 15,
		paddingRight: 15,
	    left: 0,
	    right: 0,
	    top: 0,
		overflowY: 'auto'
	}),

	form: ReactStyle({
		position: 'absolute',
		bottom: '1em',
		left: '1em',
		right: '1em'
	}),

	input: ReactStyle({
		padding: '1em',
		width: '100%',
		boxSizing: 'border-box'
	}),

	componentWillMount: function() {
		console.log('ChatFrameWillMount', this.state);
		Store.mapchat.openChannel(this.props.id);

		// this.listenTo(Store.mapchat, this.onChat);
	},

	componentWillUnmount: function() {
		Store.mapchat.closeChannel();
	},

	componentDidUpdate: function() {
		// $('var = .timeago('refresh' = ReactStyle(;
		var box = this.refs.chatscroll.getDOMNode();
  		box.scrollTop = box.scrollHeight;
	},

	componentDidMount: function() {

	},

	onSubmit: function(e) {
		Store.mapchat.create({
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

	render: function() {
		var chats = this.state.chats.map(function(v) {
			return (<ChatObject key={v.id} data={v} />);
		});
		return (
			<div styles={this.chatBoxStyle}>
				<ChatUsers />
				<div ref="chatscroll" styles={this.chatScrollStyle}>
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
/**

 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');
var ReactStyle = require('react-style');


var chatBoxStyle = ReactStyle({
	color: ('rgba(0, 0, 0, 0.8)'),
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
});

var chatScrollStyle = ReactStyle({
	position: 'absolute',
    bottom: '5em',
	paddingLeft: 15,
	paddingRight: 15,
    left: 0,
    right: 0,
    top: 0,
	overflowY: 'auto'
});

var chatStyle = ReactStyle({
	maxWidth: 500,
	margin: '12px 0'
});

var chatObjectStyle = ReactStyle({
	marginTop: 3,
	position: 'relative'
});

var chatMessageStyle = ReactStyle({
	marginLeft: 35,
	borderRadius: 2,
	display: 'inline-block',
	background: 'white',
	padding: '0.8em'
});

var chatMessageImageStyle = ReactStyle({
	position: 'absolute',
	left: 0,
	top: 0,
	width: 35,
	height: 35,
	borderRadius: 18
});

var chatTime = ReactStyle({
	opacity: 0.4
});

var chatFrom = ReactStyle({
	opacity: 0.4
});

var chatMeta = ReactStyle({
	fontWeight: 500
});

var form = ReactStyle({
	position: 'absolute',
	bottom: '1em',
	left: '1em',
	right: '1em'
});

var input = ReactStyle({
	padding: '1em',
	width: '100%',
	boxSizing: 'border-box'
});




var ChatMessage = React.createClass({
    mixins: [Reflux.connect(Store.user, "user")],

    getInitialState: function() {
    	return {
    		user: Store.user.getUser()
    	};
    },

	render: function() {
		console.log('this.props.data', this.props.data);
		return (<div styles={chatStyle}>
				<span styles={chatMeta}>{this.state.user.email}</span>
				<time className="time timeago" dateTime={(new Date(this.props.data.timestamp)).toISOString()}></time>
				<span className="time"></span>
				<span styles={chatFrom}> via web</span>
				<div styles={chatObjectStyle}>
					<img src={this.state.user.picsrc} styles={chatMessageImageStyle} />
					<span styles={chatMessageStyle}>{this.props.data.text}</span>
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
		// $('var = .timeago('refresh' = ReactStyle(;
		var box = this.refs.chatscroll.getDOMNode();
  		box.scrollTop = box.scrollHeight;
	},

	componentDidMount: function() {
		// $('var = .timeago( = ReactStyle(;
	},

	onChat(data) {
		this.setState({
			chats: data.chats
		});
	},

	onSubmit: function(e) {
		Store.mapchat.create({
			t: 1,
			text: this.refs.chatinput.getDOMNode().value,
			timestamp: new Date()
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
			<div styles={chatBoxStyle}>
				<div ref="chatscroll" styles={chatScrollStyle}>
					{chats}
				</div>
				<form styles={form} onSubmit={this.onSubmit}>
					<input styles={input} type="text" ref="chatinput" />
				</form>
			</div>
		);
	}
})
;
module.exports = ChatFrame;
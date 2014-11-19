/**

 * @jsx React.DOM
 */

var React = require('react');
var Reflux = require('reflux');
var ReactStyle = require('react-style');

var ChatUser = React.createClass({

	propTypes: {
		index: React.PropTypes.string,
		user: React.PropTypes.object
	},

	chatStyle: ReactStyle({
		zindex: '2',
		display: 'inline-block',
		margin: '10px'
	}),

	imgStyle: ReactStyle({
		zindex: '3',
		width: 35,
		height: 35,
		borderRadius: 18,
		boxShadow: '0 5px 5px rgba(0, 0, 0, 0.7);'
	}),

	componentWillMount: function() {

	},

	render: function() {
			// {this.props.user.status}
		return (<div styles={this.chatStyle}>
			<img styles={this.imgStyle} src={this.props.user.user.picsrc} />
			</div>);
	}
});


var ChatUsers = React.createClass({

	container: ReactStyle({
		zindex: '1',
		background: 'none',
		position: 'absolute',
		left: '0',
		right: '0',
		top: '0'
	}),


	render: function() {
		var users = _.map(this.props.users, (user, key) => {
			return (<ChatUser index={key} user={user} />);
		});
		return (<div styles={this.container}>
			{users}
			</div>)
	}
});

module.exports = ChatUsers;
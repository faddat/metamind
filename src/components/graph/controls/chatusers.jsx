/**

 * @jsx React.DOM
 */

var React = require('react');
var Reflux = require('reflux');

var ChatUser = React.createClass({

	propTypes: {
		index: React.PropTypes.string,
		user: React.PropTypes.object
	},

	chatStyle: ReactStyle({
		zindex: '2',
		display: 'inline-block',
		margin: '7px 10px'
	}),

	imgStyle: ReactStyle({
		zindex: '3',
		width: 24,
		height: 24,
		borderRadius: 18,
		boxShadow: '0 3px 3px rgba(0, 0, 0, 0.7);'
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
		// background: 'hsl(203, 27%, 25%)',
		position: 'absolute',
		left: '100%',
		width: '100%',
		top: '0'
	}),


	render: function() {

		var users = _.map(this.props.users, (user, key) => {
			return (<ChatUser index={key} user={user} />);
		});
		return (<div styles={this.container}>
				<div styles={this.styles.label}> Online </div>
				{users}
			</div>)
	},

	styles: {
		label: ReactStyle({
			margin: '0 1em',
			display: 'inline-block',
			lineHeight: 24,
		}),
	},
});

module.exports = ChatUsers;
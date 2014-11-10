/**

 * @jsx React.DOM
 */

var React = require('react');
var Reflux = require('reflux');
var ReactStyle = require('react-style');

var ChatUser = React.createClass({

	propTypes: {
		index: React.PropTypes.number
	},

	chatStyle: ReactStyle({
		width: 40,
		height: 40,
	}),

	componentWillMount: function() {

	},

	render: function() {
		console.log('this', this);
		return (<div styles={this.chatStyle}>
			RAWR
			</div>);
	}
});


var ChatUsers = React.createClass({
    mixins: [Reflux.connect(Store.chatusers, "users")],

    getInitialState: function() {
    	return {
    		users: []
    	};
    },

	container: ReactStyle({

		width: '100%',
		height: 40,
		background: 'black'
	}),

	render: function() {
		var users = _.map(this.state.users, (user, key) => {
			return (<ChatUser index={key} user={user} />);
		});
		return (<div styles={this.chatStyle}>
			{users}
			</div>)
	}
});

module.exports = ChatUsers;
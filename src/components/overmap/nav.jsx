/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var ReactStyle = require('react-style');

var Nav = require('../component/nav.jsx');

var NavBar = Nav.NavBar;
var NavButton = Nav.NavButton;

var Logout = React.createClass({
	mixins: [Navigation],

	onClick(e) {
		Store.appdata.logout();
		this.transitionTo('/');
		e.preventDefault();
		e.stopPropagation();
	},

	render() {
		return (
			<NavButton onClick={this.onClick} visible="true" text="Logout">
			</NavButton>
		);

	}

});

var OverMapNav = React.createClass({
	render() {
		return (<NavBar>
				<Logout />
			</NavBar>
		);
	}
});

module.exports = OverMapNav;
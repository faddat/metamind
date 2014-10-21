/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var NavBar = React.createClass({

	onClick: function() {
		this.props.fn.onClick();
	},

	render: function() {
		return (
			<nav className="top-bar">
				<a onClick={this.onClick}><span className="top-bar-nav">New</span></a>
			</nav>
		);
	}
});

module.exports = NavBar;
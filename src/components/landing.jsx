/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Landing = React.createClass({
	onEnter: function() {

		this.props.onEnter()
	},
	render: function() {
		return (
			<div className="landing">
				<h1>Welcome to Bubbles</h1>
				<div>Bubbles is the beginning of new concept of brainstorming, visualizing, and acting on ideas, as a team.</div>
				<input placeholder="Email" />
				<input placeholder="" />
				<button onClick={this.onEnter}>Bubbles</button>
			</div>
		);
	}
});


module.exports = Landing;
/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var DebugBar = React.createClass({
	render: function() {
		var text = this.props.debug.map(function(v, i) {
			return (<a key={'debug-bar' + i}><span className="debug-bar-nav">{v}</span></a>);
		});
		return (
			<nav className="debug-bar">
				{text}
			</nav>
		);
	}
});

module.exports = DebugBar;
/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var InputBox = React.createClass({
	//Block click to global
	onClick: function(e) {
		e.preventDefault();
		return false;
	},

	componentDidUpdate: function() {
		if (this.props.active) {
			this.focus();
		}
	},

	focus: function() {
		this.refs.input.getDOMNode().focus();
	},

	setText: function(value) {
		this.refs.input.getDOMNode().value = value;
	},

	getText: function() {
		return this.refs.input.getDOMNode().value;
	},

	render: function() {
		var styles = {
			display: this.props.active ? 'block' : 'none'
		}
		return (<div className="input-box" style={styles}>
			<input className="mousetrap" onClick={this.onClick} value={this.props.text} ref="input" type="text" id="input-box"/>
		</div>);
	}
});


module.exports = InputBox;
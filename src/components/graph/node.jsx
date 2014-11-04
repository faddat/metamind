/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Node = React.createClass({

	clickHandler: function(ev) {
		if (this.props.selected === true && this.props.inputMode !== 'edit') {
			Action.editNode(this.props.node.id);
		} else {
			Action.selectNode(this.props.node.id);
		}
		return false;
	},

	render: function() {
		var x = this.props.node.x + (window.innerWidth / 2) - 175;
		var y =	this.props.node.y + (window.innerHeight / 2) - 44;

		var style = {
			"-webkit-transform": 'translate3d('+x+'px, '+y+'px, 0) translate3d(-50%, -50%, 0)',
			"-moz-transform": 'translate3d('+x+'px, '+y+'px, 0) translate3d(-50%, -50%, 0)',
			"transform": 'translate3d('+x+'px, '+y+'px, 0) translate3d(-50%, -50%, 0)',
			"padding": 2 + Math.pow(this.props.node.weight, 0.5),
			'font-size': 16 + Math.pow(this.props.node.weight, 0.7)
		};

		var classes = ['node'];
		if (this.props.selected)
		{
			if (this.props.fn.isSelectMode())
			{
				classes.push('selected');
			}
			else if (this.props.fn.isEditMode())
			{
				classes.push('edit');
			}
		}

		classes = classes.join(' ');

		return (
			<div onClick={this.clickHandler} className={classes} style={style}>
					{this.props.node.text}
			</div>
		);
	}

});

module.exports = Node;
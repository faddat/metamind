/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Editor = require('../../index.jsx');

var Node = React.createClass({

	clickHandler: function(e) {
		Action.graph.selectNode(this.props.node.id);
		e.preventDefault();
		e.stopPropagation();
	},

	render: function() {
		var x = this.props.node.x + (window.innerWidth / 2) - 175;
		var y =	this.props.node.y + (window.innerHeight / 2) - 44;

		var transform = ReactStyle({
			transform: 'translate3d('+x+'px, '+y+'px, 0) translate3d(-50%, -50%, 0)',
			padding: 2 + Math.pow(this.props.node.weight/2, 0.5),
			fontSize: 14 + Math.pow(this.props.node.weight/2, 0.5),
		});



		var styles = [];
		if (this.props.node.style == 'soft') {
			styles.push[this.styles.soft];
		} else {
			styles.push[this.styles.hard];
		}

		if (this.props.selected) {
			styles.push[this.styles.selected];
		}

		console.log('this.props.node.style', this.props.node.style);

		return (

			<div onClick={this.clickHandler} styles={[
					this.styles.node,
					this.props.node.style == 'soft' ? this.styles.soft : this.styles.hard,
					this.props.selected ? this.styles.selected : null,
					transform,
				]}>
					{this.props.node.text}
			</div>
		);
	},

	styles: {
		node: ReactStyle({
			boxSizing: 'border-box',
			userSelect: 'none',
			position: 'absolute',
			padding: 5,
			fontSize: '14pt',
			textAlign: 'center',
			borderRadius: 10,
			minWidth: '1em',
			minHeight: '1em',
			left: 0,
			top: 0,
			margin: 'auto',
			fontFamily: 'Georgia,Baskerville,sans-serif',
			lineHeight: 20,
			background: 'white',
			color: '#222',
		}),

		soft: ReactStyle({
		}),

		hard: ReactStyle({
			boxShadow: '0 3px 3px rgba(100, 100, 100, 0.7)',
		}),

		selected: ReactStyle({
			border: '1px solid #2384D1',
		}),
	}
});

module.exports = Node;
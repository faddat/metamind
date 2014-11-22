/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var Edge = React.createClass({
	render: function() {
		var x1 = this.props.x1 + (window.innerWidth / 2) - 175;
		var y1 = this.props.y1 + (window.innerHeight / 2) - 44;
		var x2 = this.props.x2 + (window.innerWidth / 2) - 175;
		var y2 = this.props.y2 + (window.innerHeight / 2) - 44;

		return (<line styles={[this.styles.edge, this.props.soft ? this.styles.soft : this.styles.hard]}
		    		x1={x1} y1={y1} x2={x2} y2={y2} />);
	},

	styles: {
		edge: ReactStyle({
			transition: 'all 1s ease-in-out',
		}),

		hard: ReactStyle({
			stroke: '#76769C',
			strokeWidth: '2',
			strokeOpacity: '1',
		}),

		soft: ReactStyle({
			stroke: '#76769C',
			strokeWidth: '2',
			strokeOpacity: '0.4',
		}),
	}
});


module.exports = Edge;
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
		var classes = ['edge'];
		if (this.props.soft) {
			classes.push('soft');
		} else {
			classes.push('hard');
		}

		classes = classes.join(' ');

		return (
				<line className={classes}
		    			x1={x1}
		    			y1={y1}
		    			x2={x2}
		    			y2={y2} />
		);
	}
});


module.exports = Edge;
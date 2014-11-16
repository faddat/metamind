
/**
 * @jsx React.DOM
 */

var React = require('react');
var TreeSpread = require('./treespread.jsx');
var Node = require('./node.jsx');
var Edge = require('./edge.jsx');

var Tree = React.createClass({
	getInitialState: function() {
		return {
			nodes: [],
			edges: [],
			framewidth: 0,
			frameheight: 0,
		};
	},

	componentDidMount: function() {
		$('.nodeframe').panzoom({
			$set: $('.edgepanframe>g, .nodepanframe')
		});
		var $frame = $(this.refs.nodeframe.getDOMNode());

		this.setState({
			framewidth: $frame.width(),
			frameheight: $frame.height()
		});

		window.addEventListener('resize', this.resize, false);
	},

	componentWillReceiveProps: function(nextProps) {
		if (_.isObject(nextProps.graph)) {
			var processed = TreeSpread.run(nextProps.graph);
			this.setState({
				nodes: processed.nodes,
				edges: processed.edges
			});
		}
	},



	handleClick: function(e) {
		e.preventDefault();
		e.stopPropagation();
		Action.graph.deselectNode();
	},

	resize: function(ev) {
		var $frame = $(this.refs.nodeframe.getDOMNode())
		this.setState({
			framewidth: $frame.width(),
			frameheight: $frame.height()
		});
	},

	render: function() {

    	var nodes = this.state.nodes.map(function(v) {
    		return <Node
	    		key={'node' + v.index}
	    		node={v}
				fn={this.fn}
	    		inputMode={this.state.inputMode}
	    		selected={this.state.selected == v.id} />;
    	}.bind(this));

    	var edgeElems = [];

    	var edges = this.state.edges;

    	for (var i = edges.length - 1; i >= 0; i--) {
    		for (var j = edges[i].length - 1; j >= 0; j--) {
	   			edgeElems.push(
	   				<Edge
	   					key={i + 'treeedge' + j}
	   					text={edges[i][j].totalweight}
	   					soft={edges[i][j].totalweight == 1}
	   					x1={this.state.nodes[i].x}
	   					y1={this.state.nodes[i].y}
	   					x2={this.state.nodes[edges[i][j].next].x}
	   					y2={this.state.nodes[edges[i][j].next].y} />
	   				);
    		};
    	};

		return (
			<div className="nodeframe" ref="nodeframe" onClick={this.handleClick}>
        		<div className="nodepanframe">
	        		{nodes}
		     	</div>
	        	<svg className="edgepanframe" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
	     			version="1.2" baseProfile="tiny" width="100%" height="100%" x="0px" y="0px" viewBox={"0 0 " + this.state.framewidth + " " + this.state.frameheight}>
	     			<g width="100%" height="100%">
	     			{edgeElems}
	     			</g>
	     		</svg>
        	</div>
		);
	}

});

module.exports = Tree;
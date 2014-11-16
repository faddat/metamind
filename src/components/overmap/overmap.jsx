/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');

var NewMap = require('../component/new-map.jsx');

var MiniMap = React.createClass({
	getInitialState: function() {
		return {
			nodes: [],
			edges: []
		};
	},
	componentWillMount: function() {
		// var state = JSON.parse(localStorage.getItem(this.props.id));
		if (typeof state === 'undefined' || !state || typeof state.nodes === 'undefined' || state.nodes.length == 0)
			return;
		this.setState(state);
	},

	renderMap: function() {

	},

	render: function() {

		var edgeElems = [];
		var nodeElems = [];
    	var minScale = 1;
    	var edges = this.state.edges;

		if (edges.length) {
	    	var radius = 5;
			nodeElems = this.state.nodes.map(function(v, k) {
				if (Math.abs(v.x) > minScale)
					minScale = Math.abs(v.x);
				if (Math.abs(v.y) > minScale)
					minScale = Math.abs(v.y);
				return <circle key={'thumbnail-circle' + k} cx={v.x} cy={v.y} r={radius} fill={'hsla('+202+', 9%, 100%, 1)'}
							className='node-circle'></circle>
			});

	    	for (var i = edges.length - 1; i >= 0; i--) {
	    		for (var j = edges[i].length - 1; j >= 0; j--) {
		   			edgeElems.push(
						<line
							className='edge'
							stroke='#FFFFFF'
							strokeWidth='3'
							key={i + 'thumbnailedge' + j}
							x1={this.state.nodes[i].x}
							y1={this.state.nodes[i].y}
							x2={this.state.nodes[edges[i][j].next].x}
							y2={this.state.nodes[edges[i][j].next].y} />
						);
				}
			}
			minScale += radius * 2;
			minScale *= 2;
			minScale = Math.max(0.3, Math.min(this.props.framewidth, this.props.frameheight) / minScale);
		}
		// minScale += 20;

		return (
        	<svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' version='1.2' baseProfile='tiny'
        			style={{margin: 0, padding: 0, border: 0}}
	     			width={this.props.framewidth}
	     			height={this.props.frameheight}>
     			<g transform={'translate('+this.props.framewidth/2+','+this.props.frameheight/2+') scale('+minScale+', '+minScale+')'}>
     				{edgeElems}
     				{nodeElems}
     			</g>
     		</svg>
		);
	}

});



var OverMapNode = React.createClass({

	getInitialState: function() {
		return {
			width: 50,
			height: 50
		};
	},
	componentDidMount: function() {
		this.updateDimensions();
		window.addEventListener('resize', this.updateDimensions, false);
	},
	componentWillUnmount: function() {
		window.removeEventListener('resize', this.updateDimensions, false);
	},

	updateDimensions: function(e) {
		this.setState({
			width: this.getDOMNode().clientWidth,
			height: this.getDOMNode().clientHeight,
		});
	},

	getDefaultProps: function() {
		return {
			map: {
				title: 'Untitled Mind Map'
			}
		};
	},

	onClick: function() {
		this.props.onClick(this);
	},

	render: function() {
		return (
			<div className='flex-item' onClick={this.onClick}>
				<span>{this.props.map.title}</span>
				<MiniMap id={this.props.map.id} framewidth={this.state.width} frameheight={this.state.height} />
			</div>
		);
	}
});

var OverMap = React.createClass({
    mixins: [Reflux.connect(Store.maps, 'graphs')],
	gridster: null,

	getInitialState: function() {
		return {
			graphs: []
		};
	},

	componentDidMount: function() {
		Action.refreshMaps();
	},

	mapCreated: function(graph) {
		this.refs.newmap.toggle();
		console.log('graph', graph);
		Action.openMap(graph);
	},

	rmChild: function(child) {

	},

	openChild: function(child) {
		Action.openMap(child.props.map);
	},

	render: function() {
		var self = this;
		var graphs = _.map(this.state.graphs, function(graph) {
			return <OverMapNode
						key={'overmap' + graph.id}
						map={graph}
						onClick={self.openChild} />
		});

		return (
			<div className='overmap'>
				<header>
					<div className='left'>
						<span className='company'>21cdawn</span>
						<h1>Bubbles Alpha</h1>
					</div>
					<div className='right'>
						<NewMap ref='newmap' onCreate={this.mapCreated} />
					</div>
					<span className='clear-me'></span>
				</header>
				<div className='flex-container'>
					{graphs}
					<span className='clear-me'></span>
				</div>
			</div>
		);
	}
});

module.exports = OverMap;
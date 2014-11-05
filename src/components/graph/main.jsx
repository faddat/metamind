/**
 * @jsx React.DOM
 */

'use strict';

var Reflux = require('reflux');

/**

Current Status:

Just removed SVG text rendering because it's a bitch.
Using regular dom instead.
Get the bubbles to size nicely using translations
Added a pretty quip rippoff nav bar
Create basic debugging
Separate Components
Replace some code with functions
Get text to show
Draw edges in SVG :)
Scrolling *eek*


To Do:
Disable text box if nothing is selected:
Make it really beautiful
Mindmap Title
A
dd transitions to nodes to make them smoothly move around

MPD
Saving documents
Multiple Documents
Collaboration

**/

var NavBar = require('../nav.jsx');
var DebugBar = require('../debugbar.jsx');
var InputBox = require('../inputbox.jsx');
var Node = require('./node.jsx');
var Edge = require('./edge.jsx');
var ChatFrame = require('../chatbox.jsx');
var Loader = require('../loader.jsx');
var KeyMap = require('../../assets/js/keymap');

var TreeSpread = require('./layouts/treespread.jsx');

var LocalStorageLoader = {
	load: function(id) {
		var state;
		// state = JSON.parse(localStorage.getItem(id));

		if (typeof state === 'undefined' || !state || typeof state.nodes === 'undefined' || state.nodes.length == 0)
			return false;

		return state;
	}
};

var MapFrame = React.createClass({
    mixins: [Reflux.ListenerMixin],
	displayName: 'MapFrame',
	v: 0,

	getInitialState: function() {
		return {
			data: {},
			selected: false,
			inputMode: 'select',
			debug: [],
			framewidth: 0,
			frameheight: 0,
			loader: null,
			layout: {
				nodes: [],
				edges: []
			}
		}
	},


	componentWillMount: function() {
		this.fn = this.genFn();


		//Map Has New Data Changes
		this.listenTo(Store.mapdata, this.onDocChanged);

		//Before
		this.listenTo(Action.selectNode, this.onSelectNode);
	},

	componentDidMount: function() {
		KeyMap.bind(this.fn);

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

	componentWillUnmount: function() {

	},

	onDocChanged: function(data) {
		this.setState({
			layout: TreeSpread.run(data)
		});
	},

	onSelectNode(id) {
		if (typeof id === 'undefined') {
			id = this.state.selected;
		}

		this.refs.inputBox.focus();
		this.refs.inputBox.setText(Store.mapdata.getNode(id).text);
		this.setState({selected: id, inputMode: 'select'});
	},

	createNode: function() {
		var id = Store.mapdata.nextId();
		Store.mapdata.newNode(id, {text: ''}, {a: this.state.selected, b: id});
		return id;
	},

	/* Create a new node linked to the Selected node */
	branchNode: function(ev) {
		if (this.isFreeMode()) {
			return false;
		}

		var id = this.createNode();
		Action.selectNode(id);
		ev.preventDefault();
	},

	/* Change the selected node's text */
	setNodeText: function(id, text) {
		Store.mapdata.updateNode(id, {text: text});
	},
	fn: {},

	genFn: function() {
		return {
			isSelectMode: this.isSelectMode,
			branchNode: this.branchNode,
			setDebugText: this.setDebugText,
			handleTextSubmit: this.handleTextSubmit
		};
	},

	isSelectMode: function() {
		return this.state.selected && this.state.inputMode == 'select';
	},

	freeMode: function() {
		this.setState({selected: false});
	},

	isFreeMode: function() {
		return !this.state.selected;
	},

	handleTextSubmit: function() {
		this.setNodeText(this.state.selected, this.refs.inputBox.getText());
		Action.selectNode();
	},

	handleClick: function(e) {
		if (!this.isFreeMode()) {
			this.freeMode();
			return;
		}
	},

	resize: function(ev) {
		var $frame = $(this.refs.nodeframe.getDOMNode())
		this.setState({
			framewidth: $frame.width(),
			frameheight: $frame.height()
		});
	},

	setDebugText: function(i, text) {
		var debug = this.state.debug;
		debug[i] = text;
		this.setState({'debug': debug});
	},

	loaderOn: function() {
		this.setState({
			'loader': 'on'
		});

	},

	loaderOff: function() {
		this.setState({
			'loader': null
		});

	},

	loaderFail: function() {
		this.setState({
			'loader': 'fail'
		});
	},

    render: function () {
    	var style = {
    		zIndex: 1,
			width: '100%',
			height: '100%'
    	};

    	var layout = this.state.layout;

    	var nodes = layout.nodes.map(function(v) {
    		return <Node
	    		key={v.index}
	    		node={v}
				fn={this.fn}
	    		inputMode={this.state.inputMode}
	    		selected={this.state.selected == v.id} />;
    	}.bind(this));

    	var edgeElems = [];

    	var edges = layout.edges;
    	for (var i = edges.length - 1; i >= 0; i--) {
    		for (var j = edges[i].length - 1; j >= 0; j--) {
	   			edgeElems.push(
	   				<Edge
	   					key={i + "-" + j}
	   					text={edges[i][j].totalweight}
	   					soft={edges[i][j].totalweight == 1}
	   					x1={layout.nodes[i].x}
	   					y1={layout.nodes[i].y}
	   					x2={layout.nodes[edges[i][j].next].x}
	   					y2={layout.nodes[edges[i][j].next].y} />
	   				);
    		};
    	};
        return <div ref="app" style={style}>
        	<NavBar fn={{onClick: this.newMap}} />
        	<ChatFrame id={this.props.id} />
        	<InputBox ref="inputBox" active={this.isSelectMode()} submit={this.handleTextSubmit}/>
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
     		<DebugBar debug={this.state.debug} />
     		<Loader mode={this.state.loader} onClose={this.loaderOff}/>
        </div>;
    }
});

module.exports = MapFrame;
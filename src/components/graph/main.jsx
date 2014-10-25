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
var Net = require('../../assets/js/collab-engine');

var LocalStorageLoader = {
	load: function(id) {
		var state;
		state = JSON.parse(localStorage.getItem(id));
		console.log('Loading Locally: ' + id);

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
			nodes: [],
			edges: [],
			selected: -1,
			inputMode: 'select',
			debug: [],
			framewidth: 0,
			frameheight: 0,
			loader: null
		}
	},

	componentWillMount: function() {
		this.fn = this.genFn();


		// if (this.props.id) {
		// 	var loadedState = LocalStorageLoader.load(this.props.id);
		// 	if (!loadedState) {
		// 		this.createNode(0, 0, 'Mind Map');
		// 	} else {
		// 		this.setState(loadedState);
		// 	}
		// }

		this.listenTo(Action.docReady, this.onDocReady);
		this.listenTo(Action.docChanged, this.onDocChanged);
	},

	onDocReady: function() {
		this.createNode(0, 0, 'Mind Map');
	},

	onDocChanged: function(data) {
		this.setState({
			data: data
		});
	},

	createNode: function(text) {
		Store.mapdata.newNode({
			text: text
		});
	},

	createEdge: function(a, b) {
		Store.mapdata.newEdge({
			a: a,
			b: b
		});
	},

	onCreateNode: function(node) {
		var nodes = this.state.nodes;
		var edges = this.state.edges;
		var len = nodes.length;
		nodes.push({
			index: len,
			parent_w: 0,
			parent_t: 0,
			weight: 0,
			text: text ? text : nodes.length
		});


		edges.push([]);


		this.setState({
			nodes: nodes,
			edges: edges
		});
	},

	swapedges: function(origin, a, b, nodes, edges) {
		var temp = edges[origin][a];
		edges[origin][a] = edges[origin][b];
		edges[origin][b] = temp;
		nodes[edges[origin][a].next].prevIndex = b;
		nodes[edges[origin][b].next].prevIndex = a;
	},


	/* Link the current node to another node */
	onCreateEdge: function() {
		var nodes = this.state.nodes;
		var edges = this.state.edges;

		var l = edges[originIndex].push({
			next: childIndex,
			totalweight: 0
		});

		nodes[childIndex].prev = originIndex;
		nodes[childIndex].prevIndex = l - 1;


		while (childIndex != 0) {

			var prev = nodes[childIndex].prev;
			var prevIndex = nodes[childIndex].prevIndex;

			nodes[prev].weight ++;
			edges[prev][prevIndex].totalweight++;


			// //Bubble sort
			// for (var i = edges[prev].length - 1; i > prevIndex; i--) {
			// 	if (edges[prev][i].totalweight < edges[prev][prevIndex].totalweight) {
			// 		this.swapedges(prev, i, prevIndex, nodes, edges);
			// 		break;
			// 	}
			// };


			edges[prev] = this.scatterEdges(edges[prev], nodes[prev].parent_w - edges[prev][prevIndex].totalweight);

			//Backlink
			for (var j = edges[prev].length - 1; j >= 0; j--) {
				nodes[edges[prev][j].next].prevIndex = j;
			};

			childIndex = prev;
		}

		this.setState({
			edges: edges,
			nodes: nodes
		});
	},

	scatterEdges: function(edges, inweight) {
		edges.sort(function(a, b) {
			return b.totalweight - a.totalweight;
		});
		function divideSort(linksArray) {
			var len = linksArray.length;

			if (len < 2) {
				return linksArray;
			}

			var atotal = 0;
			var btotal = 0;
			var a = [];
			var b = [];

			for (var i = 0; i < len; i++) {
				if (atotal < btotal) {
					atotal += linksArray[i].totalweight;
					a.push(linksArray[i]);
				} else {
					btotal += linksArray[i].totalweight;
					b.push(linksArray[i]);
				}
			};

			a = divideSort(a);
			b = divideSort(b);

			return a.concat(b);

			// for (var i = 0; i < b; i++) {
			// 	if (linksArray[i].totalweight > average) {
			// 		balance += linksArray[i].totalweight;
			// 		partA.push(linksArray[i]);
			// 	} else if (linksArray[i].totalweight < average) {
			// 		balance -= linksArray[i].totalweight;
			// 		partB.push(linksArray[i]);
			// 	} else if (i % 2 == 1) {
			// 		balance += linksArray[i].totalweight;
			// 		partA.push(linksArray[i]);
			// 	} else {
			// 		balance -= linksArray[i].totalweight;
			// 		partB.push(linksArray[i]);
			// 	}
			// };

			// if (balance < 0)
			// 	return divideSort(partA, -balance).concat(divideSort(partB, balance));
		}


		var res = [];

		res = divideSort(edges, inweight);

		return res;
	},

	recalcNodes: function()
	{
		var edges = this.state.edges;
		var r, t, tw, r2, w, smallCount, push, bigEdges, smallEdges;
		var nodes = this.state.nodes;
		var distance = 20;

		// edges[i].sort(function(a, b) {
		// 	return a.weight > b.weight;
		// });


		for (var i = 0; i < edges.length; i++) {
			bigEdges = edges[i].filter(function(v) { return v.totalweight > 1;});
			smallEdges = edges[i].filter(function(v) { return v.totalweight == 1;});
			var smlen = smallEdges.length;


			tw = nodes[i].weight - smlen;
			push = 0;
			if (i != 0) {
				push = nodes[i].parent_w - nodes[i].weight;
				tw += push;
			}

			//nodes[i].text = tw;

			t = nodes[i].parent_t - 0.5 + (push / 2) / tw;

			for (var j = 0; j < bigEdges.length; j++) {
				r = (bigEdges[j].totalweight / tw) / 2;
				t += r;
				var dist = distance*3 + distance * Math.pow(bigEdges[j].totalweight + 10, 0.55);
				nodes[bigEdges[j].next].x = Math.cos(t * 2 * Math.PI) * (dist) + nodes[i].x;
				nodes[bigEdges[j].next].y = Math.sin(t * 2 * Math.PI) * (dist) + nodes[i].y;
				nodes[bigEdges[j].next].parent_t = t;
				nodes[bigEdges[j].next].parent_w = nodes[i].weight - smlen;
				t += r;

			};

			t = nodes[i].parent_t + 0.5;
			for (var j = smlen - 1; j >= 0; j--) {
				//nodes[smallEdges[j].next].text = "--";
				w = smallEdges[j].totalweight;
				r = 1 / smlen;
				var dist = distance*3;
				nodes[smallEdges[j].next].x = Math.cos((t + r/2) * 2 * Math.PI) * (dist) + nodes[i].x;
				nodes[smallEdges[j].next].y = Math.sin((t + r/2) * 2 * Math.PI) * (dist) + nodes[i].y;
				t += r;
				// nodes[smallEdges[j].next].parent_w = w;
				// nodes[smallEdges[j].next].parent_t = t - r/2;
			};
		};
		this.setState({
			nodes: nodes
		})
	},


	componentDidUpdate: function(prevProps, prevState) {
		// localStorage.setItem(this.props.id, JSON.stringify(this.state));
	},

	componentDidMount: function() {
		KeyMap.bind(this.fn);

		this.selectMode(0);

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

	fn: {},

	genFn: function() {
		return {
			editMode: this.editMode,
			selectMode: this.selectMode,
			isSelectMode: this.isSelectMode,
			isEditMode: this.isEditMode,
			branchNode: this.branchNode,
			setDebugText: this.setDebugText,
			handleTextSubmit: this.handleTextSubmit
		};
	},

	/* Select a node */
	selectMode: function(index) {
		if (typeof index === 'undefined')
			index = this.state.selected;
		this.setDebugText(0, 'Select Mode');
		this.setDebugText(2, 'Selected: ' + index);
		this.refs.inputBox.setText(this.state.nodes[index].text);
		this.setState({selected: index, inputMode: 'select'});
	},

	isSelectMode: function() {
		return this.state.selected > -1 && this.state.inputMode == 'select';
	},

	/* EditSelect a node */
	editMode: function(index) {
		if (typeof index === 'undefined')
			index = this.state.selected;
		this.setDebugText(0, 'Edit Mode');
		this.setDebugText(2, 'Selected' + index);
		this.refs.inputBox.focus();

		this.refs.inputBox.setText(this.state.nodes[index].text);
		this.setState({selected: index, inputMode: 'edit'});
	},

	isEditMode: function() {
		return this.state.selected > -1 && this.state.inputMode == 'edit';
	},

	freeMode: function() {
		this.setState({selected: -1});
	},

	isFreeMode: function() {
		return this.state.selected === -1;
	},

	/* Create a new node linked to the Selected node */
	branchNode: function(ev) {
		if (this.isFreeMode()) {
			return false;
		}

		this.createNode(0, 0, '');
		this.createEdge(this.state.selected, this.state.nodes.length - 1);
		this.editMode(this.state.nodes.length - 1)
		this.recalcNodes();
		ev.preventDefault();
	},

	/* Change the selected node's text */
	setNodeText: function(index, text) {
		var nodes = this.state.nodes;
		nodes[index].text = text;
		this.setState({
			nodes: nodes
		});
	},

	handleTextSubmit: function() {

		if (this.isEditMode()) {
			this.setNodeText(this.state.selected, this.refs.inputBox.getText());
			this.selectMode();
		} else {
			this.editMode();
		}
	},

	handleClick: function(e) {

		if (!this.isFreeMode()) {
			this.freeMode();
			return;
		}
		//this.createNode(e.clientX - $('#app').offset().left , e.clientY - $('#app').offset().top, '');
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

    	var nodes = this.state.nodes.map(function(v) {
    		return <Node
	    		key={v.index}
	    		node={v}
				fn={this.fn}
	    		inputMode={this.state.inputMode}
	    		selected={this.state.selected == v.index} />;
    	}.bind(this));

    	var edgeElems = [];

    	var edges = this.state.edges;
    	for (var i = edges.length - 1; i >= 0; i--) {
    		for (var j = edges[i].length - 1; j >= 0; j--) {
	   			edgeElems.push(
	   				<Edge
	   					key={i + "-" + j}
	   					text={edges[i][j].totalweight}
	   					soft={edges[i][j].totalweight == 1}
	   					x1={this.state.nodes[i].x}
	   					y1={this.state.nodes[i].y}
	   					x2={this.state.nodes[edges[i][j].next].x}
	   					y2={this.state.nodes[edges[i][j].next].y} />
	   				);
    		};
    	};
        return <div ref="app" style={style}>
        	<NavBar fn={{onClick: this.newMap}} />
        	<ChatFrame />
        	<InputBox ref="inputBox" active={this.isEditMode()} submit={this.handleTextSubmit}/>
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
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
Disable text box if nothing is selected:
Make it really beautiful
Saving documents
Multiple Documents
Collaboration


To Do:
Add transitions to nodes to make them smoothly move around


**/

var Layout = require('./layouts/tree');

var Nav = require('./controls/nav.jsx');
var DebugBar = require('./controls/debugbar.jsx');
var InputBox = require('./controls/inputbox.jsx');
var ChatFrame = require('./controls/chatbox.jsx');

var Loader = require('./controls/loader.jsx');
var KeyMap = require('../../assets/js/keymap');


var LocalStorageLoader = {
	load: function(id) {
		var state;
		// state = JSON.parse(localStorage.getItem(id));

		if (typeof state === 'undefined' || !state || typeof state.nodes === 'undefined' || state.nodes.length == 0)
			return false;

		return state;
	}
};

var GraphEditor = React.createClass({
    mixins: [Reflux.connect(Store.mapdata, 'data')],
	v: 0,

	getInitialState: function() {
		return {
			data: {},
			selected: false,
			inputMode: 'select',
			debug: [],
			loader: null,
		}
	},


	componentWillMount: function() {
		this.fn = this.genFn();

		//Before
		Action.graph.selectNode.listen(this.onSelectNode);

		Store.mapdata.openMap(this.props.graph.id);
	},

	componentDidMount: function() {
		KeyMap.bind(this.fn);
	},

	componentWillUnmount: function() {
		Store.mapdata.closeMap();
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
		Action.graph.selectNode(id);
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
		Action.graph.selectNode();
	},

	handleClick: function(e) {
		if (!this.isFreeMode()) {
			this.freeMode();
			return;
		}
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

        return <div ref="app" style={style}>
        	<Nav shareURL={this.props.graph.shareURL}>Share</Nav>
        	<ChatFrame id={this.props.graph.id} />
        	<InputBox ref="inputBox" active={this.isSelectMode()} submit={this.handleTextSubmit}/>

        	<Layout graph={this.state.data} />

     		<DebugBar debug={this.state.debug} />
     		<Loader mode={this.state.loader} onClose={this.loaderOff}/>
        </div>;
    }
});

module.exports = GraphEditor;
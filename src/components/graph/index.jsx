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
var InputBox = require('./controls/inputbox.jsx');
var ChatFrame = require('./controls/chatbox.jsx');

var Loader = require('./controls/loader.jsx');

var GraphEditor = React.createClass({
    mixins: [Reflux.connect(Store.mapdata, 'data'), ReactRouter.CurrentPath],
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
		if (!Store.appdata.isLoggedin()) {
			Action.authFail();
			return false;
		}

		this.fn = this.genFn();

		//Before
		this.listenage = [];
		this.listenage.push(Action.graph.selectNode.listen(this.onSelectNode));
		this.listenage.push(Action.graph.deselectNode.listen(this.onDeselectNode));


		console.log('this.props.params.id', this.props.params.id);
		Store.mapdata.openMap(this.props.params.id);
	},

	componentDidMount: function() {

		Mousetrap.bind(['tab'], (e) => {
			e.preventDefault();

			this.branchNode(e);
		});

		Mousetrap.bind(['enter'], (e) => {
			e.preventDefault();

			if (this.isSelectMode()) {
				this.handleTextSubmit();
			}

		});

		Mousetrap.bind(['alt+shift+n', 'alt+shift+n'], function(e) {

		});

	},

	componentWillUnmount: function() {
		console.log('componentWillUnmount');
		Store.mapdata.closeMap();
		_.map(this.listenage, (v, k) => { return v(); })
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

	onDeselectNode: function() {
		this.setState({selected: false});
	},

	isFreeMode: function() {
		return !this.state.selected;
	},

	handleTextSubmit: function() {
		this.setNodeText(this.state.selected, this.refs.inputBox.getText());
		Action.graph.selectNode();
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
        return <div ref="app" styles={this.styles.editor}>
        	<Nav shareURL={hostPath(this.getCurrentPath())}>Share</Nav>
        	<ChatFrame id={this.props.params.id} />
        	<InputBox ref="inputBox" active={this.isSelectMode()} submit={this.handleTextSubmit}/>

        	<Layout graph={this.state.data} selected={this.state.selected} />

     		<Loader mode={this.state.loader} onClose={this.loaderOff}/>
        </div>;
    },

    styles: {
    	editor: ReactStyle({
    		zIndex: 1,
			width: '100%',
			height: '100%'
    	}),
    }
});

module.exports = GraphEditor;
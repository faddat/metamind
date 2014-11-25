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

var GraphEditor = React.createClass({
    mixins: [Reflux.connect(Store.mapdata, 'data'), ReactRouter.CurrentPath],
	v: 0,

	getInitialState() {
		return {
			data: {},
			selected: false,
		}
	},

	componentWillMount() {

		//Before
		this.listenage = [];
		this.listenage.push(Action.graph.selectNode.listen(this.onSelectNode));
		this.listenage.push(Action.graph.deselectNode.listen(this.onDeselectNode));
		this.listenage.push(Action.graph.editNode.listen(this.onEditNode));


		console.log('this.props.params.id', this.props.params.id);
		Store.mapdata.openMap(this.props.params.id);
	},

	componentDidMount() {

		Mousetrap.bind(['tab'], (e) => {
			e.preventDefault();

			if (!this.isSelectMode()) {
				return false;
			}

			var id = this.createNode();
			Action.graph.selectNode(id);
		});


		Mousetrap.bind(['alt+shift+n', 'alt+shift+n'], function(e) {

		});

	},

	componentWillUnmount() {
		console.log('componentWillUnmount');
		Store.mapdata.closeMap();
		_.map(this.listenage, (v, k) => { return v(); })
	},


	createNode() {
		var id = Store.mapdata.nextId();
		Store.mapdata.newNode(id, {text: ''}, {a: this.state.selected, b: id});
		return id;
	},

	isSelectMode() {
		return this.state.selected;
	},

	onSelectNode(id) {
		if (typeof id === 'undefined') {
			id = this.state.selected;
		}

		this.setState({selected: id});
	},

	onDeselectNode() {
		this.setState({selected: false});
	},

	onEditNode(text) {
		Store.mapdata.updateNode(this.state.selected, {text: text});
		Action.graph.selectNode();

		//Store.mapdata.deleteNode(this.state.selected);
	},

    render () {
    	if (Store.appdata.isLoggedin()) {
    		var controls = <EditInterface id={this.props.params.id} />
		} else {
    		var controls = <ViewInterface id={this.props.params.id} />
		}

        return <div ref="app" styles={this.styles.editor}>
        	<Layout graph={this.state.data} selected={this.state.selected} />
        	{controls}
        </div>;
    },

    styles: {
    	editor: ReactStyle({
			width: '100%',
			height: '100%'
    	}),
    }
});

var ViewInterface = React.createClass({
	render() {
		return (
			<div>
	        	<ChatFrame id={this.props.id} readonly />
			</div>
		);
	},
});

var EditInterface = React.createClass({
	mixins: [ReactRouter.CurrentPath],

	render: function() {
		return (
			<div>
	        	<Nav shareURL={hostPath(this.getCurrentPath())}>Share</Nav>
	        	<ChatFrame id={this.props.id} />
	        	<InputBox />
        	</div>
		);
	}

});

module.exports = GraphEditor;
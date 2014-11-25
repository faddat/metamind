/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');

var InputBox = React.createClass({
	mixins: [Reflux.ListenerMixin],

	styles: {

		inputbox: ReactStyle({
			transform: 'translate3d(0,0,0)',
			position: 'absolute',
			top: 0,
			left: 390,
			right: 390,
			height: 44,
			margin: 'auto',
			zIndex: '15',
			borderBottom: '2px solid #2384D1',
		}),

		inputelement: ReactStyle({
			height: '100%',
			width: '100%',
			lineHeight: '2em',
			padding: '5px 1em 5px 1em',
			border: 'none',
			boxSizing: 'border-box',
			background: 'transparent',
		})
	},

	//Block click to global
	onClick: function(e) {
		e.preventDefault();
		return false;
	},

	componentDidMount: function() {
		this.listenTo(Action.graph.selectNode, this.onSelectNode);
		this.listenTo(Action.graph.deselectNode, this.onDeselectNode);

		Mousetrap.bind(['enter'], (e) => {
			e.preventDefault();

			if (this.props.active) {
				Action.graph.editNode(this.getText());
				Action.graph.deselectNode();
				this.setText('');
			}
		});
	},

	onSelectNode(id) {
		if (id) {
			this.setText(Store.mapdata.doc.snapshot.nodes[id].text);
			this.focus();
		}
	},

	onDeselectNode() {

	},

	componentDidUpdate: function() {
		if (this.props.active) {
		}
	},

	focus: function() {
		this.refs.input.getDOMNode().focus();
	},

	setText: function(value) {
		this.refs.input.getDOMNode().value = value;
	},

	getText: function() {
		return this.refs.input.getDOMNode().value;
	},

	submit: function() {
		e.preventDefault();
		return false;
	},

	render: function() {
		var styles = {
			display: this.props.active ? 'block' : 'none'
		}
		return (<div styles={this.styles.inputbox} style={styles}>
			<input styles={this.styles.inputelement} onClick={this.onClick} className="mousetrap" value={this.props.text} ref="input" type="text" id="input-box"/>
		</div>);
	}
});


module.exports = InputBox;
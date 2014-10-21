/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var MorphButton = require('./morph-button.jsx');
var MorphForm = require('./morph-form.jsx');


var NewMap = React.createClass({

	getInitialState: function() {
		return {
			loading: false,
			error: false
		};
	},

	toggle: function() {
		this.refs.newMap.toggle();
	},

	submitNewDialog: function(data) {
		this.setState({
			loading: true
		});

		Store.maps.createMap(data).then((map) => {
			this.setState({
				loading: false,
				error: false
			});

			this.props.onCreate(map);

		}, () => {
			this.setState({
				loading: false,
				error: true
			});

		});
	},

	render: function () {

		var createForm = {
			inputs: [
				{id: "title", label: "Title", type: "text"},
			],
			buttons: [
				{id: "create-btn", text:"Create", loading: this.state.loading},
			]
		};

		return (
				<MorphButton ref="newMap" text="Create" onClick={this.toggle}>
					<MorphForm
						title="New Map"
						form={createForm}
						onSubmit={this.submitNewDialog}
						onClose={this.toggle} />
				</MorphButton>
			);
	},
});

module.exports = NewMap;
/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var _t = require('../../../assets/js/translation');


var Loader = React.createClass({

	close: function() {
		this.props.onClose();
	},

	render: function() {
		if (this.props.mode == null)
			return <div />;

		if (this.props.mode == 'on')
			return (
				<div className="loader">
					<div className="loader-inner">
						<span>{_t.loading}</span>
						<div />
					</div>
				</div>
			);

		return (
			<div className="loader fail">
				<div className="loader-inner">
					<span>{_t.loading_fail}</span>
					<button onClick={this.close}>{_t.close}</button>
				</div>
			</div>
		);
	}
});

module.exports = Loader;
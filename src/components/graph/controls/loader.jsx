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

// .loader {
// 	position: fixed;
// 	background: rgba(0, 0, 0, 0.5);
// 	top: 0; left: 0; right: 0; bottom: 0;
// 	z-index: 1000;
// }
// .loader-inner {
// 	border: none;
// 	padding: 0 1em;
// 	position: absolute;
// 	top: 0; left: 0; right: 0; bottom: 0;
// 	width: 200px;
// 	height: 100px;
// 	margin: auto;
// 	background-color: #3594cb;
// 	color: white;
// }

});

module.exports = Loader;
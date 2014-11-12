/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var ReactStyle = require('react-style');


var ShareBox = React.createClass({
	styles: {
		shareBox: ReactStyle({
			'box-shadow': '0 3px 3px rgba(100, 100, 100, 0.7)',
		}),
		shareInput: ReactStyle({
			border: '0'
		}),
	},

	getInitialState() {
		return {
			visible: false
		};
	},

	onClick() {
		this.setState({
			visible: true
		});
	},

	render() {
		return (
			<NavButton onClick={this.onClick} visible={this.state.visible} text="Share">
				<div styles={this.styles.shareBox}>
					Share Link: <input styles={this.styles.shareInput} value={this.props.shareURL} />
				</div>
			</NavButton>
		);

	}

});

var NavButton = React.createClass({
	styles: {
		button: ReactStyle({
			display: 'block',
			boxSizing: 'border-box',
			padding: '0px 6px 0px 27px',
			lineHeight: 43,
			fontSize: '16px',
			fontWeight: '400',
			color: '#2384D1',
			width: '100%',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
	 	}),
	},

	render() {
		return (<a onClick={this.props.onClick} styles={this.styles.button}>
			<span>
				{this.props.text}
				{this.props.visible ? this.props.children : ''}
			</span>
		</a>);
	}
});

var NavBar = React.createClass({
	styles: {
		nav: ReactStyle({
			position: 'absolute',
			top: 0,
			left: 0,
			transform: 'translate3d(0,0,0)',
			height: 44,
			width: 380,
			zIndex: '15',
		}),
	},

	render() {
		return (
			<nav styles={this.styles.nav}>
				<ShareBox shareURL={hostPath(this.props.shareURL)} />
			</nav>
		);
	}
});

module.exports = NavBar;
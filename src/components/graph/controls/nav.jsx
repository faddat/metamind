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
			boxShadow: '0 3px 3px rgba(100, 100, 100, 0.7)',
			position: 'absolute',
			top: '100%',
			right: 0,
			width: 'auto',
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

	componentDidMount() {
		_.defer(() => {
			this.refs.input.getDOMNode().focus();
			this.refs.input.getDOMNode().select();
		});
	},

	onInputClick(e) {
		this.refs.input.getDOMNode().focus();
		this.refs.input.getDOMNode().select();
		e.preventDefault();
	},

	render() {
		return (
			<NavButton onClick={this.onClick} visible={this.state.visible} text="Share">
				<input ref="input" styles={this.styles.shareBox} value={this.props.shareURL} onClick={this.onInputClick} readonly="readonly"/>
			</NavButton>
		);

	}

});

var NavButton = React.createClass({
	styles: {
		button: ReactStyle({
			position: 'relative',
			display: 'block',
			boxSizing: 'border-box',
			lineHeight: 43,
			padding: '0px 6px 0px 27px',
			fontSize: '16px',
			fontWeight: '400',
			color: '#2384D1',
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
			right: 10,
			transform: 'translate3d(0,0,0)',
			height: 44,
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
/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var ReactStyle = require('react-style');

var NavButton = React.createClass({
	styles: {
		link: ReactStyle({
			display: 'inline-block',
			lineHeight: 43,
			padding: '0px 16px 0px 27px',
			fontWeight: '400',
			fontSize: '16px',
			color: '#2384D1',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			cursor: 'pointer',
		}),

		container: ReactStyle({
			position: 'relative',
			display: 'inline-block',
	 	}),
	},

	render() {
		return (<div styles={this.styles.container}>
				<a styles={this.styles.link} onClick={this.props.onClick}>
				<span>
					{this.props.text}
				</span>
			</a>
			{this.props.visible ? this.props.children : ''}
		</div>);
	}
});

var NavBar = React.createClass({
	styles: {
		nav: ReactStyle({
			position: 'absolute',
			top: 0,
			right: 0,
			transform: 'translate3d(0,0,0)',
			height: 44,
			zIndex: '15',
		}),
	},

	render() {
		return (
			<nav styles={this.styles.nav}>
				{this.props.children}
			</nav>
		);
	}
});

module.exports = {
	NavBar: NavBar,
	NavButton: NavButton
}
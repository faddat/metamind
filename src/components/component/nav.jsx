/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Reflux = require('reflux');

var NavButton = React.createClass({
	styles: {
		link: ReactStyle({
			display: 'inline-block',
			lineHeight: 43,
			padding: '0px 20px',
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
			float: 'right',
			height: 44,
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
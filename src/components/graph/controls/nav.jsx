/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var ReactStyle = require('react-style');

//http://stackoverflow.com/questions/11128130/select-text-in-javascript
function selectText(element) {
    var doc = document;

    if (doc.body.createTextRange) { // ms
        var range = doc.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) { // moz, opera, webkit
        var selection = window.getSelection();
        var range = doc.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}


var Back = React.createClass({

	onClick(e) {
		Action.closeMap();
		e.preventDefault();
		e.stopPropagation();
	},

	render() {
		return (
			<NavButton onClick={this.onClick} visible="true" text="Back">
			</NavButton>
		);

	}

});


var ShareBox = React.createClass({
	styles: {
		shareBox: ReactStyle({
			boxShadow: '0 3px 3px rgba(100, 100, 100, 0.5)',
			position: 'absolute',
			top: '100%',
			right: '0',
			width: 'auto',
			cursor: 'caret',
			zIndex: '2',
			marginRight: 16,
			whiteSpace: 'nowrap',
			padding: 5,
			border: '1px solid rgba(0,0,0,0.1)',
			background: 'white',
		}),
		backdrop: ReactStyle({
			position: 'fixed',
			display: 'block',
			top: '0',
			right: '0',
			width: '100vw',
			height: '100vh',
			zIndex: '1',
		}),
	},

	getInitialState() {
		return {
			visible: false
		};
	},

	onClick() {
		this.setState({
			visible: !this.state.visible
		});
	},

	componentDidMount() {

	},

	onInputClick(e) {
		selectText(this.refs.input.getDOMNode());
		e.preventDefault();
		e.stopPropagation();
	},

	render() {
		return (
			<NavButton onClick={this.onClick} visible={this.state.visible} text="Share">
				<div ref="input" styles={this.styles.shareBox} onClick={this.onInputClick}>
					{this.props.shareURL}
				</div>
				<div styles={this.styles.backdrop} onClick={this.onClick} />
			</NavButton>
		);

	}

});

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
				<Back />
				<ShareBox shareURL={hostPath(this.props.shareURL)} />
			</nav>
		);
	}
});

module.exports = NavBar;
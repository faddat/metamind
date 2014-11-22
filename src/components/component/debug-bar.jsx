/**
 * DebugBar
 *
 * DebugBar Description
**/




var DebugBar = React.createClass({

	index: 0,

	getInitialState() {
		return {
			objects: {},
		};
	},

	debug(obj) {

		var objects = this.state.objects;

		objects[index++] = obj;

		this.setState({
			objects: objects
		});

		return () => { this.undebug[index] };
	},

	undebug(index) {
		var objects = this.state.objects;

		delete objects[index];

		this.setState({
			objects: objects
		});
	},

	renderAll() {
		var	children = [];



		return children;
	},

	render() {
		var children = this.renderAll();

		return (
			<div styles={this.styles.widget}>
				{children}
			</div>
		);
	},

	styles: {
		widget: ReactStyle({
			position: 'fixed',
			transform: 'translate3d(0, 0, 0)',
			bottom: 0,
			right: 0,
			width: 75,
			height: 75,
			padding: 10,
			lineHeight: 75,
		}),
	},
});

module.exports = DebugBar;
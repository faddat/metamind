var React = require('react');
var Reflux = require('reflux');
var tweenState = require('react-tween-state');

var BackDrop = React.createClass({
	mixins: [Reflux.ListenerMixin, tweenState.Mixin],

	getInitialState() {
		return {
			visible: 'hidden',
			opacity: 0,
		};
	},

	componentDidMount() {

		this.listenTo(Action.backdrop.open, () => {
			this.setState({
				visible: 'visible'
			});

			this.tweenState('opacity', {
		      easing: tweenState.easingTypes.easeInOutQuad,
		      duration: 400,
		      endValue: 1,
		    });

		});

		this.listenTo(Action.backdrop.close, (duration) => {
			this.tweenState('opacity', {
		      easing: tweenState.easingTypes.easeInOutQuad,
		      duration: duration ? duration: 500,
		      endValue: 0,
		      onEnd: () => {
				this.setState({
					visible: 'hidden'
				});
		      }
		    });
		});

	},

	render() {
		return <div styles={this.styles.backdrop} style={{visibility: this.state.visible, opacity: this.getTweeningValue('opacity')}}/>
	},

	styles: {
		backdrop: ReactStyle({
			position: 'absolute',
			zIndex: '999',
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			background: 'rgba(0, 0, 0, 0.5)',
			transform: 'translate3d(0,0,0)',
		}),
	},
});

var Util = React.createClass({
	render() {
		return <div>
			<BackDrop />
		</div>
	},

});

module.exports = Util;
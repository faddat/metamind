
var ReactStyle = require('react-style')
var tweenState = require('react-tween-state');

var MorphButton = React.createClass({
  	mixins: [tweenState.Mixin],

	getInitialState() {
		return {
			open: false,
			trans: 0,
			rect: null,
			innerRect: null,
			tweenage: 0,
			innerTweenage: 0,
			buttonTweenage: 1,
		};
	},

	componentDidMount() {
		var button = this.refs.button.getDOMNode();
		var inner = this.refs.inner.getDOMNode();

		this.setState({
			rect: button.getBoundingClientRect(),
			innerRect: inner.getBoundingClientRect(),
		});

		console.log('this.state', this.state);
	},

	componentDidUpdate: function(prevProps, prevState) {
		if (prevState.rect == null && this.props.first && !this.state.open) {
			console.log('AUTO OPEN');
			this.toggle();
		}
	},

	componentWillUnmount() {
		if (this.state.open) {
			actions.backdrop.close(100);
		}
	},

	toggle() {
		var open = !this.state.open;
		if (open) {
			actions.backdrop.open();
		} else {
			actions.backdrop.close();
		}

		var button = this.refs.button.getDOMNode();
		var inner = this.refs.inner.getDOMNode();

		var rect = open ? button.getBoundingClientRect() : this.state.rect;

		//refresh inner rect incase size changed externally
		var innerRect = this.state.innerRect;

		console.log('rect', rect);
		console.log('innerRect', innerRect);

		this.tweenState('tweenage', {
	      easing: tweenState.easingTypes.easing,
	      duration: 300,
	      endValue: this.state.tweenage == 1 ? 0 : 1,
	    });
	    this.tweenState('buttonTweenage', {
	      easing: tweenState.easingTypes.linear,
	      delay: 200,
	      duration: 200,
	      endValue: this.state.buttonTweenage == 1 ? 0 : 1,
	    });
	    this.tweenState('innerTweenage', {
	      easing: tweenState.easingTypes.easing,
	      delay: this.state.innerTweenage == 1 ? 0 : 200,
	      duration: this.state.innerTweenage == 1 ? 100 : 200,
	      endValue: this.state.innerTweenage == 1 ? 0 : 1,
	    });

	      // easing: easingFunction,
		  // duration: timeInMilliseconds,
		  // delay: timeInMilliseconds,
		  // beginValue: aNumber,
		  // endValue: aNumber,
		  // onEnd: endCallback,
		  // stackBehavior: behaviorOption

		this.setState({
			open: open,
			rect: rect,
			innerRect: innerRect,
		});
	},

	lerp(x1, x2, x) {
		return (x2 - x1) * x + x1;
	},

	render: function() {

		var tweenage = this.getTweeningValue('tweenage');
		var buttonTweenage = this.getTweeningValue('buttonTweenage');
		var innerTweenage = this.getTweeningValue('innerTweenage');
		var tweenStyle = null;
		var innerStyle = null;
		var buttonStyle = null;

		if (this.state.rect != null && tweenage != 0) {
			var rect = this.state.rect;
			var innerRect = this.state.innerRect;

			var transform = [];
			var scaleX = this.lerp(rect.width/innerRect.width, 1, tweenage);
			var scaleY = this.lerp(rect.height/innerRect.height, 1, tweenage);
			var x = Math.ceil(this.lerp(0, ( - rect.left + (window.innerWidth - innerRect.width) / 2), tweenage));
			var y = Math.ceil(this.lerp(0, ( - rect.top + ( window.innerHeight - innerRect.height) / 2), tweenage));


			transform = [
				'translate3d(-50%, -50%, 0)',
				'translate3d('+x+'px, '+y+'px, 0)',
				'scale('+scaleX+', '+scaleY+')',
                "translate3d(50%, 50%, 0)",

			];

			tweenStyle = ReactStyle({
				opacity: tweenage,
				visibility: 'visible',
	            transform: transform.join(' '),
	        });

	        innerStyle = ReactStyle({
	        	opacity: innerTweenage,
	        });

	        buttonStyle = ReactStyle({
	        	opacity: this.state.open ? 0 : buttonTweenage,
	        });

		} else {

		}

		var propStyle = ReactStyle(this.props.style);

		return (
			<div styles={this.styles.tweenButton}>
				<div styles={[this.styles.morpher, tweenStyle]}>
					<div ref='inner' styles={[this.styles.inner, innerStyle]}>{this.props.children}</div>
				</div>
				<button ref='button' onClick={this.toggle} styles={[this.styles.button, buttonStyle, propStyle]}>
					{this.props.text}
				</button>
			</div>
		);
	},

	styles: {
		tweenButton: ReactStyle({
			display: 'inline-block',
			position: 'relative',
		}),

		button: ReactStyle({
			width: 300,
			height: '100%',

			padding: '0 1em',
			border: 'none',
			backgroundColor: '#3594cb',
			color: '#f9f6e5',
			textTransform: 'uppercase',
			letterSpacing: '1px',
			fontWeight: '700',
			lineHeight: '40px',
			overflow: 'hidden',

			display: 'inline-block',
			cursor: 'pointer',

		}),

		morpher: ReactStyle({
			minWidth: 300,
			zIndex: '1000',

			backgroundColor: '#3594cb',
			position: 'absolute',
			visibility: 'hidden',
			top: 0,
			left: 0,
		}),

		inner: ReactStyle({
			display: 'block',
			color: 'white',
		}),
	}
});

module.exports = MorphButton;

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
		};
	},
	componentDidMount: function() {
		var button = this.refs.button.getDOMNode();
		var inner = this.refs.inner.getDOMNode();

		this.setState({
			rect: button.getBoundingClientRect(),
			innerRect: inner.getBoundingClientRect(),
		});
		console.log('this.state', this.state);
	},
	toggle() {
		var open = !this.state.open;

		var button = this.refs.button.getDOMNode();
		var inner = this.refs.inner.getDOMNode();

		var rect = open ? button.getBoundingClientRect() : this.state.rect;

		//refresh inner rect incase size changed externally
		var innerRect = this.state.innerRect;//open ? inner.getBoundingClientRect() : this.state.innerRect;
		var innerRect = this.state.innerRect;//open ? inner.getBoundingClientRect() : this.state.innerRect;

		console.log('rect', rect);
		console.log('innerRect', innerRect);

		this.tweenState('tweenage', {
	      easing: tweenState.easingTypes.easeInOutQuad,
	      duration: 300,
	      endValue: this.state.tweenage == 1 ? 0 : 1,
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
		var tweenStyle = null;
		var innerStyle = null;

		if (this.state.rect != null && tweenage != 0) {
			var rect = this.state.rect;
			var innerRect = this.state.innerRect;

			var transform = [];
			var scaleX = this.lerp(rect.width/innerRect.width, 1, tweenage);
			var scaleY = this.lerp(rect.height/innerRect.height, 1, tweenage);
			var x = this.lerp(0, ( - rect.left + (window.innerWidth - innerRect.width) / 2), tweenage);
			var y = this.lerp(0, ( - rect.top + ( window.innerHeight - innerRect.height) / 2), tweenage);


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
	        	opacity: tweenage,
	        });

		} else {

		}



		return (
			<div styles={this.styles.tweenButton}>
				<div styles={[this.styles.morpher, tweenStyle]}>
					<div ref='inner' styles={[this.styles.inner, innerStyle]}>{this.props.children}</div>
				</div>
				<a ref='button' onClick={this.toggle} styles={[this.styles.button]}>
					{this.props.text}
				</a>
			</div>
		);
	},

	styles: {
		tweenButton: ReactStyle({
			 display: 'inline-block',
			 position: 'relative',
		}),
		button: ReactStyle({

			display: 'inline-block',
			lineHeight: 43,
			padding: '0px 20px',
			fontWeight: '400',
			fontSize: '16px',
			color: '#2384D1',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			cursor: 'pointer',


			// height: '100%',
			zIndex: 1000,
			cursor: 'pointer',

		}),

		morpher: ReactStyle({
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
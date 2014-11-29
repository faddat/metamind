/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');


var MorphButton = require('./component/tween-button.jsx');
var MorphForm = require('./component/morph-form.jsx');


var Landing = React.createClass({
    mixins: [Reflux.connect(api.auth, 'appdata'), Navigation],

	getInitialState() {
		return {
			loginLoading: false,
			registerLoading: false,
			appdata: null,
		};
	},

	componentWillUpdate: function(nextProps, nextState) {
		if (nextState.appdata.user && typeof nextState.appdata.user === 'object') {
			this.transitionTo('/app/graphs');
		}
	},

	onEnter() {
		this.props.onEnter()
	},

	toggleLogin() {
		this.refs.login.toggle();
	},

	toggleRegister() {
		this.refs.register.toggle();
	},

	submitLogin(data) {
		api.auth.login(data);
	},

	submitRegister(data) {
		api.auth.register(data);
	},

	render() {
		var loginForm = {
			inputs: [
				{id: 'email', label: 'Email', type: 'email'},
				{id: 'password', label: 'Password', type: 'password'},
			],
			buttons: [
				{id: 'create-btn', text:'Login', loading: this.state.loginLoading},
			]
		};
		var registerForm = {
			inputs: [
				{id: 'email', label: 'Email', type: 'email'},
				{id: 'password', label: 'Password', type: 'password'},
				{id: 'password2', label: 'Confirm Password', type: 'password'},
			],
			buttons: [
				{id: 'create-btn', text:'Register', loading: this.state.registerLoading},
			]
		};

		return (
			<div styles={this.styles.landingContainer}>
				<div styles={this.styles.landing}>
					<span styles={this.styles.company}>21cdawn</span>
					<h1 styles={this.styles.title}>MetaMind</h1>

					<div styles={this.styles.morphButton}>
						<MorphButton ref='login' text='Login' onClick={this.toggleLogin}>
							<MorphForm
								title='Login'
								form={loginForm}
								onSubmit={this.submitLogin}
								onClose={this.toggleLogin} />
						</MorphButton>
					</div>
					<div styles={this.styles.morphButton}>
						<MorphButton ref='register' text='Register' onClick={this.toggleRegister}>
							<MorphForm
								title='Register'
								form={registerForm}
								onSubmit={this.submitRegister}
								onClose={this.toggleRegister} />
						</MorphButton>
					</div>
				</div>
			</div>
		);
	},

	styles: {
		landing: ReactStyle({
			position: 'absolute',
			top: '-8em',
			left: 0,
			right: 0,
			bottom: 0,
			height: '10em',
			width: 300,
			textAlign: 'center',
			margin: 'auto',
		}),

		company: ReactStyle({
			fontFamily: 'Lato,Calibri,Arial,sans-serif',
			display: 'block',
			fontWeight: '700',
			textTransform: 'uppercase',
			letterSpacing: '0.5em',
			textAlign: 'center',
			padding: '0 0 0.6em 0',
		}),

		title: ReactStyle({
			letterSpacing: '0.1em',
			margin: '0 0 1em 0',
			fontSize: '2.125em',
			fontWeight: '400',
			textAlign: 'center',
			lineHeight: '1',
		}),

		morphButton: ReactStyle({
			textAlign: 'center',
			margin: '3px 0 10px 0',
			display: 'block',
		}),

		landingContainer: ReactStyle({
			position: 'relative',
			width: '100vw',
			height: '100vh',
		}),

	},
});


module.exports = Landing;
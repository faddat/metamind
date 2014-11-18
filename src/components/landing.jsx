/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var ReactStyle = require('react-style');
var Reflux = require('reflux');


var MorphButton = require('./component/morph-button.jsx');
var MorphForm = require('./component/morph-form.jsx');


var Landing = React.createClass({
    mixins: [Reflux.connect(Store.appdata, 'appdata'), Navigation],

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
		Store.appdata.login(data);
	},

	submitRegister(data) {
		Store.appdata.register(data);
	},

	render() {
		var loginForm = {
			inputs: [
				{id: "email", label: "Email", type: "email"},
				{id: "password", label: "Password", type: "password"},
			],
			buttons: [
				{id: "create-btn", text:"Login", loading: this.state.loginLoading},
			]
		};
		var registerForm = {
			inputs: [
				{id: "email", label: "Email", type: "email"},
				{id: "password", label: "Password", type: "password"},
				{id: "password2", label: "Confirm Password", type: "password"},
			],
			buttons: [
				{id: "create-btn", text:"Register", loading: this.state.registerLoading},
			]
		};

		return (
			<div className='overmap'>
				<header>
					<span className='company'>21cdawn</span>
					<div className='left'>
						<h1>MetaMind</h1>
					</div>
					<div className='right'>


					<div styles={this.styles.morphButton}>
						<MorphButton ref="login" text="Login" onClick={this.toggleLogin}>
							<MorphForm
								title="Login"
								form={loginForm}
								onSubmit={this.submitLogin}
								onClose={this.toggleLogin} />
						</MorphButton>
					</div>
					<span styles={this.styles.joiner}> or </span>
					<div styles={this.styles.morphButton}>
						<MorphButton ref="register" text="Register" onClick={this.toggleRegister}>
							<MorphForm
								title="Register"
								form={registerForm}
								onSubmit={this.submitRegister}
								onClose={this.toggleRegister} />
						</MorphButton>
					</div>
					</div>
					<span className='clear-me'></span>
				</header>
				<div className='flex-container'>
					<span className='clear-me'></span>
				</div>
			</div>
		);
	},

	styles: {
		joiner: ReactStyle({
		}),
		morphButton: ReactStyle({
			margin: '3px 15px 10px 15px',
			display: 'inline-block',
		}),

	},
});


module.exports = Landing;
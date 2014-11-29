
var Auth = {
  componentWillMount: function() {
    this.authFail = actions.authFail.listen(this.onAuthFail);

  	console.log('Auth Check');
	if (!api.auth.isLoggedin()) {
		actions.authFail();
		return false;
	}

  },

  componentWillUnmount: function() {
  	this.authFail();
  },

  onAuthFail: function() {
  	this.transitionTo('/');
  },
};

module.exports = Auth;
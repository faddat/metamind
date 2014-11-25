
var Auth = {
  componentWillMount: function() {
    this.authFail = Action.authFail.listen(this.onAuthFail);

  	console.log('Auth Check');
	if (!Store.appdata.isLoggedin()) {
		Action.authFail();
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
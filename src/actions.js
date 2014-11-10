'use strict';

var Reflux = require('reflux');



// Creating an Action

// var textUpdate = Reflux.createAction();

var Actions = Reflux.createActions([
    'openOverview',
	'openMap',
	'closeMap',

	'refreshMaps',
    'createMap',
    'deleteMap',

	'selectNode',

	'docReady',
	'docChanged',

	'chatReady',

	'authFail'
]);

module.exports = Actions;
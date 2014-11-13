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


	'docReady',
	'docChanged',

	'chatReady',

	'authFail',
]);

Actions.graph = Reflux.createActions([
	'selectNode',
]);

module.exports = Actions;
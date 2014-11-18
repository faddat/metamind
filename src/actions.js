'use strict';

var Reflux = require('reflux');



// Creating an Action

// var textUpdate = Reflux.createAction();

var Actions = Reflux.createActions([
    'openOverview',

    'createMap',
    'deleteMap',


	'docReady',
	'docChanged',

	'chatReady',

	'authFail',
]);

Actions.graph = Reflux.createActions([
	'selectNode',
	'deselectNode',
]);

module.exports = Actions;
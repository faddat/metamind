'use strict';

var Reflux = require('reflux');



// Creating an Action

// var textUpdate = Reflux.createAction();

var Actions = Reflux.createActions([

    'createMap',
    'deleteMap',


	'docReady',
	'chatReady',

	'authFail',
]);

Actions.graph = Reflux.createActions([
	'selectNode',
	'deselectNode',
]);

module.exports = Actions;
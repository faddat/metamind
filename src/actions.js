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

	'newNode',
	'newEdge',
	'selectNode',

	'docReady',
	'docChanged',

	'netBoardMessage'

]);

module.exports = Actions;
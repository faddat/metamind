'use strict';

var Reflux = require('reflux');



// Creating an Action

// var textUpdate = Reflux.createAction();

var Actions = Reflux.createActions([
    'openOverview',
	'openMap',

	'refreshMaps',
    'createMap',
    'deleteMap',

	'newNode',
	'newEdge',
	'selectNode',
	'editNode',

	'docReady',
	'docChanged',
	'docCreated',

	'netBoardMessage'

]);

module.exports = Actions;
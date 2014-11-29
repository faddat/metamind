'use strict';

var Reflux = require('reflux');


global.actions = Reflux.createActions([
	'authFail',
]);

global.actions.graph = Reflux.createActions([
	'selectNode',
	'deselectNode',
	'editNode',
]);

global.actions.backdrop = Reflux.createActions([
	'open',
	'close',
]);
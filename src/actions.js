'use strict';

var Reflux = require('reflux');



// Creating an Action

// var textUpdate = Reflux.createAction();

var Actions = Reflux.createActions([
    "openOverview",
	"openMap",

	"refreshMaps",
    "createMap",
    "deleteMap"
]);

module.exports = Actions;
/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

var React = require('react');
var ReactStyle = require('react-style');

window.hostPath = function(path) {
	return config.apiEndpoint + path;
};


var ws = new WebSocket(config.socketEndpoint);

window.sjsConnection = new sharejs.Connection(ws);
// sjsConnection.debug = true;

global.Action = require('./actions.js');
global.Store = require('./stores.js');


// Export React so the dev tools can find it
(window !== window.top ? window.top : window).React = React;

var HomePage = require('./components/index.jsx');

ReactStyle.inject();
HomePage();
/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');

window.hostPath = function(path) {
	return config.apiEndpoint + path;
};


window._ = require('underscore');


global.Action = require('./actions.js');
global.Store = require('./stores.js');


// Export React so the dev tools can find it
(window !== window.top ? window.top : window).React = React;

var HomePage = require('./components/index.jsx');

ReactStyle.inject();
HomePage();


// var _NOTA = {
//    project: "1bd01218-eefb-40b4-8d8c-18f8c7e811fb",
//    projectProtocol: "http",
//    appDomain: "beta.nota.io"
// };

// (function() {;
//    var n = document.createElement("script"); n.type = "text/javascript"; n.async = true;
//    n.src = ("https:" == document.location.protocol ? "https://" : "http://") + "beta.nota.io/scripts/build/client/client.bootstrap.js";
//    var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(n, s);
// })();

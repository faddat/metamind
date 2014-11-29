'use strict';

global.api = {
	auth: require('./stores/api-auth.js'),
	graph: require('./stores/api-graph.js'),
};

global.rt = {
	chat: require('./stores/rt-chat.js'),
	graph: require('./stores/rt-graph.js'),
};
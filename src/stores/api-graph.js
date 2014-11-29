var Reflux = require('reflux');
var api = require('../api/api.js');

var graph = Reflux.createStore({

    getDefaultData() {
        return [];
    },

    init() {

    },

    createGraph(graph) {
        return new Promise((resolve, reject) => {
            api.post('/graph', graph).then((res) => {
                if (res.error) {
                    logError(res.error);
                    return reject(error);
                }

                this.graphs.push(res.graph);
                resolve(res.graph);

                this.trigger(this.graphs);
            }).catch((message) => {
                handleApiError(this, this.status, message);
                reject(message);
            });
        });
    },

    getGraphs() {
        //posting because gets are retarted with qwest
        api.post('/graphlist').then((res) => {
            if(res.error) {
                return reject(error);
            }
            this.graphs = res.graphs;
            this.trigger(res.graphs);
        }).catch(function(message)  {
            handleApiError(this, this.status, message);
        });
    },
});


module.exports = graph;
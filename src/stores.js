'use strict';

// Creating a Data Store - Listening to textUpdate action
var Reflux = require('reflux');
var qwest = require('qwest');

var api = {};
_.each(['post', 'get', 'delete', 'put'], (v) => {
    api[v] = function(url, data, options) {
        return qwest[v](hostPath(url), data, _.extend({responseType: 'json',dataType: 'json',}, options));
    }
});

console.log('api', api);

var logError = function (error) {
    qwest.post('/analytics/error').then((response) => {
        console.log('response', response);
    }).catch((err) => {
        console.log('log error error =p');
    })
}

function handleApiError(xhr, status, err) {
    console.log('xhr, status, err', xhr, status, err);
    if (err === 'Unauthorized') {
        Action.authFail();
        return;
    }
};

var Store = {
    appdata: Reflux.createStore({
        appdata: {
            user: {
                email: "",
                picsrc: ""
            }
        },
        init() {
            this.getUser();
        },

        getDefaultData() {
            return this.appdata;
        },

        getUser() {
            $.ajax({
                method: 'GET',
                url: hostPath('/user'),
                success: (res) => {
                    this.appdata.user = res.user;
                    this.trigger(res.appdata);
                },
                error: (a, b, c, d) => {
                    handleApiError(a, b, c, d);
                    console.log('get user fail')
                },
                dataType: 'json',
                contentType: 'application/json'
            });
        }
    }),

    maps: Reflux.createStore({
        getDefaultData() {
            return [];
        },

        init: function() {
            this.listenTo(Action.createMap, this.createMap);
            this.listenTo(Action.refreshMaps, this.getMaps);
        },

        createMap: function(graph) {
            return new Promise((resolve, reject) => {
                api.post('/graphs', graph).then((res) => {
                    if (res.error) {
                        logError(res.error);
                        console.log(error);
                        return reject(error);
                    }

                    this.graphs.push(res.graph);

                    resolve(res.graph);

                    this.trigger(this.graphs);
                }).catch((message) => {
                    reject(message);
                });
            });
        },

        getMaps: function() {
            api.get('/graphs').then((res) => {
                if(res.error) {
                    console.log('error', error);
                    return reject(error);
                }
                this.graphs = res.graphs;
                this.trigger(res.graphs);
            }).catch((xhr, status, err) => {
                handleApiError(xhr, status, err);
            });
        },
    }),

    mapdata: Reflux.createStore({
        doc: null,
        i: 0,

        init() {
            this.listenTo(Action.openMap, this.openMap);
            this.listenTo(Action.closeMap, this.closeMap);
        },

        openMap(id) {
            this.doc = sjsConnection.get('graph', id);

            //Creates or logs => Operation was rejected (Document already exists). Trying to rollback change locally.
            this.doc.create('json0', {
                nodes: {
                    root: {text: 'Mind Map'}
                },
                edges: []
            });

            this.doc.subscribe();


            this.doc.on('after op', (op, localSite) => {
                this.docChanged();
                console.log('this.doc', this.doc);
            });

            this.doc.whenReady(() => {
                Action.docReady(id);
                this.docChanged();
            });
        },

        closeMap() {
            this.doc.unsubscribe();
        },

        docChanged() {
            this.trigger(this.doc.snapshot);
        },

        // Generate next unique id based on user id
        nextId() {
            return sjsConnection.id + this.i++;
        },

        // Build op to create a node
        _nodeOp(key, node) {
            return {p:['nodes', key], oi:node};
        },

        // Build op to create an edge
        _edgeOp(edge) {
            return {p:['edges', this.doc.snapshot.edges.length], li:edge};
        },

        // Build op to replace a node
        _nodeUpdateOp(id, node) {
            return {p:['nodes', id], od: this.doc.snapshot.nodes[id], oi:node};
        },

        // Create a new node
        // key as a unique string id, node as { text }, edge as { a, b }
        newNode(key, node, edge) {
            var op = [
                this._nodeOp(key, node),
                this._edgeOp(edge)
            ];
            this.doc.submitOp(op);
        },

        // Get node by key
        getNode(id) {
            return this.doc.snapshot.nodes[id];
        },

        // Update a node
        // id is the key, node is { text }
        updateNode(id, node) {
            var op = [
                this._nodeUpdateOp(id, node)
            ];
            this.doc.submitOp(op);
        }
    }),


    //In-Map Chat Store
    mapchat: Reflux.createStore({
        doc: null,
        i: 0,

        init() {

        },

        getDefaultData() {
            return {
                chats: [],
                users: {}
            };
        },

        openChannel(id) {
            this.doc = sjsConnection.get('mapchat', id);

            //Creates or logs => Operation was rejected (Document already exists). Trying to rollback change locally.
            this.doc.create('json0', {
                chats: [],
                users: {}
            });

            this.doc.subscribe();

            this.doc.on('after op', (op, localSite) => {
                this.docChanged();
            });

            this.doc.whenReady(() => {
                Action.chatReady(id);
                this.docChanged();
            });
        },

        closeChannel() {
            this.doc.unsubscribe();
        },

        docChanged() {
            console.log('this.doc.snapshot', this.doc.snapshot);
            this.trigger(this.doc.snapshot);
        },


        // Build op to create a chat
        _chatOp(chat) {
            return {p:['chats', this.doc.snapshot.chats.length], li:chat};
        },


        // Sends a chat
        create(chat) {
            chat.id = sjsConnection.id + this.i++;
            this.doc.submitOp([
                this._chatOp(chat)
            ]);
        },
    })
};


module.exports = Store;
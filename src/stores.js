'use strict';

// Creating a Data Store - Listening to textUpdate action
var Reflux = require('reflux');
var qwest = require('qwest');

var authData = {};

var api = {};


  // componentDidMount() {
  //   this.listenTo(Action.authFail, this.onAuthFail);
  // },

  // onAuthFail() {
  //   document.location.href = '/';
  // },
_.each(['post', 'get', 'delete', 'put'], (v) => {
    api[v] = function(url, data, options) {
        var _data = typeof data !== 'object' ? {} : data;
        var _options = typeof options !== 'object' ? {} : options;
        var _data = _.extend(_data, authData);
        var _options = _.extend(_options, {
            responseType: 'json',
            dataType: 'json',
        });

        console.log('_data', _data);
        console.log('_options', _options);

        return qwest[v](hostPath(url), _data, _options);
    }
});

var logError = function (error) {
    qwest.post('/analytics/error').then((response) => {
        console.log('response', response);
    }).catch((err) => {
        console.log('log error error =p');
    })
}

function handleApiError(xhr, status, message) {
    console.log(xhr, status, message);
    if (status == '401') {
        Action.authFail();
        return;
    }
};

var Store = {
    appdata: Reflux.createStore({
        appdata: {
            user: null,
            token: {
                id: null
            }
        },

        getDefaultData() {
            return this.appdata;
        },

        isLoggedin() {
            return this.validate(this.appdata);
        },

        validate(data) {
            return data != null
              && _.isObject(data.user)
              && _.isObject(data.token)
              && typeof data.token.id == 'string';
        },

        storedData() {
            var appdata = localStorage.getItem('appdata');

            if (!appdata) {
                return false;
            }

            appdata = JSON.parse(appdata);
            if (!this.validate(appdata)) {
                return false;
            }

            return appdata;
        },

        connectSocket(token) {
            var ws = new WebSocket(config.socketEndpoint + token);
            window.sjsConnection = new sharejs.Connection(ws);
            sjsConnection.debug = true;
        },

        setAppdata(data) {
            this.appdata = data;
            localStorage.setItem('appdata', JSON.stringify(this.appdata));

            this.connectSocket(data.token.id);
            authData.access_token = data.token.id;

            this.trigger(this.appdata);
        },

        login(data) {
            var stored = this.storedData();

            if (stored) {
                this.setAppdata(stored);
                return;
            }

            api.post('/login', data).then((res) => {
                this.setAppdata(res);
            }).catch(function(message)  {
                handleApiError(this, this.status, message);
            });
        },

        register(data) {
            api.post('/user', data).then((res) => {
                if (res.inserted == 1) {
                    this.login(data);
                }
            }).catch(function(message)  {
                handleApiError(this, this.status, message);
            });
        }
    }),



    maps: Reflux.createStore({
        getDefaultData() {
            return [];
        },

        init: function() {
            this.listenTo(Action.createMap, this.createMap);
        },

        createMap: function(graph) {
            return new Promise((resolve, reject) => {
                api.post('/graph', graph).then((res) => {
                    console.log('res', res);
                    if (res.error) {
                        logError(res.error);
                        console.log(error);
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

        getMaps: function() {
            //posting because gets are retarted with qwest
            api.post('/graphlist').then((res) => {
                if(res.error) {
                    console.log('error', error);
                    return reject(error);
                }
                this.graphs = res.graphs;
                this.trigger(res.graphs);
            }).catch(function(message)  {
                handleApiError(this, this.status, message);
            });
        },
    }),

    mapdata: Reflux.createStore({
        doc: null,
        i: 0,

        init() {

        },

        getDefaultData() {
            return {
                nodes: {},
                edges: [],
            }
        },

        openMap(id) {
            console.log(id);
            this.doc = sjsConnection.get('graph', id);

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
    chat: Reflux.createStore({
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
            this.doc = sjsConnection.get('chat', id);

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
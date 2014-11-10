'use strict';

// Creating a Data Store - Listening to textUpdate action
var Reflux = require('reflux');

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
                $.ajax({
                    method: 'POST',
                    url: hostPath('/graphs'),
                    data: JSON.stringify(graph),
                    success: (res) => {
                        if (res.error) {
                            console.log(error);
                            return reject(error);
                        }

                        this.data.push(res.graph);

                        //Create Document with the correct ID
                        sjsConnection.get('graph', graph.id, function(error, doc) {
                            resolve(graph);
                        });
                        this.setData(this.data);
                    },
                    error: reject,
                    dataType: 'json',
                    contentType: 'application/json'
                });
            });
        },

        getMaps: function() {
            $.ajax({
                url: hostPath('/graphs'),
                success: (res) => {
                    if(res.error) {
                        console.log('error', error);
                        return reject(error);
                    }
                    this.trigger(res.graphs);
                },
                error: (xhr, status, err) => {
                    handleApiError(xhr, status, err);
                },
                dataType: 'json',
                contentType: 'application/json'
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
            this.doc.subscribe();

            this.doc.on('after op', (op, localSite) => {
                this.docChanged();
            });

            this.doc.whenReady(() => {
                if (!this.doc.type) {
                    this.doc.create('json0', {
                        nodes: {
                            root: {text: 'Mind Map'}
                        },
                        edges: []
                    });
                }

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
            return [];
        },

        openChannel(id) {
            this.doc = sjsConnection.get('mapchat', id);
            this.doc.subscribe();

            this.doc.on('after op', (op, localSite) => {
                this.docChanged();
            });

            this.doc.whenReady(() => {
                if (!this.doc.type) {
                    this.doc.create('json0', {
                        chats: [
                        /*
                            user
                            message
                        */
                        ]
                    });

                }

                Action.chatReady(id);
                this.docChanged();
            });
        },

        closeChannel() {
            this.doc.unsubscribe();
        },

        docChanged() {
            this.trigger(this.doc.snapshot.chats);
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
    }),

    //In-Map Chat Store
    chatusers: Reflux.createStore({
        doc: null,

        init() {

        },

        getDefaultData() {
            return [];
        },

        openChannel(id) {
            this.doc = sjsConnection.get('chatusers', id);
            this.doc.subscribe();

            this.doc.on('after op', (op, localSite) => {
                this.docChanged();
            });

            this.doc.whenReady(() => {
                if (!this.doc.type) {
                    this.doc.create('json0', {
                        users: []
                    });
                }

                this.docChanged();
            });
        },

        closeChannel() {
            this.doc.unsubscribe();
        },

        docChanged() {
            this.trigger(this.doc.snapshot.users);
        },


        // // Build op to create a chat
        // _chatOp(chat) {
        //     return {p:['chats', this.doc.snapshot.chats.length], li:chat};
        // },


        // // Sends a chat
        // create(chat) {
        //     chat.id = sjsConnection.id + this.i++;
        //     this.doc.submitOp([
        //         this._chatOp(chat)
        //     ]);
        // },
    }),
};




module.exports = Store;
'use strict';

// Creating a Data Store - Listening to textUpdate action
var Reflux = require('reflux');


var Store = {
    user: Reflux.createStore({
        user: {
            email: "",
            picsrc: ""
        },
        init() {
            this.getUser();
        },

        getDefaultData() {
            return this.user;
        },

        getUser() {
            $.ajax({
                method: 'GET',
                url: hostPath('/user'),
                success: (res) => {
                    console.log('res.user', res.user);
                    this.user = res.user;
                    this.trigger(res.user);
                },
                error: () => {
                    console.log('get user fail')
                },
                dataType: 'json',
                contentType: 'application/json'
            });
        }
    }),
    maps: Reflux.createStore({

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
                    this.setData(res.graphs);
                },
                error: () => {
                    this.setData(false);
                },
                dataType: 'json',
                contentType: 'application/json'
            });
        },

        setData: function(data) {
            if (data) {
                this.status = 'success';
                this.data = data;
            } else {
                this.status = 'fail';
            }

            this.trigger({
                status: this.status,
                data: this.data
            });
        }
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
};




module.exports = Store;
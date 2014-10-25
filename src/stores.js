'use strict';

// Creating a Data Store - Listening to textUpdate action
var Reflux = require('reflux');
var Net = require('./assets/js/collab-engine');



var Store = {
    maps: Reflux.createStore({

        init: function() {
            this.listenTo(Action.createMap, this.createMap);
            this.listenTo(Action.refreshMaps, this.getMaps);
        },

        createMap: function(map) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    method: 'POST',
                    url: '/maps',
                    data: JSON.stringify(map),
                    success: (response) => {
                        if (response.status == 'ok') {
                            map.id = response.id;
                            this.data.push(map);

                            //Create Document with the correct ID
                            sjsConnection.get('map', map.id, function(error, doc) {
                                resolve(map);
                            });
                            this.setData(this.data);
                        } else {
                            reject();
                        }
                    },
                    error: reject,
                    dataType: 'json',
                    contentType: 'application/json'
                });
            });
        },

        getMaps: function() {
            $.ajax({
                url: '/maps',
                success: (data) => {
                    this.setData(data);
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
        docContext: null,
        nodes: null,
        edges: null,
        isOpen: false,

        init() {
            this.listenTo(Action.openMap, this.openMap);
            this.listenTo(Action.newNode, this.newNode);
            this.listenTo(Action.newEdge, this.newEdge);
            this.listenTo(Action.docChanged, this.onDocChange);
        },



        openMap(id) {
            this.doc = sjsConnection.get('map', id);
            this.doc.subscribe();
            this.doc.whenReady(() => {
                if (!this.doc.type) {
                    this.doc.create('json0', {
                        nodes: [],
                        edges: []
                    });
                }
                console.debug('this-doc', this.doc);
                this.docContext = this.doc.createContext();
                this.nodes = this.docContext.createContextAt(['nodes']);
                this.edges = this.docContext.createContextAt(['edges']);
                this.doc.on('after op', Action.docChanged);
                Action.docReady(id);

            });
        },

        closeMap() {
            this.nodes.destroy();
            this.edges.destroy();
            this.docContext.destroy();
            this.doc.unsubscribe();
        },

        onDocChange() {
            console.debug('this.doc.getSnapshot()', this.doc.getSnapshot());
            this.trigger(this.doc.getSnapshot());
            console.debug('doc changed!');
        },

        newNode(node) {
            console.debug('this.nodes', this.nodes);
            console.debug('this.nodes.push', this.nodes.push);
            this.nodes.push(node);
        },

        newEdge(edge) {
            this.doc.push('edge', edge);
        },
        updateNode(index, node) {
            this.nodes.set(index, node);
        }
    })
};

module.exports = Store;
'use strict';

// Creating a Data Store - Listening to textUpdate action
var Reflux = require('reflux');

var Store = {
    maps: Reflux.createStore({

        init: function() {
            this.listenTo(Action.createMap, this.createMap);
            this.listenTo(Action.refreshMaps, this.getMaps);
        },

        createMap: function(map) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    method: "POST",
                    url: '/maps',
                    data: map,
                    success: (response) => {
                        if (response.status == "ok") {
                            map.id = response.id;
                            console.debug(map);
                            this.data.push(map);
                            console.debug(this.data);
                            this.setData(this.data);
                            resolve(map);
                        } else {
                            reject();
                        }
                    },
                    error: reject,
                    dataType: "json"
                });
            });
        },

        getMaps: function() {
            $.ajax({
                url: '/maps',
                dataType: "json",
                success: (data) => {
                    this.setData(data);
                },
                error: () => {
                    this.setData(false);
                }
            });
        },

        setData: function(data) {
            if (data) {
                this.status = "success";
                this.data = data;
            } else {
                this.status = "fail";
            }

            this.trigger({
                status: this.status,
                data: this.data
            });
        }
    })
};

module.exports = Store;

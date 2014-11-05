/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');

var OverMap = require('./overmap/overmap.jsx');
var MapFrame = require('./graph/main.jsx');


var HomePage = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState: function() {
    return {
      view: "landing",
      view_data: {}
    };
  },

  componentDidMount: function() {
    this.listenTo(Action.openOverview, this.openOverview);
    this.listenTo(Action.openMap, this.onOpenMap);
  },

  openOverview: function() {
    this.setState({
      view: "overview"
    });
  },

  onOpenMap: function(id) {
    this.setState({
      view: "map",
      view_data: {
        id: id
      }
    });
  },

  render: function() {
    if (this.state.view == "overview")
      return (<OverMap />);

    if (this.state.view == "map")
      return (<MapFrame id={this.state.view_data.id} />);

    return (<div />);
  }
});



module.exports = () => {
  React.renderComponent(<HomePage />, document.getElementById('app'));
  Action.openOverview();
};
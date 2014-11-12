/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');

var OverMap = require('./overmap/overmap.jsx');
var Graph = require('./graph');


var HomePage = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState() {
    return {
      view: "landing",
      data: {}
    };
  },

  componentDidMount() {
    this.listenTo(Action.openOverview, this.openOverview);
    this.listenTo(Action.openMap, this.onOpenMap);
    this.listenTo(Action.authFail, this.onAuthFail);
  },

  onAuthFail() {
    document.location.href = '/';
  },

  openOverview() {
    this.setState({
      view: "overview"
    });
  },

  onOpenMap(graph) {
    this.setState({
      view: "graph",
      data: graph
    });
  },

  render() {
    if (this.state.view == "overview")
      return (<OverMap />);

    if (this.state.view == "graph")
      return (<Graph graph={this.state.data} />);

    return (<div />);
  }
});



module.exports = () => {
  React.renderComponent(<HomePage />, document.getElementById('app'));
  Action.openOverview();
};
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
    this.listenTo(Action.closeMap, this.onCloseMap);
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

  onCloseMap(graph) {
    this.setState({
      view: "overview",
    });
  },

  render() {
    var elem = '';

    if (this.state.view == "graph") {
      elem = (<Graph key="editor" graph={this.state.data} />);
    }
    if (this.state.view == "overview") {
      elem = (<OverMap key="overview" />);
    }
    return (<div>{elem}</div>);
  }
});



module.exports = () => {
  React.renderComponent(<HomePage />, document.getElementById('app'));
  Action.openOverview();
};
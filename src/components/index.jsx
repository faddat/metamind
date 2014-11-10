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
  getInitialState() {
    return {
      view: "landing",
      view_data: {}
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

  onOpenMap(id) {
    this.setState({
      view: "map",
      view_data: {
        id: id
      }
    });
  },

  render() {
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
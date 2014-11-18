/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var Reflux = require('reflux');

window.ReactRouter = require('react-router');
window.Route = ReactRouter.Route;
window.Routes = ReactRouter.Routes;
window.DefaultRoute = ReactRouter.DefaultRoute;
window.NotFoundRoute = ReactRouter.NotFoundRoute;
window.Link = ReactRouter.Link;
window.Navigation = ReactRouter.Navigation;

var OverMap = require('./overmap/overmap.jsx');
var Graph = require('./graph');
var Landing = require('./landing');


var HomePage = React.createClass({
  mixins: [Reflux.ListenerMixin],

  componentWillMount: function() {
    if (!Store.appdata.isLoggedin()) {
      Store.appdata.login();
    }
  },

  render() {
    return (<div>
      <this.props.activeRouteHandler />
    </div>);
  }
});



var routes = (

  <Routes location="history">
    <Route path="/" handler={HomePage}>
      <Route name="/app/graph/:id" handler={Graph} />
      <Route name="/app/graphs" handler={OverMap} />
      <DefaultRoute handler={Landing} />
    </Route>
  </Routes>
);

module.exports = () => {
  React.renderComponent(routes, document.getElementById('app'));
  Action.openOverview();
};
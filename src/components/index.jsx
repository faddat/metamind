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
window.ReactStyle = require('react-style');

var OverMap = require('./overmap/overmap.jsx');
var Graph = require('./graph');
var Landing = require('./landing');
var Debug = require('./component/debug-bar.jsx');
var Util = require('./util.jsx');


var HomePage = React.createClass({
  mixins: [Reflux.ListenerMixin, Navigation],

  componentWillMount: function() {

  },

  render() {
    return (<div styles={this.styles.page}>
        <this.props.activeRouteHandler />
        <Util />
        <Debug />
      </div>);
  },

  styles: {
    page: ReactStyle({
      width: '100%',
      height: '100%',
    }),
  },
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
};
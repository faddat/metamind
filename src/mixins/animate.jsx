/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var ReactTransitionEvents = require('react/lib/ReactTransitionEvents');

module.exports = {
  createTransition: function() {



    return {
      _complete: function() {},
      _apply: function() {},
      _init: function() {},
      complete: function(fn) {
        this._complete = fn;
        return this;
      },
      begin: function(fn) {
        this._apply = fn;
        return this;
      },
      init: function(fn) {
        this._init = fn;
        return this;
      },
      run: function(el) {
        var self = this;
        var endTransition = function(ev) {
          if (ev.target == el) {
            ReactTransitionEvents.removeEndEventListener(el, endTransition);
            self._complete();
          }
        };

        var applyTransition = function() {
          self._apply();
          ReactTransitionEvents.addEndEventListener(el, endTransition);
        }

        self._init();

        //Running Transition Class
        requestAnimationFrame(applyTransition);
      }
    };
  }
};
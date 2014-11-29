/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var AnimateMixin = require('../../mixins/animate.jsx');
var CSSCore = require('react/lib/CSSCore');
var CSSPropertyOperations = require('react/lib/CSSPropertyOperations');

var MorphModal = React.createClass({
    mixins: [AnimateMixin],

    getInitialState: function() {
        return { };
    },

    rectStyle: {

    },

    open: function() {
        this.setState({'state': 'before-opening'});
        requestAnimationFrame(function() {
            this.setState({'state': 'opening'});
        });
    },

    componentDidMount: function() {
        this.innerRect = this.getDOMNode().getBoundingClientRect();
        var el = this.getDOMNode();
        var self = this;
        this.openTransition = this.createTransition()
            .init(function onStart() {
                CSSPropertyOperations.setValueForStyles(el, self.rectStyle);
            }).begin(function () {
                el.className = 'morph morph-enter';
            }).complete(function () {
                el.className = 'morph morph-open';
            });

        this.closeTransition = this.createTransition();

        this.closeTransition.init(function onStart() {
            el.className = 'morph morph-leave';
        });

        this.closeTransition.begin(function () {
            CSSPropertyOperations.setValueForStyles(el, self.rectStyle);
        });

        this.closeTransition.complete(function () {
            el.className = 'morph';
        });
    },

    componentWillReceiveProps: function(nextProps) {
        if (typeof nextProps === 'undefined')
            return;
        if (typeof nextProps.rect !== 'undefined' && nextProps.rect) {

            this.rectStyle = {
                transform: "translate3d(-50%, -50%, 0) "
                            + "translate3d("+nextProps.rect.left+"px, "+nextProps.rect.top+"px, 0) "
                            + "scale("+nextProps.rect.width/this.innerRect.width+", "+nextProps.rect.height/this.innerRect.height+") "
                            + "translate3d(50%, 50%, 0)",
            };
        }

        if (nextProps.showing != this.props.showing) {
            if (nextProps.showing) {
                this.openTransition.run(this.getDOMNode());
            } else {
                this.closeTransition.run(this.getDOMNode());
            }
        }
    },

    render: function() {
        return (
            <div className="morph">
                <div className="morph-inner">
                    {this.props.children}
                </div>
            </div>
        );
    }
});


var MorphButton = React.createClass({

    getInitialState: function() {
    	return {
    		open: false,
            rect: null
    	};
    },

    toggle: function() {
        this.setState({
            rect: this.refs.morph.getDOMNode().getBoundingClientRect(),
            open: !this.state.open
        });
	},

	render: function() {

        var mainClass = 'morph-button';

        if (this.state.open) {
            mainClass += ' open';
        }

		return (
			<div ref="morph" className={mainClass}>
				<button type="button" onClick={this.props.onClick}>{this.props.text}</button>
                <MorphModal ref="morphbox" showing={this.state.open} rect={this.state.rect}>
                    {this.props.children}
                </MorphModal>
			</div>
		);
	}

});

module.exports = MorphButton;
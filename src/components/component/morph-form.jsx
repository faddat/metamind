/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react');

var ModalInput = React.createClass({
    getInputDOM: function() {
        return this.refs.input.getDOMNode();
    },
    render: function() {
        return (
            <p>
                <label>{this.props.label}</label>
                <input ref="input" autocomplete="off" type={this.props.type} id={this.props.id} style={{backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=);"}} />
            </p>
        );
    }
});

var ModalButton = React.createClass({
    getDefaultProps: function() {
        return {
            loading: false
        };
    },
    render: function() {
        var type = this.props.onClick ? "button" : "submit";

        if (this.props.loading) {
            this.props.className = "loading";
        }

        return (
            <p>
                { this.transferPropsTo(<button type={type}>{this.props.text}</button>) }
            </p>
        );
    }
});

var MorphForm = React.createClass({
    onSubmit: function(ev) {
        ev.preventDefault();

        var data = {};
        this.props.form.inputs.map(function(v) {
            data[v.id] = this.refs[v.id].getInputDOM().value;
        }.bind(this));

        this.props.onSubmit(data);
    },
    render: function() {
        var inputs = this.props.form.inputs.map(function(v) {
            return <ModalInput key={v.id} ref={v.id} label={v.label} type={v.type} id={v.id}/>
        });

        var buttons = this.props.form.buttons.map(function(v) {
            return <ModalButton key={v.id} text={v.text} id={v.id} onClick={v.onClick} loading={v.loading} />;
        });

        return (
            <div className="content-style-form">
                <span className="icon icon-close" onClick={this.props.onClose}>Close the dialog</span>
                <h2>{this.props.title}</h2>
                <form action="" ref="form" id="loginform" onSubmit={this.onSubmit}>
                    <p className="errors"></p>
                    {inputs}
                    {buttons}
                </form>
            </div>);
    }
});

module.exports = MorphForm;
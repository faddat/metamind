
var Morph = React.createClass({

    render: function() {

        return (
            <div styles={[this.styles.dialog, this.props.styles]}>
                <span styles={this.styles.close} className='icon icon-close' onClick={this.props.onClose}>Close the dialog</span>
                {this.props.children}
            </div>);
    },

    styles: {

        dialog: ReactStyle({
            position:'relative',
            textAlign: 'left',
        }),

        close: ReactStyle({
            top: 0,
            right: 0,
            color: '#ebd3bd',
            fontSize: '75%',
            ':hover': {
                color: '#6cbfee',
            },
        }),

    },
});

module.exports = Morph;
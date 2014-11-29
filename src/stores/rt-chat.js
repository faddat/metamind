var Reflux = require('reflux');

//In-Map Chat Store
var chat = Reflux.createStore({
    doc: null,
    i: 0,

    init() {

    },

    getDefaultData() {
        return {
            chats: [],
            users: {}
        };
    },

    openChannel(id) {
        this.doc = sjsConnection.get('chat', id);

        this.doc.subscribe();

        this.doc.on('after op', (op, localSite) => {
            this.docChanged();
        });

        this.doc.whenReady(() => {
            this.docChanged();
        });
    },

    closeChannel() {
        this.doc.unsubscribe();
        this.doc.destroy();
    },

    docChanged() {
        this.trigger(this.doc.snapshot);
    },


    // Build op to create a chat
    _chatOp(chat) {
        return {p:['chats', this.doc.snapshot.chats.length], li:chat};
    },


    // Sends a chat
    create(chat) {
        chat.id = sjsConnection.id + this.i++;
        this.doc.submitOp([
            this._chatOp(chat)
        ]);
    },
});

module.exports = chat;
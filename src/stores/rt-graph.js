var Reflux = require('reflux');

var graph = Reflux.createStore({
    doc: null,
    i: 0,
    tree: [],

    init() {

    },

    getDefaultData() {
        return {
            nodes: {},
            edges: [],
        }
    },

    openMap(id) {
        this.doc = sjsConnection.get('graph', id, () => {
        	console.log('cb?')
        });

        this.doc.subscribe();

        this.doc.on('after op', (op, localSite) => {
            this.docChanged();
        });

        this.doc.whenReady(() => {
            this.docChanged();
        });
    },

    closeMap() {
        this.doc.unsubscribe();
        this.doc.destroy();
    },

    docChanged() {
    	this.tree = this._groupEdges();
    	this._invertInvokeTree();
        this.trigger(this.doc.snapshot);
    },

    // Generate next unique id based on user id
    nextId() {
        return sjsConnection.id + this.i++;
    },

    // Build op to create a node
    _nodeOp(key, node) {
        return {p:['nodes', key], oi:node};
    },

    // Build op to create an edge
    _edgeOp(edge) {
        return {p:['edges', this.doc.snapshot.edges.length], li:edge};
    },

    // Build op to replace a node
    _nodeUpdateOp(id, node) {
        return {p:['nodes', id], od: this.doc.snapshot.nodes[id], oi:node};
    },

	// Build op to delete a node
    _nodeDeleteOp(id) {
        return {p:['nodes', id], od: this.doc.snapshot.nodes[id]};
    },

	// Build op to delete a edge
    _edgeDeleteOp(id) {
    	var index = -1;
    	var edge = _.find(this.doc.snapshot.edges, (v, k) => {
    		index = k;
    		return v.b == id;
    	});
    	console.log(edge);
        return {p:['edges', index], ld: edge};
    },


    // Build op to delete a edge by index
    _edgeDeleteByIndexOp(index) {
        return {p:['edges', index], ld: this.doc.snapshot.edges[index]};
    },

    // Create a new node
    // key as a unique string id, node as { text }, edge as { a, b }
    newNode(key, node, edge) {
        var op = [
            this._nodeOp(key, node),
            this._edgeOp(edge)
        ];
        this.doc.submitOp(op);
    },

    // Get node by key
    getNode(id) {
        return this.doc.snapshot.nodes[id];
    },

    // Update a node
    // id is the key, node is { text }
    updateNode(id, node) {
        var op = [
            this._nodeUpdateOp(id, node)
        ];
        this.doc.submitOp(op);
    },

    _traverseIn(id, groupedEdges, fn) {

    },

    _groupEdges() {
    	return _.groupBy(this.doc.snapshot.edges, 'a');
    },

    mapReduceTree(id, reduce, finalize) {

    	var mapped = [];

    	if (typeof this.tree[id] !== 'undefined') {
    		mapped = _.map(this.tree[id], (v) => {
    			return this.mapReduceTree(v.b, reduce, finalize);
    		});
    	}

    	var reduced = _.reduce(mapped, reduce, 0);

    	var result = finalize(id, reduced);

    	return result;
    },


    walkAncestors(id, fn, memo) {
    	return this._inversionMap[id](fn, memo);
    },

    _inversionMap: {

    },

    _invertInvokeTree() {
    	this._inversionMap = {
    		'root':  (fn, memo) => {
    			return fn('root');
    		},
    	},

    	this.walkChildren('root', (v, k) => {
    		this._inversionMap[v.b] = (fn, memo) => {
    			return this._inversionMap[v.a](fn, fn(v.b));
    		}
    	}, null);
    },

    walkChildren(id, fn) {
    	this._invokeTree(id, 'root', fn, []);
    },

    _invokeTree(id, k, fn, path) {
    	fn(id, k, this.tree[id], path);
    	path.push(id);

		_.map(this.tree[id], (v, k) => {
	    	this._invokeTree(v.b, k, fn, path.slice(0));
    	});
    },

    // Delete node
    deleteNode(id) {
    	if (id == 'root')
    		return;

        var ops = [];

        var edgeIndices = {};

        _.each(this.doc.snapshot.edges, (v, k) => {
        	edgeIndices[v.b] = k;
        });



		this.walkChildren(id, (id, k, children, path) => {
			ops.push(this._nodeDeleteOp(id));
			ops.push(this._edgeDeleteByIndexOp(edgeIndices[id]));
		});

		ops = ops.reverse();

        this.doc.submitOp(ops);

    },
});

module.exports = graph;

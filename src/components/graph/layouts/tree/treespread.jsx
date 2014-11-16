
module.exports = {
	run(graphData) {

		var renderData = {
			nodes: [],
			edges: []
		};

		if (_.size(graphData.nodes) == 0)
			return renderData;

		//Set up Root Node (no parent)
		renderData.nodes.push({
			id: 'root',
			index: 0,
			x: 0,
			y: 0,
			parent_w: 0,
			parent_t: 0,
			weight: 0,
			text: graphData.nodes['root'].text,
			style: graphData.nodes['root'].style,
		});

		var nodeIndexById = {
			root: 0
		};

		//Create render edge array for every node

		var nodeLen = _.size(graphData.nodes);

		for (var i = 0; i < nodeLen; i++) {
			renderData.edges.push([]);
		}

		var edgeLen = graphData.edges.length;
		var currentEdge;

		for (var i = 0; i < edgeLen; i++) {
			currentEdge = graphData.edges[i];
			nodeIndex = nodeIndexById[currentEdge.a];

			//Create
			nodeIndexById[currentEdge.b] = i+1;
			renderData.edges[nodeIndex].push({
				next: i + 1,
				totalweight: 0
			});

			//Create Render Node Skeleton
			renderData.nodes.push(_.extend(graphData.nodes[graphData.edges[i].b], {
				id: currentEdge.b,
				index: i + 1,
				parent_w: 0,
				parent_t: 0,
				weight: 0,
				prev: nodeIndex,
				prevIndex: renderData.edges[nodeIndex].length - 1
			}));
		};

		for (var i = renderData.nodes.length - 1; i > 0; i--) {
			var prev = renderData.nodes[i].prev;
			var prevIndex = renderData.nodes[i].prevIndex;

			renderData.nodes[prev].weight += 1 + renderData.nodes[i].weight;
			renderData.edges[prev][prevIndex].totalweight += 1 + renderData.nodes[i].weight;


		};

		this.recalcNodes(renderData.nodes, renderData.edges);

		return renderData;
	},



	swapedges: function(origin, a, b, nodes, edges) {
		var temp = edges[origin][a];
		edges[origin][a] = edges[origin][b];
		edges[origin][b] = temp;
		nodes[edges[origin][a].next].prevIndex = b;
		nodes[edges[origin][b].next].prevIndex = a;
	},

	scatterEdges: function(edges, inweight) {
		edges.sort(function(a, b) {
			return b.totalweight - a.totalweight;
		});
		function divideSort(linksArray) {
			var len = linksArray.length;

			if (len < 2) {
				return linksArray;
			}

			var atotal = 0;
			var btotal = 0;
			var a = [];
			var b = [];

			for (var i = 0; i < len; i++) {
				if (atotal < btotal) {
					atotal += linksArray[i].totalweight;
					a.push(linksArray[i]);
				} else {
					btotal += linksArray[i].totalweight;
					b.push(linksArray[i]);
				}
			};

			a = divideSort(a);
			b = divideSort(b);

			return a.concat(b);

			// for (var i = 0; i < b; i++) {
			// 	if (linksArray[i].totalweight > average) {
			// 		balance += linksArray[i].totalweight;
			// 		partA.push(linksArray[i]);
			// 	} else if (linksArray[i].totalweight < average) {
			// 		balance -= linksArray[i].totalweight;
			// 		partB.push(linksArray[i]);
			// 	} else if (i % 2 == 1) {
			// 		balance += linksArray[i].totalweight;
			// 		partA.push(linksArray[i]);
			// 	} else {
			// 		balance -= linksArray[i].totalweight;
			// 		partB.push(linksArray[i]);
			// 	}
			// };

			// if (balance < 0)
			// 	return divideSort(partA, -balance).concat(divideSort(partB, balance));
		}


		var res = [];

		res = divideSort(edges, inweight);

		// edges[prev] = this.scatterEdges(edges[prev], nodes[prev].parent_w - edges[prev][prevIndex].totalweight);

		// //Backlink
		// for (var j = edges[prev].length - 1; j >= 0; j--) {
		// 	nodes[edges[prev][j].next].prevIndex = j;
		// };

		return res;
	},

	recalcNodes: function(nodes, edges)
	{
		var r, t, tw, r2, w, smallCount, push, bigEdges, smallEdges;
		var distance = 45;

		for (var i = 0; i < edges.length; i++) {
			bigEdges = edges[i].filter(function(v) { return true; });//v.totalweight > 1;});
			smallEdges = [];//edges[i].filter(function(v) { return v.totalweight == 1;});
			var smlen = smallEdges.length;

			if (bigEdges.length > 0) {
				tw = nodes[i].weight - smlen;
				push = 0;
				if (i != 0) {
					push = (nodes[i].parent_w - nodes[i].weight) / 4;
					tw += push;
				}

				t = nodes[i].parent_t - 0.5 + (push / 2) / tw;

				for (var j = 0; j < bigEdges.length; j++) {
					r = (bigEdges[j].totalweight / tw) / 2;
					t += r;
					var dist = distance + distance * Math.pow(bigEdges[j].totalweight, 0.5);
					if (nodes[bigEdges[j].next].style == 'light') {
						nodes[bigEdges[j].next].x = Math.cos(t * 2 * Math.PI) * (dist/2*3) + nodes[i].x;
						nodes[bigEdges[j].next].y = Math.sin(t * 2 * Math.PI) * (dist/2*3) + nodes[i].y;
						nodes[bigEdges[j].next].parent_t = t;
						nodes[bigEdges[j].next].parent_w = nodes[i].weight - smlen;
					} else {
						nodes[bigEdges[j].next].x = Math.cos(t * 2 * Math.PI) * (dist) + nodes[i].x;
						nodes[bigEdges[j].next].y = Math.sin(t * 2 * Math.PI) * (dist) + nodes[i].y;
						nodes[bigEdges[j].next].parent_t = t;
						nodes[bigEdges[j].next].parent_w = nodes[i].weight - smlen;
					}
					t += r;

				};
			}

			t = nodes[i].parent_t + 0.5;
			for (var j = smlen - 1; j >= 0; j--) {
				w = smallEdges[j].totalweight;
				r = 1 / smlen;
				var dist = distance*3;
				nodes[smallEdges[j].next].x = Math.cos((t + r/2) * 2 * Math.PI) * (dist) + nodes[i].x;
				nodes[smallEdges[j].next].y = Math.sin((t + r/2) * 2 * Math.PI) * (dist) + nodes[i].y;
				t += r;
			};
		};
	},

};
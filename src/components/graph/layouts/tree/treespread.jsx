
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
			direction: 0,
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
				direction: 0,
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

		_.each(renderData.nodes, (v, k) => {
			v.style = v.weight == 0 ? 'soft' : 'hard';
		});

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
		var arc, angle;

		var baseDistance = 120;

		//iterate the tree edges from root to leaves and perform render calculations
		_.each(edges, (branches, branchKey) => {
			if (branches.length == 0)
				return true;

			var baseNode = nodes[branchKey];
			var weightSum = baseNode.weight;

			//narrow branch spread based on weight difference
			var push = 0;

			if (baseNode.parent_w > 0) {
				push = (baseNode.parent_w - baseNode.weight) / 3;
				weightSum += push;
			}

			angle = baseNode.direction - 0.5 + (push / 2) / weightSum;

			var offsetX = baseNode.x;
			var offsetY = baseNode.y;

			//sub-edges
			_.each(branches, (edge, key) => {
				//sub-node
				var childNode = nodes[edge.next];
				var dist = baseDistance;

				arc = (edge.totalweight / weightSum) / 2;
				angle += arc;

				if (childNode.style == 'soft') {
					console.log(childNode);
					childNode.x = Math.cos(angle * 2 * Math.PI) * (dist) + offsetX;
					childNode.y = Math.sin(angle * 2 * Math.PI) * (dist) + offsetY;
					childNode.direction = angle;
					childNode.parent_w = nodes[key].weight;
				} else {
					dist += baseDistance * Math.log(edge.totalweight) / 10;
					childNode.x = Math.cos(angle * 2 * Math.PI) * (dist) + offsetX;
					childNode.y = Math.sin(angle * 2 * Math.PI) * (dist) + offsetY;
					childNode.direction = angle;
					childNode.parent_w = baseNode.weight;
				}
				angle += arc;
			});
		});
	},

};
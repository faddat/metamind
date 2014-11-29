
module.exports = {



		// nodeIndex = nodeIndexById[v.a];

		// 	//Create Edge from Parent



	run(graphData) {

		if (_.size(graphData.nodes) == 0)
			return [];

		var nodes = _.extend({}, graphData.nodes);

		//Populate Weights = number of decendants
		rt.graph.mapReduceTree('root',
			function reducer(sum, recursed) {
				return sum += recursed;
			},
			function finalizer(id, reduced) {
				nodes[id].totalDescendants = reduced;
				return reduced + 1;
			}
		);

		_.each(nodes, (v, k) => {
			v.style = v.totalDescendants == 0 ? 'soft' : 'hard';
		});



		// rt.graph.walkChildren('root', (id, k, children, path) => {
		// 	console.log(path);
		// 	console.log(children);
		// }, ['root']);

		// return [];

		//
		// calculate x y of each node
		// start at 0,0
		//
		//

		nodes['root'].x = 0;
		nodes['root'].y = 0;
		nodes['root'].parentAngle = 0;
		nodes['root'].parentPush = 0;

		var baseDistance = 120;
		//iterate the tree edges from root to leaves and perform render calculations
		rt.graph.walkChildren('root', (id, k, children, path) => {
			var halfarc, angle = 0;
			var node = nodes[id];

			var weightSum = node.totalDescendants;

			weightSum += node.parentPush;

			var parentHalfArc = node.parentPush / (weightSum * 2);

			angle = node.parentAngle + parentHalfArc;// + (push / 2) / weightSum;

			var offsetX = node.x;
			var offsetY = node.y;

			_.each(children, (child) => {
				var dist = baseDistance;

				var childNode = nodes[child.b];

				halfarc = ((childNode.totalDescendants + 1) / weightSum) / 2;
				angle += halfarc;

				if (childNode.style == 'soft') {

				} else {
					dist += baseDistance * Math.log(node.totalDescendants) / 10;
				}

				childNode.parentAngle = angle - 0.5;
				childNode.parentPush = (node.totalDescendants - childNode.totalDescendants + 1) / 3;
				childNode.x = Math.cos(angle * 2 * Math.PI) * (dist) + offsetX;
				childNode.y = Math.sin(angle * 2 * Math.PI) * (dist) + offsetY;

				angle += halfarc;
			});
		});

		return nodes;
	},

};
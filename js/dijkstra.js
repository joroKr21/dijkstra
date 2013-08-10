onmessage = function(e){
    var data = JSON.parse(e.data);
    
    if (data.status.toUpperCase() == 'START') {
        var startNode = data.startNode;
        var graph = data.graph;
        
        graph = graph.map(function(arr){
            return arr.map(function(node) {
                return typeof node != 'number' ? Infinity : node;
            });
        });
	
        var result = dijkstra(graph, startNode);
        
        if (result) postMessage(JSON.stringify({status: 'SUCCESS', result: result}));
        else postMessage(JSON.stringify({status: 'INVALID'}));
    }
};

function dijkstra(edges, startVertex) {
    if (!validateGraph(edges)) return false;  
    var numVertices = edges.length;
    edges[-1] = (new Array(numVertices)).map(function() {return Infinity;});
    var done = new Array(numVertices);
    done[startVertex] = true;
    var pathLengths = new Array(numVertices);
    var predecessors = new Array(numVertices);
    
    for (var i = 0; i < numVertices; i++) {
        pathLengths[i] = edges[startVertex][i];
        if (edges[startVertex][i] != Infinity) predecessors[i] = startVertex;
    }
    
    pathLengths[startVertex] = 0;
    
    for (var i = 0; i < numVertices - 1; i++) {
        var closest = -1;
        var closestDistance = Infinity;
        
        for (var j = 0; j < numVertices; j++) {
            if (!done[j] && pathLengths[j] < closestDistance) {
                closestDistance = pathLengths[j];
                closest = j;
            }
        }
        
        done[closest] = true;
        
        for (var j = 0; j < numVertices; j++) {
            if (!done[j]) {
                var possiblyCloserDistance = pathLengths[closest] + edges[closest][j];
                
                if (possiblyCloserDistance < pathLengths[j]) {
                    pathLengths[j] = possiblyCloserDistance;
                    predecessors[j] = closest;
                }
            }
        }
    }
    
    return {
        "startVertex": startVertex,
        "pathLengths": pathLengths,
        "predecessors": predecessors
    };
}

function validateGraph(g) {
    if (!(g instanceof Array)) return false;
    var numNodes = g.length;
    
    for (var i = 0; i < numNodes; i++) {
        if (!(g[i] instanceof Array)) return false;
        else if (g[i].length != numNodes) return false;
    }
    
    return true;
}

// Example adjacency matrix
/*
// The adjacency matrix defining the graph g.
var _ = Infinity;
var g = [
  [ _, _, _, _, _, _, _, _, 4, 2, 3 ],
  [ _, _, 5, 2, 2, _, _, _, _, _, _ ],
  [ _, 5, _, _, _, 1, 4, _, _, _, _ ],
  [ _, 2, _, _, 3, 6, _, 3, _, _, _ ],
  [ _, 2, _, 3, _, _, _, 4, 3, _, _ ],
  [ _, _, 1, 6, _, _, 2, 5, _, _, _ ],
  [ _, _, 4, _, _, 2, _, 5, _, _, 3 ],
  [ _, _, _, 3, 4, 5, 5, _, 3, 2, 4 ],
  [ 4, _, _, _, 3, _, _, 3, _, 3, _ ],
  [ 2, _, _, _, _, _, _, 2, 3, _, 3 ],
  [ 3, _, _, _, _, _, 3, 4, _, 3, _ ]
];
*/
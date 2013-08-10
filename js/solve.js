$(document).ready(function(){
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var reader = new FileReader();   
        reader.onload = function(e) {$('#graph').val(e.target.result);};                  
        reader.onerror = function() {$('#graph').attr('placeholder', 'Something went wrong.');};
                
        $('#file').change(function(e) {
            var file = e.target.files[0];
            if (!file) $('#graph').attr('placeholder', 'Failed to load file.');
            else reader.readAsText(file);
        });
    } else $('#file').attr('disabled', 'disabled');
        
    $('#dijkstra').submit(function(evt) {
        evt.preventDefault();
        var text = $('#graph').val();
        var graph = JSON.parse(text.replace(/{/g, '[').replace(/}/g, ']'));
        var startNode = parseInt($('#node').val()) - 1;
        var worker = new Worker('js/dijkstra.js');
					
        if (startNode >= graph.length) {
            alert('Please choose a node from 1 to ' + graph.length);
            return;
        }        
        
        for (var i = 0; i < graph.length; i++)
            for (var j = 0; j < graph[i].length; j++) {
                if (i != j && graph[i][j] == 0) graph[i][j] = 'i';
            }
        
        worker.onmessage = function(e) {
            var data = JSON.parse(e.data);
            
            if (data.status.toUpperCase() == 'SUCCESS') {
                var shortestPaths = data.result;
                $('#result').html('');
                
                for (var i = 0; i < graph.length; i++) {
                    var pathl = shortestPaths.pathLengths[i];
                    var pred = shortestPaths.predecessors[i];
                    pathl = typeof pathl != 'number' ? 'infinity' : pathl;
                    pred = typeof pred != 'number' ? 'undefined' : pred + 1;
						
                    $('#result').append('Shortest path to node ' + (i + 1) 
                        + ' has length ' + pathl
                        + ' (predecessor node is: ' + pred + ')<br/>');
                }
                
                $('#go').removeAttr('disabled');
            } else if (data.status.toUpperCase() == 'INVALID') {
                $('#result').html('Invalid graph.');
            }
        };
        
        $('#result').html('Computing...');
        $('#go').attr('disabled', 'disabled');
        worker.postMessage(JSON.stringify({
            status: 'START', 
            startNode: startNode, 
            graph: graph
        }));
    });
    
    $('#generate').submit(function(e) {
        e.preventDefault();
        var size = $('#size').val();
        var min = $('#min').val();
        var max = $('#max').val();
        var dens = $('#dens').val();
        
        if (max < min) {alert('Max must be >= Min'); return;}
        else $('#graph').attr('placeholder', 'Generating...');
        $('#graph').load('generator.php?size=' + size + '&min=' + min
            + '&max=' + max + '&dens=' + dens);
    });
});
$(function() {

    var to_id = function(str) {
        return str.replace(/\s+/g, '-').replace(/\W/g, '').toLowerCase();
    };


    var ready = function(error, partidos) {

        var feature = topojson.feature(partidos, partidos.objects.partidos);
        var width = 800, height = 800;
        var svg = d3.select("#wrapper").append("svg")
            .attr("width", width)
            .attr("height", height);
        var projection = d3.geo.mercator()
            .scale(3000)
            .center(d3.geo.centroid(feature))
            .translate([width/2 , height/2]);
        var path = d3.geo.path().projection(projection);
        var partidos_g = svg.append('g')
            .attr("class", "partidos");

        console.log(d3.geo.centroid(feature));

        partidos_g
            .selectAll("path")
            .data(feature.features)
            .enter().append("path")
            .attr('id', function(d) { return to_id(d.properties.PARTIDO); })
            .attr("d", path);

        var b = path.bounds(feature);

        partidos_g.attr('transform',
                        'translate(' + projection.translate() + ')'
                        + 'scale(' + 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height) + ')'
                        + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");

        $('#sitios li').each(function(s) {
            $('path#' + $(this).data('partido')).attr('class','tiene-gastopublico');
        });

        $('.partidos').on('mouseover', 'path', function() {
            console.log(this);
        });
    };




     queue()
     .defer(d3.json, 'partidos.json')
     .await(ready);

});

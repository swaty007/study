var $ = require( 'jquery' );
require( 'jszip' );
require( 'pdfmake' );
require( 'datatables.net' );
require( 'datatables.net-bs' );
require( 'datatables.net-buttons-bs' );
require( 'datatables.net-buttons/js/buttons.colVis.js' );
require( 'datatables.net-buttons/js/buttons.flash.js' );
require( 'datatables.net-buttons/js/buttons.html5.js' );
require( 'datatables.net-buttons/js/buttons.print.js' );
require( 'datatables.net-fixedheader-bs' );
require( 'datatables.net-responsive-bs' );
require('bootstrap/dist/js/bootstrap.bundle.min.js');

var io = require('socket.io-client/dist/socket.io.js');
var ConsoleLogHTML = require('console-log-html');

$(document).ready(function() {
    ConsoleLogHTML.connect(document.getElementById("myULContainer"));

    var socket = io.connect(location.hostname+':3038/', {
            // 'reconnectionDelay': 10 // defaults to 500
    });
    socket.on('getGoogle', (data) => {
        console.log(data);
        sortDomains(Object.assign({}, data.sites));
        queriesThree([...data.queries]);
        googleTable(Object.assign({}, data.sites));

        let sites = $("#form_google [name='sites']");
        sites.val('');

        // console.log(result,'result get Google Front');
        // $.get(result.data.url, function(res) {
        //     socket.emit('getGoogle', {res: res, data: result.data, cb: result.cb});
        // });
    });
    socket.on('console', (result) => {
        if (typeof result === 'string') {
            console.log(decodeURI(result),' NodeJs');
        } else {
            console.log(JSON.stringify(result),' NodeJs');
        }
    });
    $("#form_google").on('submit', function (e) {
        e.preventDefault();
        let sites = $("#form_google [name='sites']"),
            size = $("#form_google select[name='size']");

        socket.emit('getGoogle', {sites: sites.val(), size: size.val()} );
        // $.ajax({
        //     type: "POST",
        //     url: "/calc" ,
        //     data: {
        //         sites: sites.val(),
        //         size: size.val()
        //     },
        //     success: function (data) {
        //         // console.log(data,"data")
        //         queriesThree(data.queries);
        //         googleTable(data.sites);
        //     }
        // });
    })

    function sortDomains(data) {
        console.log(data,'copy');
        let sortDomainsArray = Object.entries(data).sort((a, b) => {
            // console.log('A = ', a, '  B =',b);
            // console.log('A.l = ', a[1].length, '  B.l =',b[1].length);
            return b[1].length - a[1].length;
        });
        console.log(sortDomainsArray,'sortDomainsArray');
        let sortDomains = Object.fromEntries(sortDomainsArray);
        console.log(sortDomains,'sortDomains ');
        console.log(data,'data ');
        let n = 0;
        for (domain in sortDomains) {
            // console.log(variable,sortDomains[variable].length,"sortDomains.var.length");
            $("#accordionDomain").append(`
<div class="card-header" id="heading${n}">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${n}" aria-expanded="true" aria-controls="collapse${n}">
          ${domain} Запросов: ${sortDomains[domain].length} 
          Запросов Топ3: <span id="top3_${n}">0</span> 
          Запросов Топ5: <span id="top5_${n}">0</span>
          Запросов Топ10: <span id="top10_${n}">0</span>
        </button>
    </div>
    <div id="collapse${n}" class="collapse" aria-labelledby="heading${n}" data-parent="#accordionDomain" style="">
      <div class="card-body" >
        <table class="table table-striped table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>query</th>
                                        <th>titleGoogle</th>
                                        <th>href</th>
<!--                                        <th>meta</th>-->
                                    </tr>
                                    </thead>
                                    <tbody id="domain${n}">
                                    </tbody>
                                </table>
</div>
    </div>
            `);
            let top3 = 0,
                top5 = 0,
                top10 = 0;
            sortDomains[domain].forEach((item) => {
                switch (item.position) {
                    case (<10 && >=5):
                        top10 += 1;
                        break;
                    case (<5 && >=3):
                        top5 += 1;
                        break;
                    case (<3 && >=0):
                        top3 += 1;
                        break;
                }
                $("#domain"+n).append(`<tr>
<td>${item.position}</td>
<td>${item.query}</td>
<td>${item.title}</td>
<td>${item.href}</td>
<!--<td>${item.meta}</td>-->
</tr>`);
            });
            $("#top3_"+n).text(top3);
            $("#top5_"+n).text(top5);
            $("#top10_"+n).text(top10);
            n++;
        }
    }
    function googleTable (data) {
        var DTdata = [];

        $.each( data,  (i, domain) => {
            domain.forEach( site => {
                if (site["meta"] === undefined) {
                    site["meta"] = {title: ""};
                }
                DTdata.push(site);
            })
        });

        $('#table_id').DataTable( {
            lengthMenu: [[10, 100, 300, -1], [10, 100, 300, "All"]],
            dom: 'Bfrtip',
            data: DTdata,
            // processing: true,
            // lengthChange: true,
            // serverSide: true,
            // ordering: true,
            columns: [
                { "data": "domain" },
                { "data": "position" },
                { "data": "query" },
                { "data": "title" },
                { "data": "href" },
                { "data": "meta"}
            ],
            "columnDefs": [{
                "targets": 5,
                "data": "meta",
                "render": function ( data1, type, row, meta ) {
                    let html = "";
                    for (let key in data1) {
                        html+=`<p><strong>${key}</strong><span>${data1[key]}</span></p>`;
                    }
                    return html;
                }
            }],
            buttons: [
                'copy', 'csv', 'excel', 'pageLength'// 'pdf', 'print'
            ]
        });
        $("#table_id_wrapper").removeClass("form-inline");
    }
    function queriesThree(data) {
        let treeData = [{
            "name": "1st Level",
            "parent": "null",
            "children": [

            ]
        }];
        // console.log(treeData,"treeData")
        // console.log(data,"data");
        // data.map((value, index) => {
        //     value.parent = "Top Level";
        //     treeData[0].children.push(value);
        // });
        // throw new Error();
        treeData[0].children = data;

        // ************** Generate the tree diagram	 *****************
        var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 960 - margin.right - margin.left,
            height = (500 * data.length) - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select("queries_three").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        root = treeData[0];
        root.x0 = height / 2;
        root.y0 = 0;

        update(root);

        d3.select(self.frameElement).style("height", "500px");

        function update(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on("click", click);

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeEnter.append("text")
                .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

            nodeUpdate.select("circle")
                .attr("r", 10)
                .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

// Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }
});

<template>
    <section id="queries_wrap" class="queries_wrap">
        <table id="table_queries" class="table table-striped table-bordered">
            <thead>
            <tr>
                <th>Name</th>
                <th>Count</th>
                <th>Parent</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
            <tfoot>
            <tr>
                <th>Name</th>
                <th>Count</th>
                <th>Parent</th>
            </tr>
            </tfoot>
        </table>
        <div id="queries_three" class="queries_three"></div>
    </section>
</template>

<script>

    export default {
        props: ['queries'],
        components: {  },
        data() {
            return {
                watch1: null,
                watch2: null,
                watch3: null,
                watch4: null,
            }
        },
        methods: {
            onFilterDomain() {
                // this.$emit("onSubmit", {
                //     sites: this.sites,
                //     size: this.size,
                // });
            }
        },
        computed: {

            queriesNew: function () {
                console.log('computed');
                return this.queries;
            }
        },
        watch: {
            queries: function(val) {
                console.log('watchIn1');
                this.watch1 = this.queries;
            },
            watch1: function(val) {
                console.log('watchIn2');
                this.watch3 = this.queries;
            }
        },
        mounted: function() {
            queriesTable(this.queries);
            queriesThree(this.queries);
            function queriesTable(dataArr) {
                // let data = [].concat(dataArr);
                let data = JSON.parse(JSON.stringify(dataArr));
                let DTdata = [];

                data.forEach(site => {
                    loop(site);
                });
                function loop (query) {
                    if (query["children"] !== undefined && query["children"].length > 0) {
                        query["children"].forEach(site => {
                            loop(site);
                        });
                    }
                    let find_element = DTdata.find((el, index, array) => {
                        if (el.name == query.name) {
                            el.count++;
                            el.parent.push(query.parent);
                            return true;
                        }
                        return false;
                    });

                    if (find_element === undefined) {
                        DTdata.push({
                            name: query.name,
                            parent: [query.parent],
                            href: query.href,
                            count: 1,
                        });
                    }
                }

                $('#table_queries').DataTable({
                    lengthMenu: [[10, 100, 300, -1], [10, 100, 300, "All"]],
                    dom: 'Bfrtip',
                    data: DTdata,
                    // processing: true,
                    // lengthChange: true,
                    // serverSide: true,
                    // ordering: true,
                    columns: [
                        {"data": "name"},
                        {"data": "count"},
                        {"data": "parent"},
                    ],

                    "columnDefs": [{
                        "targets": 2,
                        "data": "parent",
                        "render": function (data1, type, row, meta) {
                            let html = "";
                            data1.forEach(parent => {
                                html += `<p><span>${parent}</span></p>`;
                            });
                            return html;
                        }
                    }],
                    buttons: [
                        'copy', 'csv', 'excel', 'pageLength'// 'pdf', 'print'
                    ]
                });
                $("#table_queries_wrapper").removeClass("form-inline");
            }
            function queriesThree(dataArr) {
                // let data = [].concat(dataArr);
                let data = JSON.parse(JSON.stringify(dataArr));
                let treeData = [{
                    "name": "1st Level",
                    "parent": "null",
                    "children": []
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
                    .projection(function (d) {
                        return [d.y, d.x];
                    });

                var svg = d3.select("#queries_three").append("svg")
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
                    nodes.forEach(function (d) {
                        d.y = d.depth * 180;
                    });

                    // Update the nodes…
                    var node = svg.selectAll("g.node")
                        .data(nodes, function (d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function (d) {
                            return "translate(" + source.y0 + "," + source.x0 + ")";
                        })
                        .on("click", click);

                    nodeEnter.append("circle")
                        .attr("r", 1e-6)
                        .style("fill", function (d) {
                            return d._children ? "lightsteelblue" : "#fff";
                        });

                    nodeEnter.append("text")
                        .attr("x", function (d) {
                            return d.children || d._children ? -13 : 13;
                        })
                        .attr("dy", ".35em")
                        .attr("text-anchor", function (d) {
                            return d.children || d._children ? "end" : "start";
                        })
                        .text(function (d) {
                            return d.name;
                        })
                        .style("fill-opacity", 1e-6);

                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        });

                    nodeUpdate.select("circle")
                        .attr("r", 10)
                        .style("fill", function (d) {
                            return d._children ? "lightsteelblue" : "#fff";
                        });

                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function (d) {
                            return "translate(" + source.y + "," + source.x + ")";
                        })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 1e-6);

                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);

                    // Update the links…
                    var link = svg.selectAll("path.link")
                        .data(links, function (d) {
                            return d.target.id;
                        });

                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function (d) {
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
                        .attr("d", function (d) {
                            var o = {x: source.x, y: source.y};
                            return diagonal({source: o, target: o});
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function (d) {
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
        },
        updated: function() {
            console.log('updated')
        }
    }
</script>

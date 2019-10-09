class App {
    constructor() {
        this.events();
    }


    events() {

        Vue.config.devtools = true;

        Vue.component('vue-form-google', require('./components/Vue_form_google.vue').default);
        Vue.component('vue-domains', require('./components/Vue_domains.vue').default);
        Vue.component('vue-google-table', require('./components/Vue_google_table.vue').default);


        const root = require('./components/App.vue').default;
        const app = new Vue({
            el: '#app',
            render: createElement => createElement(root),
            components: {
                root,
            },
        });










        $(document).ready(function () {





            function sortDomains(data, domains) {

                let n = 0;
                for (domain in data) {

                    let top3 = 0,
                        top5 = 0,
                        top10 = 0;
                    data[domain].forEach(function (item) {
                        switch (true) {
                            case (item.position < 10 && item.position >= 5):
                                top10 += 1;
                                break;
                            case (item.position < 5 && item.position >= 3):
                                top10 += 1;
                                top5 += 1;
                                break;
                            case (item.position < 3 && item.position >= 0):
                                top10 += 1;
                                top5 += 1;
                                top3 += 1;
                                break;
                        }

                    });
                    $("#heading" + n).attr('data-top3', top3);
                    $("#heading" + n).attr('data-top5', top5);
                    $("#heading" + n).attr('data-top10', top10);
                    $("#top3_" + n).text(top3);
                    $("#top5_" + n).text(top5);
                    $("#top10_" + n).text(top10);
                    n++;
                };
                filterDomain();
            }

            function filterDomain() {
                let data_sort = 'top';
                let sortDirection = -1;

                switch ($("input[name='topSortRadio']:checked").val()) {
                    case "DESC":
                        sortDirection = -1;
                        break;
                    case "ASC":
                        sortDirection = 1;
                        break;
                }
                switch (Number($("input[name='topDomainRadio']:checked").val())) {
                    case 10:
                        data_sort = 'top10';
                        break;
                    case 5:
                        data_sort = 'top5';
                        break;
                    case 3:
                        data_sort = 'top3';
                        break;
                    default:
                        data_sort = 'top';
                        break;
                }
                $("#accordionDomain .card").sort(function (a, b) {
                    return (a.dataset[data_sort] - b.dataset[data_sort]) * sortDirection;
                }).appendTo("#accordionDomain");
            }

            $(document).on('change', "input[name='topDomainRadio'], input[name='topSortRadio']", filterDomain);

            function googleTable(data) {
                var DTdata = [];

                $.each(data, (i, domain) => {
                    domain.forEach(site => {
                        if (site["meta"] === undefined) {
                            site["meta"] = {title: ""};
                        }
                        site.position++;
                        DTdata.push(site);
                    })
                });

                $('#table_all').DataTable({
                    lengthMenu: [[10, 100, 300, -1], [10, 100, 300, "All"]],
                    dom: 'Bfrtip',
                    data: DTdata,
                    // processing: true,
                    // lengthChange: true,
                    // serverSide: true,
                    // ordering: true,
                    columns: [
                        {"data": "domain"},
                        {"data": "position"},
                        {"data": "query"},
                        {"data": "title"},
                        {"data": "href"},
                        {"data": "meta"}
                    ],
                    "columnDefs": [{
                        "targets": 5,
                        "data": "meta",
                        "render": function (data1, type, row, meta) {
                            let html = "";
                            for (let key in data1) {
                                html += `<p><strong>${key}</strong><span>${data1[key]}</span></p>`;
                            }
                            return html;
                        }
                    }],
                    buttons: [
                        'copy', 'csv', 'excel', 'pageLength'// 'pdf', 'print'
                    ]
                });
                $("#table_all_wrapper").removeClass("form-inline");
            }


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
        });









    }
    // Functions

}

export default App;

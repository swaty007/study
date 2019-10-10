<template>
        <table id="table_all" class="table table-striped table-bordered">
                <thead>
                <tr>
                        <th>Domain</th>
                        <th>Position</th>
                        <th>query</th>
                        <th>titleGoogle</th>
                        <th>href</th>
                        <th>meta</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
                <tfoot>
                <tr>
                        <th>Domain</th>
                        <th>Position</th>
                        <th>query</th>
                        <th>titleGoogle</th>
                        <th>href</th>
                        <th>meta</th>
                </tr>
                </tfoot>
        </table>
</template>

<script>

    export default {
        props: ['sites'],
        components: {  },
        data() {
            return {

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
            dataArr: function () {
                var DTdata = [];

                $.each(this.sites, (i, domain) => {
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
                    return DTdata;
            }
        },
        watch: {

        },
        mounted() {

        }
    }
</script>

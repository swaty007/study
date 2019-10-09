<template>
    <div :is="this.sites">
        <vdtnet-table
                ref="table"
                :fields="fields"
                :opts="options"
                :select-checkbox="1"
                :details="details"
        >
        </vdtnet-table>
    </div>

</template>

<script>

    import VdtnetTable from 'vue-datatables-net'
    import('jszip');
    import('pdfmake');
    import('datatables.net');
    import('datatables.net-bs');
    import('datatables.net-buttons-bs');
    import('datatables.net-fixedheader-bs');
    import('datatables.net-responsive-bs');
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    export default {
        props: ['sites'],
        components: { VdtnetTable },
        data() {
            return {
                options: {
                    data: this.dataArr,
                    buttons: ['copy', 'csv', 'print'],
                    /*eslint-disable */
                    dom: "Btr<'row vdtnet-footer'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'pl>>",
                    /*eslint-enable */
                    responsive: false,
                    processing: true,
                    searching: true,
                    searchDelay: 1500,
                    destroy: true,
                    ordering: true,
                    lengthChange: true,
                    serverSide: true,
                    fixedHeader: true,
                    saveState: true
                },
                fields: {
                    Domain: { label: 'Domain', sortable: true, data: 'domain'},
                    Position: { label: 'Position', sortable: true, searchable: true, defaultOrder: 'desc', data: 'position' },
                    query: { label: 'query', sortable: false, searchable: true, data: 'query'  },
                    titleGoogle: { label: 'titleGoogle', data: 'title' },
                    href: {
                        label: 'href',
                        data: 'href'
                    },
                    meta: {
                        label: 'meta',
                        data: 'meta',
                        template: '<p><strong>data</strong><span>data</span></p>'
                    },
                },
                quickSearch: '',
                details: {}
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
                this.$refs.table.reload();
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
                return DTdata;
            }
        },
        mounted() {

        }
    }
</script>

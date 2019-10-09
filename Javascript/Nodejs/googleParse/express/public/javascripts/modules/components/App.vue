<template>
    <section id="app" class="app">
        <ul id="myULContainer" class="console__block">

        </ul>

        <h1>{{ Title }}</h1>
        <p>Welcome to {{ Title }}</p>


        <vue-form-google
                @onSubmit="onSubmitForm"></vue-form-google>

        <br>


        <div class="row">
            <div class="col-lg-12">
                <div class="panel blank-panel">
                    <div class="panel-heading">
                        <div class="panel-options">
                            <ul class="nav nav-tabs nav-pills nav-fill">
                                <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#tab-1">Все
                                    запросы</a></li>
                                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#tab-2">Domains</a></li>
                                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#tab-3">Queries Tree</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <br>
                    <div class="panel-body">

                        <div class="tab-content">
                            <div id="tab-1" class="tab-pane fade active show">
                                <vue-google-table :sites="data.sites"></vue-google-table>
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
                            </div>

                            <div id="tab-2" class="tab-pane fade">
                                <vue-domains :sites="data.sites" :domains="data.domains"></vue-domains>
                            </div>

                            <div id="tab-3" class="tab-pane fade">
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
                                <queries_three id="queries_three" class="queries_three">

                                </queries_three>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    </section>
</template>

<script>
    const io = require('socket.io-client/dist/socket.io.js');
    const ConsoleLogHTML = require('console-log-html');

    export default {
        props: ['Title'],
        data() {
            return {
                data: {
                    sites: null,
                    domains: null
                },
                pagination: {
                    'current_page': 1
                },
                stage: 1,
                socket: null
            };
        },
        methods: {
            onSubmitForm(data) {
                this.socket.emit('getGoogle', {sites: data.sites, size: data.size});
            }
        },
        mounted() {
            ConsoleLogHTML.connect(document.getElementById("myULContainer"));

            this.socket = io.connect(location.hostname + ':3038/', {//8081
                // 'reconnectionDelay': 10 // defaults to 500
            });
            this.socket.on('getGoogle', (dataJson) => {
                let data = JSON.parse(dataJson);
                this.data = data;
                // queriesThree([...data.queries]);
                // queriesTable([...data.queries]);
                // googleTable(Object.assign({}, data.sites));

                this.sites = null;
            });
            this.socket.on('console', (result) => {
                if (typeof result === 'string') {
                    console.log(decodeURI(result), ' NodeJs');
                } else {
                    console.log(JSON.stringify(result), ' NodeJs');
                }
            });
        }
    }
</script>

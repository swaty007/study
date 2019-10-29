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
                                <vue-google-table v-if="data.sites !== null" :sites="data.sites"></vue-google-table>

                            </div>

                            <div id="tab-2" class="tab-pane fade">
                                <vue-domains :sites="data.sites" :domains="data.domains"></vue-domains>
                            </div>

                            <div id="tab-3" class="tab-pane fade">
                                <vue-queries v-if="data.queries !== null" :queries="data.queries"></vue-queries>
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
                    domains: {},
                    queries: null
                },
                pagination: {
                    'current_page': 1
                },
                stage: 1,
                socket: null,
                blockGoogle: false,
                blockDomains: false
            };
        },
        methods: {
            onSubmitForm(data) {
                if (this.blockGoogle || this.blockDomains) {
                    console.log('block');
                    return;
                }
                this.socket.emit('getGoogle', {sites: data.sites, size: data.size});
                this.data = {
                    sites: null,
                    domains: {},
                    queries: null
                };
                this.blockGoogle = true;
                this.blockDomains = true;
            }
        },
        mounted() {
            ConsoleLogHTML.connect(document.getElementById("myULContainer"));

            this.socket = io.connect(location.hostname + ':3038/', {//8081
                // 'reconnectionDelay': 10 // defaults to 500
            });
            this.socket.on('getGoogle', (dataJson) => {
                let data = JSON.parse(dataJson);
                this.data.sites = data.sites;
                this.data.queries = data.queries;
                this.blockGoogle = false;
                // queriesThree([...data.queries]);
                // queriesTable([...data.queries]);
                // googleTable(Object.assign({}, data.sites));
            });
            this.socket.on('getDomains', (dataJson) => {
            //     let data = JSON.parse(dataJson);
            //     this.data.domains = data.domains;
            //     this.blockDomains = false;
                this.blockDomains = false;
            });
            this.socket.on('getDomain', (dataJson) => {
                let data = JSON.parse(dataJson);
                console.log(data);
                this.data.domains = Object.assign({},this.data.domains, data);
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

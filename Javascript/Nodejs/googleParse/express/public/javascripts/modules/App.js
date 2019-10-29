
class App {
    constructor() {
        this.events();
    }


    events() {

        // Vue.config.devtools = true;

        Vue.component('vue-form-google', require('./components/Vue_form_google.vue').default);
        Vue.component('vue-domains', require('./components/Vue_domains.vue').default);
        Vue.component('vue-google-table', require('./components/Vue_google_table.vue').default);
        Vue.component('vue-queries', require('./components/Vue_queries.vue').default);


        const root = require('./components/App.vue').default;
        const app = new Vue({
            el: '#app',
            render: createElement => createElement(root),
            components: {
                root,
            },
        });



    }
    // Functions

}

export default App;

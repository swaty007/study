import Vue from "vue/dist/vue.common"
window.$ = window.jQuery = require('jquery');
window.Vue = Vue;

require('jszip');
require('pdfmake');
require('datatables.net');
require('datatables.net-bs');
require('datatables.net-buttons-bs');
require('datatables.net-buttons/js/buttons.colVis.js');
require('datatables.net-buttons/js/buttons.flash.js');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.print.js');
require('datatables.net-fixedheader-bs');
require('datatables.net-responsive-bs');
require('bootstrap/dist/js/bootstrap.bundle.min.js');



import App from "./modules/App";
const app = new App();



var $ = require( 'jquery' );
require( 'jszip' );
require( 'pdfmake' );
require( 'datatables.net' );
require( 'datatables.net-bs' );
require( 'datatables.net-buttons-bs' );
require( 'datatables.net-buttons/js/buttons.colVis.js' );
require( 'datatables.net-buttons/js/buttons.flash.js' );
require( 'datatables.net-buttons/js/buttons.html5.js' );
require( 'datatables.net-buttons/js/buttons.print.js' )
require( 'datatables.net-fixedheader-bs' );
require( 'datatables.net-responsive-bs' );
var needle = require("needle");
var cheerio = require("cheerio");
var request = require('request');
var resolve = require('url').resolve;

var io = require ('socket.io-client/dist/socket.io.js');
var ConsoleLogHTML = require('console-log-html');

$(document).ready(function() {
    ConsoleLogHTML.connect(document.getElementById("myULContainer"));
    $('#table_id').DataTable( {
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
    var socket = io.connect('http://localhost:3038/',
        {
            // 'reconnectionDelay': 10 // defaults to 500
        }
    );

    socket.on('news', (message) => {
        console.log(message);
    })
});

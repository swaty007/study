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

var io = require('socket.io-client/dist/socket.io.js');
var ConsoleLogHTML = require('console-log-html');

$(document).ready(function() {
    ConsoleLogHTML.connect(document.getElementById("myULContainer"));

    var socket = io.connect('http://localhost:3038/', {
            // 'reconnectionDelay': 10 // defaults to 500
    });
    socket.on('getGoogle', (result) => {
        console.log(result,'result get Google Front');
        $.get(result.data.url, function(res) {
            socket.emit('getGoogle', {res: res, data: result.data, cb: result.cb});
        });
    });
    socket.on('console', (result) => {
        console.log(result,' NodeJs');
    });
    $("#form_google").on('submit', function (e) {
        e.preventDefault();
        let sites = $("#form_google input[name='sites']");
        $.ajax({
            type: "POST",
            url: "/calc" ,
            // cache : false,
            // processData: false,
            // dataType: 'json',
            // contentType: false,
            data: {
                sites: sites.val()
            },
            success: function (data) {
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
                sites.val('');
            }
        });
    })

});

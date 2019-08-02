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


$(document).ready(function() {
    $('#table_id').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
} );

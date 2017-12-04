

// new table configs
$(document).ready(function() {
    $('#table').DataTable({
        "lengthMenu": [[50, 75, 100, -1], [50, 75, 100, "All"]],
        "sDom": '<"top"il>rt<"bottom"ip><"clear">'
    });
} );


function filterGlobal () {
    $('#table').DataTable().search(
        $('#global_filter').val(),
        $('#global_regex').prop('checked'),
        $('#global_smart').prop('checked')
    ).draw();
}
 
function filterColumn ( i ) {
    $('#table').DataTable().column( i ).search(
        $('#col'+i+'_filter').val(),
        $('#col'+i+'_regex').prop('checked'),
        $('#col'+i+'_smart').prop('checked')
    ).draw();
}
 
$(document).ready(function() {
    $('#table').DataTable();
 
    $('input.global_filter').on( 'keyup click', function () {
        filterGlobal();
    } );
 
    $('input.column_filter').on( 'keyup click', function () {
        filterColumn( $(this).parents('tr').attr('data-column') );
    } );
} );

function clearFields() {
    window.location.reload();
}
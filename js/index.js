(function($, window, undefined){

$('#projects')

.find('li p')
.css({
    'display': 'table',
    'height': '100%'
})

.wrapInner('<i />')
.css({
    'display': 'table-cell',
    'vertical-align': 'middle'
});
    
})(jQuery, this);
(function($, window, undefined){

$('#projects')

.find('li p')
.wrapInner('<i />')
.css({
    'display': 'table',
    'height': '100%'
})

.find('i')
.css({
    'display': 'table-cell',
    'vertical-align': 'middle'
});
    
})(jQuery, this);
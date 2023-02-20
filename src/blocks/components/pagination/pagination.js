let pannos = $('.panno__item');
let pannosArr = [];
for( let i = 0; i < pannos.length; i++ ){
    pannosArr[i] = i;
}
function template(data) {
    var html = '';
    data.forEach(element => {
        html += pannos[ element ].outerHTML;
    });
    return html;
}

var clicked = 0;
let panel = document.querySelector('.panel-fix--main');
$('#pagination-container').pagination({
    dataSource: pannosArr,
    pageSize: 12,
    prevText: '',
    nextText: '',
    callback: function(data, pagination) {
        var html = template(data);
        $('#panno__items').html(html);
        if( clicked != 0 ){
            var $target = $('#scrollto-projects');
            if( $target.length ){
                $('html, body').stop().animate( {
                    'scrollTop': $target.offset().top - panel.getBoundingClientRect().height
                }, 300, 'swing', function () {
                } );
            }
        }
        $(window).trigger('resize');
        clicked = 1;
    }
})
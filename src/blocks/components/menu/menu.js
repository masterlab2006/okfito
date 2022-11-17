let introSection = document.querySelector('.section--intro');
let introSectionHeight = introSection.getBoundingClientRect().height;
let panel = document.querySelector('.panel-fix');
let panelShowClass = 'panel-fix--show';
$(window).on('scroll', function(){
    let windowY = this.scrollY;
    if( windowY >= introSectionHeight ){
        panel.classList.add(panelShowClass);
    }
    else{
        panel.classList.remove(panelShowClass);
    }
}).trigger('scroll');

let body = document.querySelector('body');
let bodyClass = 'noscroll';
let panelMobile = document.querySelector('.panel-mobile');
let panelMobileClass = 'panel-mobile--active';
$(document).on('click', '.menu-btn--js', function(){
    panelMobile.classList.add(panelMobileClass);
    body.classList.add(bodyClass);
});
$(document).on('click', '.panel-mobile__close-btn--js', function(){
    panelMobile.classList.remove(panelMobileClass);
    body.classList.remove(bodyClass);
});
$(document).on('click', function(e){
    if ( !$(e.target).closest('.panel-mobile__content').length && !$(e.target).closest('.menu-btn--js').length ) {
        panelMobile.classList.remove(panelMobileClass);
        body.classList.remove(bodyClass);
    };
});

$('a[href^="#scrollto"]').bind('click.smoothscroll',function (e) {
    var target = this.hash,
        $target = $(target);

    $('html, body').stop().animate( {
        'scrollTop': $target.offset().top - panel.getBoundingClientRect().height
    }, 900, 'swing', function () {
        $('.panel-mobile__close-btn--js').trigger('click');
        window.location.hash = target;
    } );
});


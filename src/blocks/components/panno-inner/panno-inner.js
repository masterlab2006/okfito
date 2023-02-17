var items = document.querySelectorAll('.panno-inner__slider .swiper-slide');

if( items.length > 1 ){
    var swiper = new Swiper(".panno-inner__thumbs", {
        loop: true,
        spaceBetween: 0,
        slidesPerView: 5,
        // freeMode: true,
        watchSlidesProgress: true,
        centeredSlides: true,
    });

    var swiper2 = new Swiper(".panno-inner__slider", {
        loop: true,
        spaceBetween: 0,
        navigation: {
            nextEl: ".panno-inner__slider-next",
            prevEl: ".panno-inner__slider-prev",
        },
        thumbs: {
            swiper: swiper,
        },
        centeredSlides: true,
    });
}

/* pager */

let pages = [
    '/ozelenenie-vannoj-komnaty.html',
    '/vertikalnoe-ozelenenie.html',
    '/uglovoe-ozelenenie.html',
    '/panno-s-rasteniyami-v-spalne.html',
    '/ozelenenie-vannoj-komnaty2.html',
    '/chto-takoe-stabilizi-rovannyj-moh.html',
    '/panno-s-podsvetkoj-i-logotipom.html',
    '/fitostena-iz-mha-i-rastenij.html',
    '/ozelenenie-prihozhej.html',
    '/installyatsiya-iz-rastenij-na-stene.html',
    '/fitostena-iz-mha-i-rastenij2.html',
    '/kak-uhazhivat-za-stabilizirovannym-mhom-i-panno.html',
];

let href = document.location.href;

let prev = document.querySelector('.navigation__prev');
let next = document.querySelector('.navigation__next');

let prevHref = '';
let nextHref = '';

for (let i = 0; i < pages.length; i++){
    if ( href.indexOf( pages[i] ) !== -1 ){
        if( i == 0 ){
            prevHref = pages[ pages.length - 1 ];
            nextHref = pages[ i + 1 ];
        }
        else if( i == pages.length - 1 ){
            prevHref = pages[ i - 1 ];
            nextHref = pages[ 0 ];
        }
        else{
            prevHref = pages[ i - 1 ];
            nextHref = pages[ i + 1 ];
        }
    }
}
prev.setAttribute('href', nextHref);
next.setAttribute('href', prevHref);
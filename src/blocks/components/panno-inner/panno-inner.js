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
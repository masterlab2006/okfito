$('.calculator__mox__input').slider({
    min: 0,
    max: 100,
    value: 0,
    range: "min",
    slide: function( event, ui ) {
        var $this = $(this);
        var $par = $this.closest('.calculator__mox__item');
        var $img = $par.find('.calculator__mox__img');
        var $value = ui.value;
        var handle = $this.find('.ui-slider-handle');
        handle.attr('data-value', $value + '%');
        if( $value == 0 ){
            handle.addClass('inactive');
            $img.removeClass('active')
        }
        else{
            handle.removeClass('inactive');
            $img.addClass('active')
        }
    },
    create: function( event, ui ) {
        var $this = $(this);
        var handle = $this.find('.ui-slider-handle');
        handle.attr('data-value', 0 + '%');
        handle.addClass('inactive');
    },
});

$('.calculator__more__input').slider({
    min: 0,
    max: 100,
    value: 0,
    range: "min",
    slide: function( event, ui ) {
        var $this = $(this);
        var $par = $this.closest('.calculator__more__items');
        var $item = $par.find('.calculator__more__item');
        var $value = ui.value;
        var handle = $this.find('.ui-slider-handle');
        handle.attr('data-value', $value + '%');
        if( $value == 0 ){
            handle.addClass('inactive');
            $item.removeClass('active')
        }
        else{
            handle.removeClass('inactive');
            $item.addClass('active')
        }
    },
    create: function( event, ui ) {
        var $this = $(this);
        var handle = $this.find('.ui-slider-handle');
        handle.attr('data-value', 0 + '%');
        handle.addClass('inactive');
    },
});
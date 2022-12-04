// vars

// выберите Вид покрытия цена за м2
// formation Пластовый мох
// yagel Ягель мох
// bump Кочки мох
let mox = {
    "formation" : {
        "price": "16000",
    },
    "yagel" : {
        "price": "19250",
    },
    "bump" : {
        "price": "35000",
    },
}

// выберите Вид растений цена за м2 
let morePrice = 0;
let deliveryPrice = 0;
let sliderMax = 100;
// functions
$.fn.caret = function (begin, end) {
    var range;

    if (this.length === 0 || this.is(':hidden')) {
        return;
    }

    if ($.type(begin) === 'number') {
        end = ($.type(end) === 'number') ? end : begin;
        return this.each(function () {
            if (this.setSelectionRange) {
                this.setSelectionRange(begin, end);
            } else if (this.createTextRange) {
                range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', begin);
                range.select();
            }
        });
    } else {
        if (this[0].setSelectionRange) {
            begin = this[0].selectionStart;
            end = this[0].selectionEnd;
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            begin = 0 - range.duplicate().moveStart('character', -100000);
            end = begin + range.text.length;
        }
        return {
            begin: begin,
            end: end
        };
    }
};

$.keys = {};

$.KEYS = {
    Digit: [48, 57],
    Backspace: 8,
    Comma: 44,
    Point: 46
};

$.each($.KEYS, function (key, value) {
    $.keys['is' + key] = function (code) {
        if ($.isArray(value)) {
            return (value[0] <= code && code <= value[1]);
        } else {
            return value === code;
        }
    };
});

$.fn.getVal = function () {
    var values = [];

    this.each(function () {
        var v = $(this).val();
        v = parseFloat(v);
        if (!v) {
            v = 0;
        }
        values.push(v);
    });
    return values;
};

$.fn.keyFilter = function (selector, settings) {
    settings = $.extend({
        type: 'int',
        def: '',
        callback: $.noop
    }, settings);

    return this.each(function () {
        var $this = $(this);

        $this.on('keypress', selector, function (e) {
            var caret, isBackspace, isDigit, isPoint, val, input = $(this);

            if (e.shiftKey || e.ctrlKey) {
                return false;
            }

            if (e.which === 0) {
                return true;
            }

            isDigit = $.keys.isDigit(e.which);
            isPoint = $.keys.isPoint(e.which) || $.keys.isComma(e.which);
            isBackspace = $.keys.isBackspace(e.which);

            if (!isDigit && !isPoint && !isBackspace) {
                return false;
            }

            if (settings.type === 'int' && isPoint) {
                return false;
            }

            val = input.val().replace(/,/g, '.');
            caret = input.caret();
            input.val(val);
            input.caret(caret.begin, caret.end);

            if (isPoint && val.indexOf('.') !== -1) {
                return false;
            }
        });

        $this.on('keyup', selector, function () {
            var input = $(this);
            settings.callback(input);
        });

        $this.on('blur', selector, function () {
            var input = $(this);
            if (input.val() === '') {
                input.val(settings.def);
                settings.callback(input);
            }
        });
    });
};

function getSquare(){
    let width = $('.calculator--width').val();
    let length = $('.calculator--length').val();
    let square = $('.calculator--square').val();
    let $square = 0;
    if( square != '' && square != 0 ){
        $square = square;
    }
    else if( width != '' && width != 0 && length != '' && length != 0 ){
        $square = parseFloat( width * length );
    }
    return $square
}

function getDeliveryPrice(){
    var item = $('.calculator__delivery__title.active');
    if (item.length){
        var price = item.attr('data-price');
        deliveryPrice = price;
    }
    else{
        deliveryPrice = 0;
    }
    return deliveryPrice
}

function getMorePrice(){
    var a = $('.calculator__more__item.active');
    if( a.length ){
        var b = a.length;
        if( b > 0 && b <=3 ){
            morePrice = 25000;
        }
        else if( b > 3 && b <=5 ){
            morePrice = 28000;
        }
        else if( b > 5 && b <=10 ){
            morePrice = 32000;
        }
        else if( b > 10 && b <=15 ){
            morePrice = 37000;
        }
    }
    else{
        morePrice = 0;
    }
    return morePrice
}

function toFixed(a){
    var value = a.toFixed(2);
    return value
}

function setMore(){
    var a = $('.calculator__more__item.active');
    var value = 0;
    if( a.length ){
        var b = a.length;
        if( b > 0 && b <=3 ){
            value = 20;
            morePrice = 25000;
        }
        else if( b > 3 && b <=5 ){
            value = 35;
            morePrice = 28000;
        }
        else if( b > 5 && b <=10 ){
            value = 50;
            morePrice = 32000;
        }
        else if( b > 10 && b <=15 ){
            value = 80;
            morePrice = 37000;
        }

        var ostatok = 100 - value;
        var count = 0;
        var sortedList = $('.calculator__mox__input').sort(function(lhs, rhs){
            return parseInt($(lhs).slider("value"),10) - parseInt($(rhs).slider("value"),10);
        });
        var sum = 0;
        $('.calculator__mox__input').each(function() {
            var val = parseFloat($(this).slider("value")) || 0;
            if (val) {
                count++;
            }
            sum += val;
        });

        if (sum > ostatok) {
            var raznit = sum - ostatok;
            sortedList.each(function() {
                var currV =  $(this).slider("value");
                if (currV) {
                    var vich = Math.floor(raznit / count);
                    console.log(vich);                
        
                    if (currV > vich) {
                        $(this).slider( "value", currV - vich);
                        raznit -= vich;
                    } else {
                        $(this).slider( "value", 0);
                        raznit -= currV;
                    }            
        
                    count--;
                }
            })
        }

        if( value ){
            $('.calculator__more__input').slider('value', value);
            $('.calculator__more__value').html(value);
            $('.calculator__more .ui-slider-handle').attr('data-value', value + '%');
            $('.calculator__more .ui-slider-handle').removeClass('inactive');
        }
    }
    else{
        $('.calculator__more__input').slider('value', value);
        $('.calculator__more__value').html(value);
        $('.calculator__more .ui-slider-handle').attr('data-value', value + '%');
        $('.calculator__more .ui-slider-handle').addClass('inactive');
        morePrice = 0;
    }
}

function validate(){
    var inputWidth = $('.calculator--width');
    var inputLength = $('.calculator--length');
    var inputSquare = $('.calculator--square');
    var isValid = true;

    if( inputWidth.val() != '' && inputWidth.val() != 0 ){
        inputWidth.removeClass('error');
    }
    else{
        inputWidth.addClass('error');
        isValid = false;
    }

    if( inputLength.val() != '' && inputLength.val() != 0 ){
        inputLength.removeClass('error')
    }
    else{
        inputLength.addClass('error')
        isValid = false;
    }

    if( inputSquare.val() != '' && inputSquare.val() != 0 ){
        inputSquare.removeClass('error');
        inputLength.removeClass('error');
        inputWidth.removeClass('error');
    }
    else{
        inputSquare.addClass('error');
        isValid = false;
    }
    return isValid
}

function calculate(){
    var square = getSquare();
    var deliveryPrice = getDeliveryPrice();
    var square = getSquare();
    validate();
}
// functions end

$(document).keyFilter('.calculator__size__input input, input[name="square"]', {
    type: 'float'
});

// calculator

// $( ".calculator__mox__input" ).eq(1).slider( "option", "max", 50 );

var change = function( event, ui ) {
    var $this = $(this);
    var $par = $this.closest('.calculator__mox__item');
    var $img = $par.find('.calculator__mox__img');
    var $value = ui.value;
    var $input = $par.find('.calculator__mox__value');
    var handle = $this.find('.ui-slider-handle');

    handle.attr('data-value', $value + '%');
    $input.html($value);
    if( $value == 0 ){
        handle.addClass('inactive');
        $img.removeClass('active')
    }
    else{
        handle.removeClass('inactive');
        $img.addClass('active')
    }
};

$('.calculator__mox__input').slider({
    min: 0,
    max: 100,
    value: 0,
    range: "min",
    change: change,
    slide: change,
    create: function( event, ui ) {
        var $this = $(this);
        var handle = $this.find('.ui-slider-handle');
        var $par = $this.closest('.calculator__mox__item');
        var $input = $par.find('.calculator__mox__value');
        handle.attr('data-value', 0 + '%');
        $input.html(0)
        handle.addClass('inactive');
    },
    stop: function( event, ui ) {
    },
});

$( '.calculator__mox__input[data-input="formation"]' ).on( "slidestop", function( event, ui ) {
    var $value = ui.value;
    var $this = $(this);

    var moreValue = $('.calculator__more__input').slider('value') || 0;
    var yagelValue = $( '.calculator__mox__input[data-input="yagel"]' ).slider('value') || 0;
    var bumpValue = $( '.calculator__mox__input[data-input="bump"]' ).slider('value') || 0;

    sliderMax = 100 - moreValue - yagelValue - bumpValue;

    if( sliderMax > 0 ){
        if ( $value >= sliderMax ){
            $this.slider( "value", sliderMax );
            $value = sliderMax;
        }
        else{
            $value = ui.value;
        }
    }
    else{
        $value = 0;
        $this.slider( "value", $value );
    }

    var $par = $this.closest('.calculator__mox__item');
    var $img = $par.find('.calculator__mox__img');
    var $input = $par.find('.calculator__mox__value');
    var handle = $this.find('.ui-slider-handle');

    handle.attr('data-value', $value + '%');
    $input.html($value);
    if( $value == 0 ){
        handle.addClass('inactive');
        $img.removeClass('active')
    }
    else{
        handle.removeClass('inactive');
        $img.addClass('active')
    }
});

$( '.calculator__mox__input[data-input="yagel"]' ).on( "slidestop", function( event, ui ) {
    var $value = ui.value;
    var $this = $(this);

    var moreValue = $('.calculator__more__input').slider('value') || 0;
    var yagelValue = $( '.calculator__mox__input[data-input="formation"]' ).slider('value') || 0;
    var bumpValue = $( '.calculator__mox__input[data-input="bump"]' ).slider('value') || 0;

    sliderMax = 100 - moreValue - yagelValue - bumpValue;

    if( sliderMax > 0 ){
        if ( $value >= sliderMax ){
            $this.slider( "value", sliderMax );
            $value = sliderMax;
        }
        else{
            $value = ui.value;
        }
    }
    else{
        $value = 0;
        $this.slider( "value", $value );
    }

    var $par = $this.closest('.calculator__mox__item');
    var $img = $par.find('.calculator__mox__img');
    var $input = $par.find('.calculator__mox__value');
    var handle = $this.find('.ui-slider-handle');

    handle.attr('data-value', $value + '%');
    $input.html($value);
    if( $value == 0 ){
        handle.addClass('inactive');
        $img.removeClass('active')
    }
    else{
        handle.removeClass('inactive');
        $img.addClass('active')
    }
});

$( '.calculator__mox__input[data-input="bump"]' ).on( "slidestop", function( event, ui ) {
    var $value = ui.value;
    var $this = $(this);

    var moreValue = $('.calculator__more__input').slider('value') || 0;
    var yagelValue = $( '.calculator__mox__input[data-input="formation"]' ).slider('value') || 0;
    var bumpValue = $( '.calculator__mox__input[data-input="yagel"]' ).slider('value') || 0;

    sliderMax = 100 - moreValue - yagelValue - bumpValue;

    if( sliderMax > 0 ){
        if ( $value >= sliderMax ){
            $this.slider( "value", sliderMax );
            $value = sliderMax;
        }
        else{
            $value = ui.value;
        }
    }
    else{
        $value = 0;
        $this.slider( "value", $value );
    }

    var $par = $this.closest('.calculator__mox__item');
    var $img = $par.find('.calculator__mox__img');
    var $input = $par.find('.calculator__mox__value');
    var handle = $this.find('.ui-slider-handle');

    handle.attr('data-value', $value + '%');
    $input.html($value);
    if( $value == 0 ){
        handle.addClass('inactive');
        $img.removeClass('active')
    }
    else{
        handle.removeClass('inactive');
        $img.addClass('active')
    }
});

$('.calculator__more__input').slider({
    min: 0,
    max: 100,
    value: 0,
    range: "min",
    disabled: true,
    change: function( event, ui ) {
        var $this = $(this);
        var $par = $this.closest('.calculator__more');
        var $value = ui.value;
        var handle = $this.find('.ui-slider-handle');
        var $input = $par.find('.calculator__more__value');

        $input.html($value);
        handle.attr('data-value', $value + '%');
        
        if( $value == 0 ){
            handle.addClass('inactive');
        }
        else{
            handle.removeClass('inactive');
        }
    },
    create: function( event, ui ) {
        var $this = $(this);
        var handle = $this.find('.ui-slider-handle');
        handle.attr('data-value', '0%');
        handle.addClass('inactive');
    },
});

$(document).on('click', '.calculator__more__item', function(e){
    e.preventDefault();
    var $this = $(this);
    $this.toggleClass('active');
    setMore();
});

$(document).on('click', '.calculator__delivery__title', function(e){
    e.preventDefault();
    var $this = $(this);
    var isActive = $this.hasClass('active');
    $('.calculator__delivery__title').removeClass('active');
    if ( !isActive ){
        $this.addClass('active');
    }
});

$(document).on('keyup', '.calculator--width, .calculator--length', function(){
    var width = $('.calculator--width');
    var length = $('.calculator--length');
    var square = $('.calculator--square');

    var widthVal = parseFloat(width.val());
    var lengthVal = parseFloat(length.val());

    var $square = 0;

    if ( widthVal && lengthVal ){
        $square = widthVal * lengthVal;

        if( $square.toString().indexOf('.') !==-1 ){
            $square = toFixed($square);
        }

        square.val(  $square );
    }
    else{
        square.val( '' );
    }
    validate();
});

$(document).on('keyup', '.calculator--square', function(){
    var width = $('.calculator--width');
    var length = $('.calculator--length');

    var squareVal = $(this).val();
    if( squareVal ){
        width.val( '' );
        length.val( '' );
    }
    validate();
});


$(document).on('click', '.calculator--sum', function(e){
    e.preventDefault();
    calculate();
});
// deliveryPrice
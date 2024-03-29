// vars
// выберите Вид покрытия цена за м2
// formation Пластовый мох
// yagel Ягель мох
// bump Кочки мох
let mox = {
    "formation" : {
        "price": "16000",
        "name": "Пластовый мох",
    },
    "yagel" : {
        "price": "19250",
        "name": "Ягель мох",
    },
    "bump" : {
        "price": "35000",
        "name": "Кочки мох",
    },
}

// выберите Вид растений цена за м2 
let morePrice = 0;
let moxPrice = 0;
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

        $this.on('change', selector, function () {
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

    validate();

    var square = getSquare();
    var morePrice = getMorePrice();
    var moreValue = $('.calculator__more__input').slider('value') || 0;

    var formationPrice = mox.formation.price;
    var formationValue = $('[data-input="formation"]').slider('value') || 0;

    var yagelPrice = mox.yagel.price;
    var yagelValue = $('[data-input="yagel"]').slider('value') || 0;

    var bumpPrice = mox.bump.price;
    var bumpValue = $('[data-input="bump"]').slider('value') || 0;

    var deliveryPrice = getDeliveryPrice();
    var is100 = false;
    
    var info = '';
    var total;
    var totalMore = 0;
    var totalformation = 0;
    var totalYagel = 0;
    var totalBump = 0;
    var totalDelivery = deliveryPrice;

    if( moreValue + formationValue + yagelValue + bumpValue == 100 ){
        is100 = true;
    }
    
    if ( square == 0 ){
        myo.open({
            clas: 'form-popup',
            html: `<div class="form-intro">
                        <div class="popup-mess">Впишите размеры длины и ширины для рассчёта площади</div>
                    </div>
                    `,
        });
        $('a[href="#form-popup-calculator"]').removeClass('active');
    }
    else if ( !is100 ){
        myo.open({
            clas: 'form-popup',
            html: `<div class="form-intro">
                        <div class="popup-mess">Площадь покрытия не 100%</div>
                    </div>
                    `,
        });
        $('a[href="#form-popup-calculator"]').removeClass('active');
    }
    else{
        $('a[href="#form-popup-calculator"]').addClass('active');
        totalMore = square * morePrice * moreValue / 100;
        totalformation = square * formationPrice * formationValue / 100;
        totalYagel = square * yagelPrice * yagelValue / 100;
        totalBump = square * bumpPrice * bumpValue / 100;
        total = parseInt(totalMore + totalformation + totalYagel + totalBump + parseInt(totalDelivery)).toLocaleString('ru');
        $('.totalSum').html( total );
        $('.totalSquare').html( square );
    }
        
}
// functions end

$(document).keyFilter('.calculator__size__input input, input[name="square"]', {
    type: 'float'
});

// calculator

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

// находим все jquery slider Виды покрытия в массиве по data-input
var mox_arr = [];
$('.calculator__mox__input').each(function(){
    var $this = $(this);
    var $name = $this.attr('data-input') || false;
    if( $name ){
        mox_arr.push($name);
    }
});

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
        var $value = ui.value;
        var $this = $(this);

        var $name = $this.attr('data-input');
        var moreValue = $('.calculator__more__input').slider('value') || 0;
        var maxValuesForSliders = 100 - moreValue;
        var lostSliders = [];

        $('.calculator__mox__input').each(function(){
            var $this2 = $(this);
            var $name2 = $this2.attr('data-input') || false;
            var $value2 = $this2.slider("value");
            if( $name2 && $name2 != $name && $value2 ){
                lostSliders.push($name2);
            }
        });

        var ostatok = 100 - $value - moreValue;
        var count = 0;
        var sortedList = $('.calculator__mox__input').not($this).sort(function(lhs, rhs){
            return parseInt($(lhs).slider("value"),10) - parseInt($(rhs).slider("value"),10);
        });
        var sum = 0;
        $('.calculator__mox__input').not($this).each(function() {
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
        if( $value >= maxValuesForSliders ){
            $this.slider('value', maxValuesForSliders );
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
    },
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

    var widthVal = width.val().replace(/,/g, '.');
    var lengthVal = length.val().replace(/,/g, '.');

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
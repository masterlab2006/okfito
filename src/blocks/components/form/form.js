/*
 ** Определяет глобальную переменную myo
 **
 ** Пример использования:
 **      myo.open({html: '<strong>hellow world</strong>'} );
 **      myo.open({text: 'hellow world'});
 **      myo.open({elem: '#content'});
 **      myo.open({ajax: '/url'});
 **      myo.open({iframe: '/url'});
 **
 ** Дополнительные опции:
 **      clas - класс для обертки всплывающего окна
 **      width - ширина для обертки всплывающего окна
 **      data - объект, передача данных для ajax и iframe
 **
 ** Коллбеки: beforeOpen, afterOpen, beforeClose, afterClose, onLoad (для ajax и iframe)
 ** для ф-ции beforeOpen, afterOpen, beforeClose, afterClose первым аргументом передается
 ** объект всплывающего окна. В нем есть свойства bodyDiv, wrapDiv и т.д.
 */

/* правим функцию requestAnimationFrame */
window.myo = (function(window, document, undefined) {
    var
        $win = $(window),
        stack = [],
        isInited = false,
        isOpened = false,
        containerDiv = null,
        dimDiv = null,
        scrollLeft,
        Wins;

    Wins = {
        open: function(options) {
            var win = new PopoverWin(options);

            if (!isInited) init();
            if (!isOpened) showDim();
            if (stack.length) Wins.winLast().disable();

            stack.push(win);
            win.scrollDiv.appendTo(containerDiv);

            if (stack.length === 1) freezeBody();

            win.open();
            isOpened = true;
        },
        close: function( callback ) {
            if (stack.length) {
                Wins.winLast().close();
                stack.pop();
            };

            if (!stack.length) {
                hideDim();
                isOpened = false;
                unfreezeBody();
            } else {
                Wins.winLast().enable();
            }
        },
        winLast: function () {
            return stack[stack.length-1];
        },
        winFirst: function () {
            return stack[0];
        },
        win: function (ind) {
            return stack[ind];
        }
    };


    /* конструктор окон */
    {
        PopoverWin = function ( options ) {
            this.options = options || {};
            this.scrollDiv;
            this.wrapDiv;
            this.bodyDiv;
            this.loadDiv;
            this.closDiv;
            this.isHidden;
            this.timerId;
            this.init();
        };
        PopoverWin.prototype.init = function() {
            var self = this;

            self.scrollDiv = $('<div class="fl-popover__scrolling"></div>');
            self.wrapDiv = $('<div class="fl-popover__wrap"></div>').appendTo(self.scrollDiv);
            self.bodyDiv = $('<div class="fl-popover__body"></div>').appendTo(self.wrapDiv);
            self.loadDiv = $('<div class="fl-popover__loader"></div>').appendTo(self.wrapDiv);
            self.closDiv = $('<div class="fl-popover__close"></div>').appendTo(self.wrapDiv);

            self.scrollDiv.on("click", function (e) {
                if (e.eventPhase===2 || $(e.target).is(self.scrollDiv)) Wins.close();
            });
            self.closDiv.on("click", function (){ Wins.close(); });
            self.loadDiv.on("click", function (){ Wins.close(); });
        };
        PopoverWin.prototype.enable = function() {
            this.scrollDiv.removeClass("disable");
        };
        PopoverWin.prototype.disable = function() {
            this.scrollDiv.addClass("disable");
        };
        PopoverWin.prototype.open = function() {
            var
                self = this,
                options = this.options,
                width = options.width || null,
                html = options.html || null,
                text = options.text || null,
                elem = options.elem || null,
                clas = options.clas || null,
                ajax = options.ajax || null,
                json = options.json || null,
                data = options.data || {},
                iframe = options.iframe || null,
                onLoad = options.onLoad || null,
                beforeOpen = options.beforeOpen || null,
                afterOpen = options.afterOpen || null;

            if (clas) self.wrapDiv.addClass(clas);
            if (width) self.wrapDiv.width(width);

            if (html) {
                self.bodyDiv.html(html);
            } else if (text) {
                self.bodyDiv.text(text);
            } else if (elem) {                
                self.htmlElem = elem = $(elem);
                self.bodyDiv.append(elem.contents());
            } else if (json) {
                self.loadDiv.show();
                $.ajax({
                    url: json,
                    dataType: 'json',
                    data: data,
                    success: function (data) {
                        var args = Array.prototype.slice.call(arguments,0);

                        self.loadDiv.hide();
                        if (data.result && data.result.html) {
                            self.bodyDiv.html(data.result.html);
                        }

                        if (onLoad && $.isFunction(onLoad)) {
                            onLoad.apply(self, args);
                        };
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        self.loadDiv.hide();
                        self.bodyDiv.html(textStatus);
                    }
                });
            } else if (ajax) {
                self.loadDiv.show();
                $.ajax({
                    url: ajax,
                    data: data,
                    success: function (data) {
                        var args = Array.prototype.slice.call(arguments,0);

                        self.loadDiv.hide();
                        self.bodyDiv.html(data);

                        if (onLoad && $.isFunction(onLoad)) {
                            onLoad.apply(self, args);
                        };
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        self.loadDiv.hide();
                        self.bodyDiv.html(textStatus);
                    }
                });
            } else if (iframe) {
                (function () {
                    var data_arr, key;

                    data_arr = ["iframe=1"];

                    for (key in data) {
                        if (data.hasOwnProperty(key)) {
                            data_arr.push(key + "=" + encodeURI(data[key]));
                        };
                    }

                    function onIframeLoad () {
                        var win, doc;

                        try {
                            win = iframeElem.contentWindow || iframeElem.contentDocument.parentWindow;
                            doc = win.document;

                            if (width) {
                                width = width -
                                parseInt(self.bodyDiv.css("padding-left"), 10) -
                                parseInt(self.bodyDiv.css("padding-left"), 10) -
                                parseInt(self.bodyDiv.css("border-left-width"), 10) -
                                parseInt(self.bodyDiv.css("border-right-width"), 10);
                                iframeElem.width = width;
                            }

                            function getDimension (name) {
                                var arr = ["scroll", "client", "offset"],
                                    i,
                                    value = 0,
                                    propertyName;

                                for (i = arr.length - 1; i >= 0; i--) {
                                    value = Math.max(value, (doc.documentElement[ arr[i] + name ] || 0), (doc.body[ arr[i] + name ] || 0));
                                };

                                return value;
                            }

                            function setWidthHeight () {
                                clearTimeout(self.iframeTimerId);
                                self.iframeTimerId = setTimeout(function () {
                                    var frameWidth = getDimension("Width"),
                                        frameHeight = getDimension("Height");

                                    if (frameHeight > 0) iframeElem.height = frameHeight;
                                    if (!width && frameWidth > 0) iframeElem.width = frameWidth;

                                    requestAnimationFrame(setWidthHeight);
                                }, 1000);
                            }
                            setWidthHeight();

                        } catch (e) {
                            self.bodyDiv.html("<h4>" + e.name + "</h4><p>" + e.message + "</p>");
                        } finally {
                            self.loadDiv.hide();
                            iframeElem.style.visibility = "visible";
                            if (onLoad && $.isFunction(onLoad)) {
                                onLoad.call(self, iframeElem);
                            };
                        }
                    };

                    iframeElem = document.createElement("iframe");
                    iframeElem.frameBorder = 0;
                    iframeElem.src = iframe + "?" + data_arr.join("&");
                    iframeElem.style.visible = "hidden";
                    iframeElem.onload = onIframeLoad;

                    self.bodyDiv.html(iframeElem);
                    self.loadDiv.show();
                }());
            };

            if ($.isFunction(beforeOpen)) {
                beforeOpen.call(self);
            };

            self.scrollDiv.show();
            self.wrapDiv.fadeIn(300, function () {
                self.isOpened = true;
                if ($.isFunction(afterOpen)) {
                    afterOpen.call(self);
                };
            });
        };
        PopoverWin.prototype.close = function() {
            var options = this.options,
                beforeClose = options.beforeClose || null,
                afterClose = options.afterClose || null;

            if ($.isFunction(beforeClose)) {
                beforeClose.call(this);
            };
            if (this.htmlElem) {
                this.bodyDiv.contents().appendTo(this.htmlElem);
                this.htmlElem = false;
            } else {
                this.bodyDiv.empty();
            }
            if (options.iframe) {
                clearTimeout(this.iframeTimerId);
            }
            this.scrollDiv.hide();
            this.scrollDiv.remove();
            this.isOpened = false;
            if ($.isFunction(afterClose)) {
                afterClose.call(this);
            };
        };
    }


    /* вспомогательные функции */

    function init () {

        containerDiv = $('<div class="fl-popover__container" id="fl-popover__container"></div>').appendTo("body");
        dimDiv = $('<div class="fl-popover__dim"></div>').appendTo(containerDiv);

        dimDiv.on("click", Wins.close);

        $(document).on("keydown", function (e) {
            if (e.keyCode===27 && isOpened) {
                Wins.close();
            };
        });

        isInited = true;
    }
    function showDim () {
        if (!dimDiv.length) return false;

        dimDiv.css("display", "block").stop().animate({opacity: 0.3}, 100);
    }
    function hideDim () {
        if (!dimDiv.length) return false;

        dimDiv.stop().animate({opacity: 0}, 100, function() {
            dimDiv.css("display", "none");
        });
    }
    function freezeBody () {
        var scrollLeftOld, scrollLeftNew, docWidth, deltaWidth;

        scrollLeftOld = Math.max( document.documentElement.scrollLeft, document.body.scrollLeft);
        docWidth = document.documentElement.clientWidth;
        document.documentElement.style.overflow = "visible";
        document.body.style.overflow = "hidden";
        deltaWidth = document.documentElement.clientWidth - docWidth;
        scrollLeftNew = Math.max( document.documentElement.scrollLeft, document.body.scrollLeft);
        scrollLeft = scrollLeftOld-scrollLeftNew;

        document.body.style.borderRight = deltaWidth + "px" + " solid transparent";
        window.scrollBy(scrollLeftOld-scrollLeftNew, 0);

        document.body.scrollLeft += 1;  // fix repaint
        document.body.scrollLeft += -1; // in chrome
    }
    function unfreezeBody () {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.borderRight = "";
        window.scrollBy(scrollLeft, 0);
    }

    return Wins;
}(window, document));


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame  = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
(function() {

    var validate = function(items){
        var validatedSucsess = true;
        items.each(function(){
            var item = $(this);
            var input = item.find('input');
            var name = input.attr('name');
            var value = input.val();

            if( name == 'phone' ){
                if(value.length < 18){
                    item.addClass('error');
                    validatedSucsess = false;
                }
                else{
                    item.removeClass('error');
                }
            }
            if( name == 'inn' ){
                if(value.length < 10){
                    item.addClass('error');
                    validatedSucsess = false;
                }
                else{
                    item.removeClass('error');
                }
                
            }
            else if( name == 'personal' ){
                var isChecked = input.prop('checked');
                if( isChecked ){
                    item.removeClass('error');
                }
                else{
                    item.addClass('error');
                    validatedSucsess = false;
                }
            }
            else if ( value && name != 'phone' && name != 'inn' ){
                item.removeClass('error');
            }
            else if ( !value && name != 'phone' && name != 'inn' ){
                item.addClass('error');
                validatedSucsess = false;
            }
        });
        return validatedSucsess
    }

    var formSuccess = function(){
        $('.form-intro').addClass('active');
        setTimeout(function(){
            $('.fl-popover__close').trigger('click');
        }, 2000);
    }
    var formSuccessReadyMade = function(){
        $('.form-intro--ready-made').addClass('active');
        setTimeout(function(){
            $('.fl-popover__close').trigger('click');
            window.open(
                'https://okfito.ru/files/ready_made.pdf',
                '_blank' // <- This is what makes it open in a new window.
            );
        }, 2000);
    }

    var formSuccessChecklist = function(){
        $('.form--checklist').hide().next('.form-intro__success').show();
        $('.checklist__title').hide();
        setTimeout(function(){
            window.open(
                'https://okfito.ru/files/checklist_care.pdf',
                '_blank' // <- This is what makes it open in a new window.
            );
        }, 2000);
    }

    $(function(){
        $('[name="phone"]').mask('+7 (000) 000 00 00');
        $('[name="inn"]').mask('0000000000');
    });

    // intro form

    $(document).on('click', '[href="#form-popup-intro"]', function (e) {
        e.preventDefault();
        myo.open({
            clas: 'form-popup',
            elem: '.form-intro__wrap--intro',
            beforeOpen: function(){
            },
            afterClose: function(){
                $('.form-intro').removeClass('active');
            },
        });
    });

    $(document).on('click', '[href="#form-popup-calculator"]', function (e) {
        e.preventDefault();

        var isActive = $(this).hasClass('active');
        if ( !isActive ){
            $('.calculator--sum').eq(0).trigger('click');
            var isActive2 = $(this).hasClass('active');
            if ( isActive2 ){
                myo.open({
                    clas: 'form-popup',
                    elem: '.form-intro__wrap--calculator',
                    beforeOpen: function(){
                    },
                    afterClose: function(){
                        $('.form-intro').removeClass('active');
                    },
                });
            }
        }
        else{
            myo.open({
                clas: 'form-popup',
                elem: '.form-intro__wrap--calculator',
                beforeOpen: function(){
                },
                afterClose: function(){
                    $('.form-intro').removeClass('active');
                },
            });
        }
    });
    
    $(document).on('click', '.btn--intro', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest('form');
        var requiredItems = $form.find('.form__item--required');
        if ( validate(requiredItems) ){

            $.ajax({
                type : 'POST',
                url : 'https://okfito.ru/form-intro.php',
                data : $form.serialize(),
                statusCode: {
                    200: formSuccess
                }
            });
        }
    });

    $(document).on('blur', '.form__item--required input', function (e) {
        var input = $(this);
        var requiredItem = input.closest('.form__item--required');
        validate(requiredItem);
    });

    // footer form
    $(document).on('click', '.btn--footer', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest('form');
        var requiredItems = $form.find('.form__item--required');
        if ( validate(requiredItems) ){

            $.ajax({
                type : 'POST',
                url : 'https://okfito.ru/form-footer.php',
                data : $form.serialize(),
                statusCode: {
                    200: formSuccess
                }
            });
        }
    });

    // form ready made
    $(document).on('click', '[href="#form-popup-ready-made"]', function (e) {
        e.preventDefault();
        myo.open({
            clas: 'form-popup',
            elem: '.form-intro__wrap--ready-made',
            beforeOpen: function(){
            },
            afterClose: function(){
                $('.form-intro').removeClass('active');
            },
        });
    });
    
    $(document).on('click', '.btn--ready-made', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest('form');
        var requiredItems = $form.find('.form__item--required');
        if ( validate(requiredItems) ){

            $.ajax({
                type : 'POST',
                url : 'https://okfito.ru/form-ready-made.php',
                data : $form.serialize(),
                statusCode: {
                    200: formSuccessReadyMade
                }
            });
        }
    });

    // form checklist
    $(document).on('click', '.btn--checklist', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest('form');
        var requiredItems = $form.find('.form__item--required');
        if ( validate(requiredItems) ){

            $.ajax({
                type : 'POST',
                url : 'https://okfito.ru/form-checklist.php',
                data : $form.serialize(),
                statusCode: {
                    200: formSuccessChecklist
                }
            });
        }
    });

    // form calculator
    $(document).on('click', '.btn--calculator', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest('form');
        var requiredItems = $form.find('.form__item--required');
        var moxs = $('.calculator__mox__item');
        var mores = $('.calculator__more__item.active');
        var square = $('.totalSquare');
        var delivery = $('.calculator__delivery__title.active');
        var total = $('.totalSum');
        var textarea = $('#textarea');
        var result = '';
        

        var mox = "";
        moxs.each(function(){
            var $this = $(this);
            var value = $this.find('.calculator__mox__input').slider('value');
            var title = $this.find('.calculator__mox__title').text();
            if ( value > 0 ){
                mox = mox + `${title} : ${value}%;<br>`;
            }
        });
        if ( mox == "" ){
            mox = 'Не выбрано пользователем<br>';
        }

        var more = "";
        var moreCounter = 1;
        mores.each(function(){
            var $this = $(this);
            var title = $this.text();
            more = more + `${moreCounter}) ${title}; <br>`;
            moreCounter++;
        });
        if ( more == "" ){
            more = 'Не выбрано пользователем';
        }
        
        var deliveryTitle = 'Не выбрана пользователем<br>';
        if ( delivery.length ){
            deliveryTitle = delivery.text();
        }
        
        var squareValue = square.text();
        var totalValue = total.text();

        result = `<br><br>Вид покрытия: <br> ${mox}
                <br>Вид растений: <br> ${more}
                <br>Доставка: ${deliveryTitle}
                <br>Площадь: ${squareValue} м²
                <br>Сумма: ${totalValue} ₽`;
        textarea.val(result);
        if ( validate(requiredItems) ){
            $.ajax({
                type : 'POST',
                url : 'https://okfito.ru/form-calculator.php',
                data : $form.serialize(),
                statusCode: {
                    200: formSuccess
                }
            });
        }
    });

}());
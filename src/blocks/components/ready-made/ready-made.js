$(document).on('click', '.ready-made__btn', function(e){

    e.preventDefault();
    
    $('.ready-made__item:hidden').show();
    $(this).hide();

})
import "./import/modules";
import "./import/components";
function imgResize() {
    if ($(window).width() < 768) {
        var picSM = $(".picture--sm").children();

        picSM.each(function(i,v){
            var dataSrcSet= $(v).data('srcset');
            var dataSrc= $(v).data('src');
            dataSrcSet? $(v).attr( "srcset", dataSrcSet ) : null;
            dataSrc ? $(v).attr( "src", dataSrc ) : null;
        })
    
    } else if ($(window).width() < 1024) {
        // $(".products-cards").addClass("owl-carousel");        
        var picMD = $(".picture--md").children();

        picMD.each(function(i,v){
            var dataSrcSet= $(v).data('srcset');
            var dataSrc= $(v).data('src');
            dataSrcSet? $(v).attr( "srcset", dataSrcSet ) : null;
            dataSrc ? $(v).attr( "src", dataSrc ) : null;
        })
    
    } else if ($(window).width() >= 1024) {        
        var picLG = $(".picture--lg").children();

        picLG.each(function(i,v){
            var dataSrcSet= $(v).data('srcset');
            var dataSrc= $(v).data('src');
            dataSrcSet? $(v).attr( "srcset", dataSrcSet ) : null;
            dataSrc ? $(v).attr( "src", dataSrc ) : null;
        })
    }
}

imgResize();

$(window).resize(function() {
    imgResize();
});
window.onload = function () {
    jQuery('.service__category').click(function () {
        if(jQuery(this).hasClass('expanded')) {
            jQuery('.service__category').removeClass("expanded");
            jQuery('.service__details').removeClass("expanded");
        }else{
            jQuery('.service__category').removeClass("expanded");
            jQuery(this).addClass("expanded");
            jQuery('.service__details').removeClass("expanded");
            jQuery('.service__details--'+jQuery(this).data('service')).addClass('expanded');
        }
    });
    jQuery('.service__details h2').click(function () {
        let parent = jQuery(this).parents('.service__details');
        if(parent.hasClass('expanded')){
            jQuery(this).parents('.service__details').removeClass("expanded");
        }else{
            jQuery('.service__details').removeClass("expanded");
            jQuery(this).parents('.service__details').addClass("expanded");
        }
    });
};
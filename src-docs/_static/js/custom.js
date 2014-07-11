/* global jQuery */

$(document).ready(function() {

    // Remove all anchor tags links from sidebar
    $('.wy-menu a.internal').each(function() {
        var href = $(this).attr('href');
        if (href.indexOf("#") >= 0) {
            $(this).hide();
        }
    });

    // Scroll (fluidly) to anchor tag. Adds margin to sticky navbar.
    $("a[href^='#']").on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(this.hash).offset().top - 50
        }, 300, function(){
        });
    });

});

/**
 * small helper function to urldecode strings
 */
jQuery.urldecode = function(x) {
    return decodeURIComponent(x).replace(/\+/g, ' ');
};

/**
 * small helper function to urlencode strings
 */
jQuery.urlencode = encodeURIComponent;

/**
 * This function returns the parsed url parameters of the
 * current request. Multiple values per key are supported,
 * it will always return arrays of strings for the value parts.
 */
jQuery.getQueryParameters = function(s) {
    if (typeof s == 'undefined')
        s = document.location.search;
    var parts = s.substr(s.indexOf('?') + 1).split('&');
    var result = {};
    for (var i = 0; i < parts.length; i++) {
        var tmp = parts[i].split('=', 2);
        var key = jQuery.urldecode(tmp[0]);
        var value = jQuery.urldecode(tmp[1]);
        if (key in result)
            result[key].push(value);
        else
            result[key] = [value];
    }
    return result;
};

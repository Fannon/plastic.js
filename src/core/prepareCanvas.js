/**
 * Inserts a drawing Canvas which has exactly the same size as the plastic Element
 *
 * TODO: If no size is given, or given by the options -> Consider this
 *
 * TODO: Convert Prototype Code into nice Code (seperate CSS file needed?)
 *
 * @param el
 */
plastic.prepareCanvas = function(el) {

    console.info('plastic.prepareCanvas();');

    el.css('position', 'relative');

    el.append('<div class="plastic-js-display"></div>');
    var displayEl = el.find('.plastic-js-display');
    displayEl
        .height(el.height())
        .width(el.width())
    ;

    el.append('<div class="plastic-js-msg"></div>');
    var msgEl = el.find('.plastic-js-msg');
    msgEl
        .height(el.height())
        .width(el.width())
    ;

};

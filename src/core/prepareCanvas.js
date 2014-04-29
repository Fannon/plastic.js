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

    el.append('<div id="vis"></div>');
    $('#vis')
        .height(el.height())
        .width(el.width())
        .css('overflow', 'scroll')
        .css('padding', '5px')
    ;

    el.append('<div class="messages"></div>');
    $('.messages')
        .height(el.height())
        .width(el.width())
        .css('position', 'absolute')
        .css('top', '0')
        .css('left', '0')
        .css('padding', '5px')
        .css('pointer-events', 'none')
    ;

};

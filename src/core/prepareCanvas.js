/**
 * Inserts a drawing Canvas which has exactly the same size as the plastic Element
 *
 * TODO: If no size is given, or given by the options -> Consider this
 *
 * @param el
 */
plastic.prepareCanvas = function(el) {
    console.info('PREPARING VISUALISATION');

    el.append('<div id="vis"></div>');
    $('#vis')
        .height(el.height())
        .width(el.width())
        .css('overflow', 'scroll')
        .css('padding', '5px')
    ;

};

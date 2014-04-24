/**
 * Helper Function that calls the proper Display Module
 *
 * @param el
 * @param elData
 */
plastic.callDisplayModule = function(el, elData) {

    console.info('callDisplayModule');
    console.dir(elData);

    plastic.prepareCanvas(el);

    var displayModule = plastic.modules.display.registry[elData.options.display].fileName;

    if (displayModule) {
        plastic.modules.display[displayModule](el, elData).render();
    } else {
        plastic.helper.msg('Display Module not found!', 'error');
    }


};

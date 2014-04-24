/**
 * Helper Function that calls the proper Display Module
 *
 * @param elData
 */
plastic.callDisplayModule = function(elData, $el) {

    console.info('callDisplayModule');
    console.dir(elData);

    plastic.prepareCanvas($el);

    var displayModule = plastic.modules.display.registry[elData.options.display].fileName;

    if (displayModule) {
        plastic.modules.display[displayModule](elData);
    } else {
        plastic.helper.msg('Display Module not found!', 'error');
    }


};

/**
 * Helper Function that calls the proper Display Module
 *
 * @param elData
 */
plastic.callDisplay = function(elData) {
    console.info('callDisplay');
    console.dir(elData);

    var displayModule = plastic.modules.display.registry[elData.options.display].fileName;

    if (displayModule) {
        plastic.modules.display[displayModule](elData);
    } else {
        plastic.helper.log('Display Module not found!', 'error');
    }


};

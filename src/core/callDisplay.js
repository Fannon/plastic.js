/* global plastic */

/**
 * Helper Function that calls the proper Display Module
 *
 * @param elData
 */
plastic.callDisplay = function(elData) {
    console.info('callDisplay');
    console.dir(elData);
    var displayModule = plastic.display.available[elData.options.display];
    plastic.display[displayModule](elData);
};

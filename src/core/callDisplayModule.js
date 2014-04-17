/* global plastic */

/**
 * Helper Function that calls the proper Display Module
 *
 * @param elData
 */
plastic.callDisplayModule = function(elData) {
    var displayModule = plastic.display.available[elData.options.display];
    plastic.display[displayModule](elData);
};

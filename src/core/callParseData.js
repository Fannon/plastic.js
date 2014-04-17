/* global plastic */

/**
 * Helper Function that calls the proper ParseData Module
 *
 * @param elData
 */
plastic.callParseData = function(elData) {
    console.info('PARSING DATA');
    console.dir(elData);

    var parser = plastic.dataParser.available[elData.options.dataFormat];

    elData.data = plastic.dataParser[parser](elData.rawData);

    plastic.callDisplay(elData);
};

/**
 * Helper Function that calls the proper ParseData Module
 *
 * @param elData
 */
plastic.callParseData = function(elData) {

    console.info('PARSING DATA');
    console.dir(elData);

    // Look for data parser module in the registry
    var parser = plastic.modules.dataParser.registry[elData.options.dataFormat].fileName;
    console.log('Using Parser: ' + parser);

    if (parser) {
        plastic.modules.dataParser[parser].validate(elData.rawData);
        elData.data = plastic.modules.dataParser[parser].parse(elData.rawData);

        plastic.callDisplay(elData);
    } else {
        plastic.helper.log('Parser Module not found!', 'error');
    }



};

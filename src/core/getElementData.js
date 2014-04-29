/**
 * Gets MetaData (Data/DataURL and Options) from <plastic> Element
 *
 * // TODO: Error Handling
 * // TODO: Remove dependencies on jQuery
 *
 * @param el    Plastic HTML Element selected via jQuery
 */
plastic.getElementData = function(el) {

    console.info('plastic.getElementData();');


    /**
     * Element Data Object.
     * This contains all information that is read from the plastic HTML element
     */
    var elData = {};


    //////////////////////////////////////////
    // GET ELEMENT STYLE                    //
    //////////////////////////////////////////

    // TODO: Case handling if size was not defined (could be 0 height)

    /** Element CSS Style (Contains Width and Height) */
    elData.style = {};

    elData.style.height = 12;
    elData.style.width = 12;


    //////////////////////////////////////////
    // GET OPTIONS DATA                     //
    //////////////////////////////////////////

    /** Element Options */
    elData.options = {}; // mandatory!

    var optionsObject = el.find(".plastic-options");

    if (optionsObject.length > 0) {

        var optionsString = optionsObject[0].text; // TODO: Or .innerText in some cases?

        if (optionsString && optionsString !== '') {

            try {
                elData.options = $.parseJSON(optionsString);
            } catch(e) {
                plastic.helper.msg('Invalid JSON in the Options Object!');
            }

        } else {
            plastic.helper.msg('Empty Obptions Element!', 'error', el);
        }

    } else {
        plastic.helper.msg('No options provided!', 'error', el);
    }


    //////////////////////////////////////////
    // GET QUERY DATA                       //
    //////////////////////////////////////////

    // Get Data-URL
    var queryElement = el.find(".plastic-query");

    if (queryElement.length > 0)  {

        /** Element Query Data */
        elData.query = {};

        elData.query.url = queryElement.attr('data-query-url');
        elData.query.type = queryElement.attr('type');

        var queryString = queryElement[0].text;

        // Trim all Whitespace
        var queryStringStripped = $.trim(queryString.replace(/\s+/g, ' '));

        if (queryString && queryString !== '') {
            elData.query.text = queryStringStripped;
        } else {
            plastic.helper.msg('Empty Query Element!', 'error', el);
        }

    }


    //////////////////////////////////////////
    // GET SCHEMA DATA                      //
    //////////////////////////////////////////

    // Get Data-URL
    var schemaElement = el.find(".plastic-schema");

    if (schemaElement.length > 0)  {

        /** Element Schema Data */
        elData.schema = {};

        elData.schema.type = schemaElement.attr('data-schema-format');

        var schemaString = schemaElement[0].text;

        if (schemaString && schemaString !== '') {
            elData.schema.text = $.parseJSON(schemaString);
        } else {
            plastic.helper.msg('Empty Schema Element!', 'error', el);
        }

    }


    //////////////////////////////////////////
    // GET DATA DATA                        //
    //////////////////////////////////////////

    // Get Data-URL
    var dataElement = el.find(".plastic-data");

    if (dataElement.length > 0) {

        /** Element Data */
        elData.data = {};

        elData.data.url = dataElement.attr('data-url');
        elData.data.parser = dataElement.attr('data-format');

        // If no Data URL given, read Data Object
        if (!elData.data.url) {

            var dataString = dataElement[0].text;

            if (dataString && dataString !== '') {
                elData.data.object = $.parseJSON(dataString);
            } else {
                plastic.helper.msg('Empty Data Element!', 'error', el);
            }

        }

    }



    //////////////////////////////////////////
    // RETURN ELEMENT DATA                  //
    //////////////////////////////////////////

    console.log(elData);
    return elData;


};

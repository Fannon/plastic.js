/* global plastic */

/**
 * Gets MetaData (Data/DataURL and Options) from <plastic> Element
 *
 * // TODO: Error Handling
 *
 * @param el
 */
plastic.getPlasticElementData = function(el) {

    var elData = {};
    var async = false;

    console.info('main.getPlasticData(el)');


    //////////////////////////////////////////
    // DATA                                 //
    //////////////////////////////////////////

    // Get Data-URL
    elData.dataUrl = el.attr('data-url');

    if (elData.dataUrl) { // Get Data from URL if given

        async = true;

        // TODO: Asynchronous Event !!!

        var request = $.ajax(elData.dataUrl)

            .done(function(data) {

                // TODO: Prüfen ob data schon Objekt ist oder noch erst JSON.parsed werden muss
                console.log('Getting Data from URL via AJAX');

                try {
                    if (data !== null && typeof data === 'object') {
                        elData.rawData = data;
                    } else {
                        elData.rawData = $.parseJSON(data);
                    }
                } catch(e) {
                    console.error(e);
                }

                console.log('Received asynchronous data.');
                plastic.callParseData(elData);
            })
            .fail(function() {
                console.error( "error" );
            })
            .always(function() {

            });


    } else {
        // Else: Get data from script tag

        var dataObject = el.find(".plastic-data");

        if (dataObject.length > 0) {
            var dataString = dataObject[0].text;
            console.log(dataString);
            if (dataString && dataString !== '') {
                elData.rawData = $.parseJSON(dataString);
            } else {
                console.log('Empty Element!');
            }
        } else {
            console.log('No Data Object');
        }
    }

    //////////////////////////////////////////
    // OPTIONS                              //
    //////////////////////////////////////////

    var optionsObject = el.find(".plastic-options");

    if (optionsObject.length > 0) {
        var optionsString = optionsObject[0].text;
        if (optionsString && optionsString !== '') {
            elData.options = JSON.parse(optionsString);
        } else {
            console.log('Empty Element!');
        }
    } else {
        console.log('No Options Object');
    }

    elData.height = el.height();
    elData.width = el.width();

    if (!async) {
        console.log('Received Synchronous Data');
        plastic.callParseData(elData);
    }

};

/* global plastic */

/**
 * Gets MetaData (Data/DataURL and Options) from <plastic> Element
 *
 * // TODO: Error Handling
 *
 * @param $el    Plastic HTML Element selected via jQuery
 */
plastic.getPlasticElementData = function($el) {

    var elData = {};
    var async = false;
    var request;

    console.info('main.getPlasticData(el)');


    //////////////////////////////////////////
    // GET GENERAL DATA                     //
    //////////////////////////////////////////

    elData.height = $el.height();
    elData.width = $el.width();

    // TODO: Integrate this with width and height from options (?)
    // TODO: Case handling if size was not defined (could be 0 height)


    //////////////////////////////////////////
    // GET DATA DATA                        //
    //////////////////////////////////////////

    // Get Data-URL
    elData.dataUrl = $el.find(".plastic-data").attr('data-url');

    if (elData.dataUrl) { // Get Data from URL if given

        async = true;

        // TODO: Asynchronous Event !!!

        request = $.ajax(elData.dataUrl)

            .fail(function() {
                console.error( "error" );
            })
            .always(function() {

            });

    } else {
        // Else: Get data from script tag

        var dataObject = $el.find(".plastic-data");

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
    // GET OPTIONS DATA                     //
    //////////////////////////////////////////

    var optionsObject = $el.find(".plastic-options");
    plastic.o = optionsObject;

    console.log('$el.find(".plastic-options");');
//    console.dir(optionsObject);

    if (optionsObject.length > 0) {
        var optionsString = optionsObject[0].text; // TODO: Or .innerText in some cases?
        console.log(optionsString);
        if (optionsString && optionsString !== '') {
            elData.options = $.parseJSON(optionsString);
        } else {
            console.log('Empty Element!');
        }
    } else {
        console.log('No Options Object');
    }

    //////////////////////////////////////////
    // GET SCHEMA DATA                      //
    //////////////////////////////////////////

    // TODO


    //////////////////////////////////////////
    // GET QUERY DATA                       //
    //////////////////////////////////////////

    // TODO


    //////////////////////////////////////////
    // VALIDATE AND PASSING ON              //
    //////////////////////////////////////////

    if (!async) {
        console.log('Received Synchronous Data');
        plastic.callParseData(elData);
    } else {
        request.done(function(data) {

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
        });
    }





};

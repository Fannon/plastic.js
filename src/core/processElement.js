/**
 * Process a specific plastic element
 * This initiates all the main steps to
 *
 * @param $el
 * @param elData
 */
plastic.processElement = function($el, elData) {

    var async = false;
    var request;


    if (elData.dataUrl) { // Get Data from URL if given

        async = true;


        request = $.ajax(elData.dataUrl)
            .fail(function() {
                plastic.helper.msg('Could not get Data from URL ' + elData.dataUrl, "error", $el );
            })
            .always(function() { });

    }


    if (!async) {
        console.msg('Received Synchronous Data');
        plastic.callParseData(elData);
    } else {
        request.done(function(data) {

            // TODO: Prüfen ob data schon Objekt ist oder noch erst JSON.parsed werden muss
            console.msg('Getting Data from URL via AJAX');

            try {
                if (data !== null && typeof data === 'object') {
                    elData.rawData = data;
                } else {
                    elData.rawData = $.parseJSON(data);
                }
            } catch(e) {
                console.error(e);
            }

            console.msg('Received asynchronous data.');

            plastic.callParseData(elData);
        });
    }

}
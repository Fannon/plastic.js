/**
 * Process a specific plastic element
 *
 * This initiates all the main steps necessary to create a Data Display
 *
 * The Main Steps are:
 *  1 IF Query provided         Calling the Query Parser
 *  2 IF Data URL provided      Getting the Data via AJAX
 *  3 ALWAYS                    Calling the Data Parser
 *  4 IF Schema provided        Calling the Schema Parser
 *  5 ALWAYS                    Calling the Display Module
 *
 * @param $el
 * @param elData
 */
plastic.processElement = function($el, elData) {

    console.info('plastic.processElement();');

    var async = false;


    //////////////////////////////////////////
    // CALLING QUERY PARSER                 //
    //////////////////////////////////////////

    if (elData.query) { // OPTIONAL
        // TODO
    }


    //////////////////////////////////////////
    // GETTING DATA VIA URL                 //
    //////////////////////////////////////////


    if (elData.data.url) { // OPTIONAL: Get Data asyncronally from URL (if given)

        async = true;

         var request = $.ajax(elData.data.url)
            .fail(function() {
                plastic.helper.msg('Could not get Data from URL ' + elData.dataUrl, "error", $el );
            })
            .done(function(data) {

                // TODO: Prüfen ob data schon Objekt ist oder noch erst JSON.parsed werden muss
                console.msg('Getting Data from URL via AJAX');

                try {
                    if (data !== null && typeof data === 'object') {
                        elData.data.object = data;
                    } else {
                        elData.rawData = $.parseJSON(data);
                    }
                } catch(e) {
                    console.error(e);
                }

                console.msg('Received asynchronous data.');

                plastic.callDataParser(elData);


            })
            .always(function() {

            })
        ;

    }

    //////////////////////////////////////////
    // CALLING THE DATA PARSER              //
    //////////////////////////////////////////

    if (!async) {
        console.msg('Received Synchronous Data');
        plastic.callDataParser(elData);
    } else {
        // Data will be sent within the "Getting Data via URL Function when its done"
    }


    //////////////////////////////////////////
    // CALLING SCHEMA PARSER                 //
    //////////////////////////////////////////

    if (elData.schema) { // OPTIONAL
        // TODO
    }


    //////////////////////////////////////////
    // CALLING DISPLAY MODULE               //
    //////////////////////////////////////////

    function callDisplayModule() {

    }

    // TODO: Wait for Data if requested via AJAX




}
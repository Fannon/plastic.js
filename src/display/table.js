/**
 * Created by fannon on 09.04.2014.
 */
/* global plastic */

plastic.display.table = (function () {

    var privateCounter = 0;

    function privateFunction() {
        privateCounter++;
    }

    function publicFunction() {
        console.log('TEST');
        privateFunction();
    }

    return {
        start: publicFunction
    };

})();

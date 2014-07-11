Display Modules
===============

JavaScript
----------

Set up your Module Manager with the module name and dependencies:

::

    plastic.modules.moduleManager.register({
        moduleType: 'display',
        apiName: 'test-chart',
        className: 'TestChart',
        dependencies: []
    });

Getting the data from the html file and defining the module presets:

::

    plastic.modules.display.PieChart = function($el, elAttr) {
        "use strict";

        this.$el = $el;
        this.elAttr = elAttr;

        this.displayOptionsSchema = {

            "$schema": "http://json-schema.org/draft-04/schema#",
            "title": "Test Chart",

            "type": "object",
            "properties": {},
            "additionalProperties": false,
            "required": []

        };

        this.processedDataSchema = {};

    };

Prototype your Test Chart:

::

    plastic.modules.display.PieChart.prototype = {

        validate: function () {

        };

        execute function () {

        };

        mapData: function (data) {

        };

        update: function () {

        };

    };


Use the validation:

::

    validate: function () {
        "use strict";

        return false; // No Errors
    },

Define the visuals of your module:

::

    execute: function () {
        "use strict";

        var data = this.elAttr.data.processed;

        var svg = this.$el.append('<svg></svg>');

        var options = this.elAttr.display.options;

        var mappedData = this.mapData(data);

        var visualisation;

        ////////////////
        //Visual Stuff//
        ////////////////

        return visualisation;

    },

Map the source-data to your visualsiation:

::

    mapData: function(data) {
        "use strict";

        var mappedData = [];

        /////////////////
        //Mapping Stuff//
        /////////////////

        return mappedData;
    },

And update your visualisation if something has changed:

::

    update: function() {
        "use strict";

        this.execute();
    }



HTML
----





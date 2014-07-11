Display Modules
===============

JavaScript
----------

**1.** Set up your Module Manager with the module name and dependencies:

.. code-block:: javascript

    plastic.modules.moduleManager.register({
        moduleType: 'display',
        apiName: 'test-chart',
        className: 'TestChart',
        dependencies: []
    });

| The *moduleType* is always 'display' - because its a Display Module.
| The *apiName* can be everything.
| The *className* should be aligned with the *apiName*
| Within the *dependencies* array, you can set libraries your Display Module uses if you don't want to load them in your html file. At the moment only d3.js, c3.js, nvd3.js and dataTable.js are supported from the dependencyManager.
|
|

**2.** Getting the data from the html file and defining the module property presets:

.. code-block:: javascript

    plastic.modules.display.PieChart = function($el, elAttr) {
        "use strict";

        this.$el = $el;
        this.elAttr = elAttr;

        this.displayOptionsSchema = {

            "$schema": "http://json-schema.org/draft-04/schema#",
            "title": "Test Chart",

            "type": "object",
            "properties": {
                "testProperty": {
                    "title": "Test Property",
                    "description": "To test a property",
                    "type": "number",
                    "default": 666,
                    "minimum": 0,
                    "maximum": 1000
                }
            },
            "additionalProperties": false,
            "required": []

        };

        this.processedDataSchema = {};

    };

| Within the *properties* object, you can define property presets and their minimum, maximum or defaults.
| The entities within the *testProperty* are adjusted to work with our automatic generated option documentation and should be used in the same way.
|
|

**3.** Prototype your Test Chart:

.. code-block:: javascript

    plastic.modules.display.PieChart.prototype = {

        validate: function () {

        },

        execute function () {

        },

        mapData: function (data) {

        },

        update: function () {

        }

    };


**4.** Use the validation:

.. code-block:: javascript

    validate: function () {
        "use strict";

        return false; // No Errors
    },

**5.** Define the visuals of your module:

.. code-block:: javascript

    execute: function () {
        "use strict";

        var data = this.elAttr.data.processed;

        var svg = this.$el.append('<svg></svg>');

        var options = this.elAttr.display.options;

        var mappedData = this.mapData(data);

        var visualisation;

        //////////////////
        // Visual Stuff //
        //////////////////

        return visualisation;

    },


**6.** Map the source-data to your visualisation:

.. code-block:: javascript

    mapData: function(data) {
        "use strict";

        var mappedData = [];

        ///////////////////
        // Mapping Stuff //
        ///////////////////

        return mappedData;
    },

**7.** And update your visualisation if something has changed:

.. code-block:: javascript

    update: function() {
        "use strict";

        this.execute();
    }


HTML
----

Adding a plastic-js div in your html file.

.. code-block:: html

    <div id="test-sparql-query" class="plastic-js" style="height: 300px; width: 100%;">

        <script class="plastic-data" type="application/json" data-url="../data/test.json" data-format="sparql-json"></script>

        <script class="plastic-display" data-display-module="test-chart" type="application/json">
            {
                "testProperty": 333
            }
        </script>

    </div>

|




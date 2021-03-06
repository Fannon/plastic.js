var fs = require('fs');

// Modules to process
var displayModules = [
    "SimpleTable",
    "AdvancedTable",
    "DiscreteBarChart",
    "PieChart",
    "CumulativeLineChart"
];

// Fake plastic.js object
var plastic = {
    modules: {
        display: {
            registry: {}
        },
        data: {
            registry: {}
        },
        moduleManager: {
            register: function(moduleInfo) {
                "use strict";
                plastic.modules[moduleInfo.moduleType].registry[moduleInfo.className] = moduleInfo;
            }
        }
    }
};

// Load Dependenies from dependencyManager
var dependencyManager = fs.readFileSync('../src/modules/dependencyManager.js');
eval(dependencyManager.toString());
var dependencyRegistry = plastic.modules.dependencyManager.registry;


//////////////////////////////////////////
// DISPLAY MODULES                      //
//////////////////////////////////////////

/**
 * Generates HTML Documentation from JSON Schema Objects
 *
 * @param schema
 */
var generateDisplayDocumentation = function(schema, moduleInfos, title) {
    "use strict";


    //////////////////////////////////////////
    // Snippet Code                         //
    //////////////////////////////////////////

    var rst = '';
    var defaultOptions = {};

    rst += 'This example snippet contains all available options with their default values:\n\n';
    rst += '.. code-block:: html\n\n';
    rst += '    <script class="plastic-display" data-module="' + moduleInfos.apiName + '" type="application/json> \n';
    rst += '        {\n';

    for (var propertyName in schema.properties) {
        rst += '            "' + propertyName + '": ' + JSON.stringify(schema.properties[propertyName].default) + '\n';
    }

    rst += '        }\n';
    rst += '    </script>\n\n';

    fs.writeFileSync('../src-docs/_includes/display/' + title + '_snippet.rst', rst, {flag: 'w'});


    //////////////////////////////////////////
    // Properties Details                   //
    //////////////////////////////////////////

    var html = '';

    html += '<h4>Properties details:</h4>\n';

    for (propertyName in schema.properties) {

        var property = schema.properties[propertyName];
        var propertyTitle = property.title || propertyName;

        html += '<div class="property-description">';

        html += '<h4>' + propertyTitle + '</h4>\n';

        html += '<table class="table">\n';

        if (property.description) {
            html += '   <tr class="description"><td><strong>Description</strong></td><td>' + property.description + '</td></tr>\n';
        }

        html += '   <tr class="keyword"><td><strong>Keyword</strong></td><td>' + propertyName + '</td></tr>\n';

        if (property.type) {
            html += '   <tr class="type"><td><strong>Type</strong></td><td>' + property.type + '</td></tr>\n';
        }

        if (property.default) {
            html += '   <tr class="defaul"><td><strong>Default</strong></td><td>' + JSON.stringify(property.default) + '</td></tr>\n';
        }

        if (property.minimum) {
            html += '   <tr class="minimum"><td><strong>Minimum</strong></td><td>' + property.minimum + '</td></tr>\n';
        }

        if (property.maximum) {
            html += '   <tr class="maximum"><td><strong>Maximum</strong></td><td>' + property.maximum + '</td></tr>\n';
        }

        html += '</table>\n\n';

        html += '<pre class="highlight">"' + propertyName + '": ' + JSON.stringify(property.default) + '</pre>';

        html += '</div>';
    }

    fs.writeFileSync('../src-docs/_includes/display/' + title + '_options.html', html, {flag: 'w'});


    //////////////////////////////////////////
    // Dependencies Details                 //
    //////////////////////////////////////////

    rst = '';

    rst += '.. note:: plastic.js manages the dependencies automatically. There is no need to include them manually, ';
    rst += 'but you can do so if you want.\n\n';

    for (var i = 0; i < moduleInfos.dependencies.length; i++) {

        var depName = moduleInfos.dependencies[i];
        var dep = dependencyRegistry[depName];

        rst += dep.title + '\n';
        rst += '............\n';
        rst += '* **Website**: ' + dep.website + '\n';
        rst += '* **Version**: ' + dep.version + '\n';

        if (dep.js) {
            rst += '* **JavaScript**: http:' + dep.js.join(', http:') + '\n';
        }

        if (dep.css) {
            rst += '* **CSS**: http:' + dep.css.join(', http:') + '\n';
        }

        rst += '\n';
    }

    if (rst === '') {
        rst += 'No dependencies.';
    }

    fs.writeFileSync('../src-docs/_includes/display/' + title + '_deps.rst', rst, {flag: 'w'});



};


// Iterate all modules, and get the Display Options Schema out of it
for (var i = 0; i < displayModules.length; i++) {

    var moduleName = displayModules[i];
    console.log('> Generating docs from schema: ' + moduleName);

    try {

        var file = fs.readFileSync('../src/modules/display/' + moduleName + '.js');

        // Evil
        eval(file.toString());

        var instance = new plastic.modules.display[moduleName]();
        var moduleInfos = plastic.modules.display.registry[moduleName];

        generateDisplayDocumentation(instance.displayOptionsSchema, moduleInfos, moduleName);

    } catch (e) {
        console.warn('> [ERROR] Could not process: ' + moduleName);
    }

}






var fs = require('fs');

// Modules to process
var processModules = [
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
        moduleManager: {
            register: function(moduleInfo) {
                "use strict";
                plastic.modules[moduleInfo.moduleType].registry[moduleInfo.className] = moduleInfo;
            }
        }
    }
};

/**
 * Generates HTML Documentation from JSON Schema Objects
 *
 * @param schema
 */
var generateDocumentation = function(schema, moduleInfos, title) {
    "use strict";

    var moduleName = schema.title || title;

    var html = '';
    var defaultOptions = {};

    html += '<p>This example snippet contains all available options with their default values:</p>\n';
    html += '<pre class="highlight">';
    html += '&lt;script class="plastic-display" data-display-module="' + moduleInfos.apiName + '" type="application/json"&gt; \n';

    for (var propertyName in schema.properties) {
        var property = schema.properties[propertyName];
        defaultOptions[propertyName] = property.default || undefined;
    }
    html += JSON.stringify(defaultOptions, false, 4);
    html += '\n&lt;/script&gt\n';
    html += '</pre>\n\n';

    html += '<h4>Properties in detail:</h4>\n';

    for ( propertyName in schema.properties) {

        property = schema.properties[propertyName];

        var propertyTitle = property.title || propertyName;

        html += '<div class="property-description">';

        html += '<h4>' + propertyTitle + '</h4>\n';

        html += '<table class="table">\n';

        html += '   <tr class="keyword"><td><strong>Keyword</strong></td><td>' + propertyName + '</td></tr>\n';

        if (property.description) {
            html += '   <tr class="description"><td><strong>Description</strong></td><td>' + property.description + '</td></tr>\n';
        }

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

        var example = {};
        example[propertyName] = property.default;

        html += '<pre class="highlight">' + JSON.stringify(example, false, 4) + '</pre>';

        html += '</div>';
    }

    fs.writeFileSync('../src-docs/_includes/schemas/' + title + '.html', html, {flag: 'w'});

};


// Iterate all modules, and get the Display Options Schema out of it
for (var i = 0; i < processModules.length; i++) {

    var moduleName = processModules[i];
    console.log('> Generating docs from schema: ' + moduleName);

    try {

        var file = fs.readFileSync('../src/modules/display/' + moduleName + '.js');
        eval(file.toString());

        var instance = new plastic.modules.display[moduleName]();
        var moduleInfos = plastic.modules.display.registry[moduleName];

        generateDocumentation(instance.displayOptionsSchema, moduleInfos, moduleName);

    } catch (e) {
        console.warn('> [ERROR] Could not process: ' + moduleName);
    }

}






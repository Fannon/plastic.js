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
        display: {},
        moduleManager: {
            register: function() {
                "use strict";
                return false;
            }
        }
    }
};

/**
 * Generates HTML Documentation from JSON Schema Objects
 *
 * @param schema
 */
var generateDocumentation = function(schema, title) {
    "use strict";
//    console.dir(schema);

//    var moduleName = schema.title || title;
    var description = schema.description || '';

    var html = '';
//    var html = '<h3>' + moduleName + '</h3>\n';
//    html += '<p class="description">' + description + '</p>\n\n';


    for (var propertyName in schema.properties) {
        var property = schema.properties[propertyName];
        console.log('');
        console.log(property);

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

    fs.writeFileSync('../docs/source/_includes/schemas/' + title + '.html', html, {flag: 'w'});

};


// Iterate all modules, and get the Display Options Schema out of it
for (var i = 0; i < processModules.length; i++) {
    var moduleName = processModules[i];

    var file = fs.readFileSync('../src/modules/display/' + moduleName + '.js');
    eval(file.toString());
    var instance = new plastic.modules.display[moduleName]();

    generateDocumentation(instance.displayOptionsSchema, moduleName);
}






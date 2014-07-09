var fs = require('fs');

// Modules to process
var processModules = [
    "AdvancedTable",
    "DiscreteBarChart"
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

    var moduleName = schema.title || title;
    var description = schema.description || '';

    var html = '<h3>' + moduleName + '</h3>\n';
    html += '<p class="description">' + description + '</p>\n\n';


    for (var propertyName in schema.properties) {
        var property = schema.properties[propertyName];
        console.log('');
        console.log(property);

        var propertyTitle = property.title || propertyName;

        html += '<h4>' + propertyTitle + '</h4>\n';

        if (property.description) {
            html += '<p class="description"><strong>Description: </strong>' + property.description + '</p>\n';
        }

        html += '<ul>\n';

        html += '   <li class="keyword"><strong>Keyword: </strong>' + propertyName + '</li>\n';

        if (property.type) {
            html += '   <li class="type"><strong>Type: </strong>' + property.type + '</li>\n';
        }

        if (property.default) {
            html += '   <li class="default"><strong>Default: </strong>' + property.default + '</li>\n';
        }

        if (property.minimum) {
            html += '   <li class="type"><strong>Minimum: </strong>' + property.minimum + '</li>\n';
        }

        if (property.maximum) {
            html += '   <li class="type"><strong>Maximum: </strong>' + property.maximum + '</li>\n';
        }

        html += '</ul>\n\n';

    }

    fs.writeFileSync('../docs/source/_includes/schemas/' + moduleName + '.html', html, {flag: 'w'});

};


// Iterate all modules, and get the Display Options Schema out of it
for (var i = 0; i < processModules.length; i++) {
    var moduleName = processModules[i];

    var file = fs.readFileSync('../src/modules/display/' + moduleName + '.js');
    eval(file.toString());
    var instance = new plastic.modules.display[moduleName]();

    generateDocumentation(instance.displayOptionsSchema, moduleName);
}






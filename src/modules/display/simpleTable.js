/**
 * Table Display Module
 *
 * Revealing Module Pattern
 * http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript
 * @namespace
 */
plastic.modules.display.simpleTable = (function () {

    var name = 'Simple Table Display Module';
    var apiName = 'simple-table';
    var fileName = 'simpleTable';
    var dependencies = ['d3'];

    /**
     * Validate
     * @param elData
     * @returns {boolean}
     */
    var validate = function(elData) {
        return true;
    };

    /**
     * Render
     * @param el
     * @param elData
     * @returns {*}
     */
    var render = function(el, elData) {

        console.info('plastic.modules.display.table();');

        var $el = el.find('.plastic-js-display')[0];
        console.dir($el);

        var data = elData.data.object;
        var vis = d3.select($el);

        var table = vis.append("table");
        var thead = table.append("thead");
        var tbody = table.append("tbody");

        // Get Columns from Data
        var columns = [];
        for (var o in data[0]) {
            if (data[0].hasOwnProperty(o)) {
                columns.push(o);
            }
        }

        // Create Header Row (TH)
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) {
                return column;
            });

        // Create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // Create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {
                        column: column,
                        value: row[column]
                    };
                });
            })
            .enter()
            .append("td")
            .html(function(d) {
                return d.value;
            });

        // Twitter Bootstrap Classes
        $('table').addClass('table table-condensed');

//        throw new Error('test');

        return table;

    };


    // Make Functions public
    return {
        name: name,
        apiName: apiName,
        fileName: fileName,
        dependencies: dependencies,

        /**
         * Validate
         */
        validate: validate,
        render: render,
        update: render // TODO: Write Update Function
    };

})();

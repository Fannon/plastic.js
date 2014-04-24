/**
 * Table Display Module
 */
plastic.modules.display.table = (function () {

    var validate = function(elData) {
        return true;
    };

    var render = function(el, elData) {

        console.info('DISPLAY MODULE: TABLE');
        console.dir(elData);

        var data = elData.data;
        var vis = d3.select("#vis");

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

        return table;

    };


    // Make Functions public
    return {
        validate: validate,
        render: render
    };

})();
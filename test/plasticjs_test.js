(function ($, plastic) {
    /*
     ======== A Handy Little QUnit Reference ========
     http://api.qunitjs.com/

     Test methods:
     module(name, {[setup][ ,teardown]})
     test(name, callback)
     expect(numberOfAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     throws(block, [expected], [message])
     */

    module('plastic');

    test('has version number', function () {
        ok(plastic.version, "should have a Version numbers");
        strictEqual(plastic.version, '0.0.1', 'Current Version');
    });

    module('plastic.display');

    test('Table Display module', function () {
        ok(plastic.display.table, "has a tableDisplay Module");
    });


}(jQuery, plastic));

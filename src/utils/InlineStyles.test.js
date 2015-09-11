/*global giant */
(function () {
    "use strict";

    module("Inline Styles");

    test("Serialization", function () {
        var inlineStyles = giant.InlineStyles.create()
            .setItem('foo', 'bar')
            .setItem('hello', 'world');

        equal(inlineStyles.toString(), 'foo: bar; hello: world',
            "should return semicolon-separated style key-value pairs");
    });
}());

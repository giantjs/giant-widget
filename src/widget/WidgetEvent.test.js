/*global giant */
(function () {
    "use strict";

    module("WidgetEvent");

    test("Conversion from Event", function () {
        var widgetEvent = giant.Event.create('widget.foo', giant.widgetEventSpace);
        ok(widgetEvent.isA(giant.WidgetEvent), "should return WidgetEvent instance");
    });
}());

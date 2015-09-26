(function () {
    "use strict";

    module("WidgetEvent");

    test("Conversion from Event", function () {
        var widgetEvent = $event.Event.create('widget.foo', $widget.widgetEventSpace);
        ok(widgetEvent.isA($widget.WidgetEvent), "should return WidgetEvent instance");
    });
}());

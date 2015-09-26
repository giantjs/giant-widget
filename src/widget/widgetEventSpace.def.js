$oop.postpone($widget, 'widgetEventSpace', function () {
    "use strict";

    /**
     * Event space dedicated to widget events.
     * @type {$event.EventSpace}
     */
    $widget.widgetEventSpace = $event.EventSpace.create();
});

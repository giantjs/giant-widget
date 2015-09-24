/*global giant */
$oop.postpone(giant, 'widgetEventSpace', function () {
    "use strict";

    /**
     * Event space dedicated to widget events.
     * @type {$event.EventSpace}
     */
    giant.widgetEventSpace = $event.EventSpace.create();
});

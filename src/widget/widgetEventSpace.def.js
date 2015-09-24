/*global giant */
$oop.postpone(giant, 'widgetEventSpace', function () {
    "use strict";

    /**
     * Event space dedicated to widget events.
     * @type {giant.EventSpace}
     */
    giant.widgetEventSpace = giant.EventSpace.create();
});

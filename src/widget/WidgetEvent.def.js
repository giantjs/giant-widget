/*global giant */
$oop.postpone(giant, 'WidgetEvent', function () {
    "use strict";

    var base = $event.Event;

    /**
     * Creates a WidgetEvent instance.
     * Do not instantiate this class directly. Spawn events on the event space `giant.widgetEventSpace`,
     * or an Evented instance, like a Widget.
     * WidgetEvent may also be instantiated by creating an `$event.Event` with `giant.WidgetEventSpace`
     * specified as event space.
     * @name giant.WidgetEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {$event.EventSpace} eventSpace Event space associated with event
     * @returns {giant.WidgetEvent}
     */

    /**
     * The WidgetEvent implements special event features for widgets.
     * @class
     * @extends $event.Event
     */
    giant.WidgetEvent = base.extend();
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate(giant, 'WidgetEvent', function (eventName) {
            var prefix = 'widget';
            return eventName.substr(0, prefix.length) === prefix;
        });
});

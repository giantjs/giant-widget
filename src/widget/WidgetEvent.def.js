/*global giant */
giant.postpone(giant, 'WidgetEvent', function () {
    "use strict";

    var base = giant.Event;

    /**
     * Creates a WidgetEvent instance.
     * Do not instantiate this class directly. Spawn events on the event space `giant.widgetEventSpace`,
     * or an Evented instance, like a Widget.
     * WidgetEvent may also be instantiated by creating an `giant.Event` with `giant.WidgetEventSpace`
     * specified as event space.
     * @name giant.WidgetEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {giant.EventSpace} eventSpace Event space associated with event
     * @returns {giant.WidgetEvent}
     */

    /**
     * The WidgetEvent implements special event features for widgets.
     * @class
     * @extends giant.Event
     */
    giant.WidgetEvent = base.extend();
});

giant.amendPostponed(giant, 'Event', function () {
    "use strict";

    giant.Event
        .addSurrogate(giant, 'WidgetEvent', function (eventName) {
            var prefix = 'widget';
            return eventName.substr(0, prefix.length) === prefix;
        });
});

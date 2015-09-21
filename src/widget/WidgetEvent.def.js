/*global giant */
giant.postpone(giant, 'WidgetEvent', function () {
    "use strict";

    var base = giant.Event,
        self = base.extend();

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
    giant.WidgetEvent = self
        .addMethods(/** @lends giant.WidgetEvent# */{
            /**
             * @param {string} [eventName]
             * @param {giant.EventSpace} [eventSpace]
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Widget from which the event originated.
                 * @type {giant.Widget}
                 */
                this.senderWidget = undefined;
            },

            /**
             * Sets `senderWidget` property.
             * @param {giant.Widget} senderWidget
             * @returns {giant.WidgetEvent}
             */
            setSenderWidget: function (senderWidget) {
                giant.isWidget(senderWidget, "Invalid sender widget");
                this.senderWidget = senderWidget;
                return this;
            },

            /**
             * Clones Event instance. Copies `senderWidget` reference to the new event instance.
             * @returns {giant.WidgetEvent}
             */
            clone: function () {
                return base.clone.apply(this, arguments)
                    .setSenderWidget(this.senderWidget);
            }
        });
});

giant.amendPostponed(giant, 'Event', function () {
    "use strict";

    giant.Event
        .addSurrogate(giant, 'WidgetEvent', function (eventName) {
            var prefix = 'widget';
            return eventName.substr(0, prefix.length) === prefix;
        });
});

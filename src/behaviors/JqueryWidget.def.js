$oop.postpone($widget, 'JqueryWidget', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        $document = document && $(document);

    /**
     * The JqueryWidget trait adds class-level (delegated) jQuery event subscription capability to the host.
     * When used on other traits, call methods directly on JqueryWidget.
     * @class
     * @extends $oop.Base
     * @extends $widget.Widget
     */
    $widget.JqueryWidget = self
        .addPrivateMethods(/** @lends $widget.JqueryWidget */{
            /**
             * @param {string} eventName
             * @param {string} selector
             * @param {function} handler
             * @private
             */
            _jqueryOnProxy: function (eventName, selector, handler) {
                if ($document) {
                    $document.on(eventName, selector, handler);
                }
            },

            /**
             * @param {string} eventName
             * @param {string} selector
             * @param {function} [handler]
             * @private
             */
            _jqueryOffProxy: function (eventName, selector, handler) {
                if ($document) {
                    $document.off(eventName, selector, handler);
                }
            },

            /**
             * @param {string} selector
             * @returns {string}
             * @private
             */
            _getGlobalSelector: function (selector) {
                var className = this.className,
                    classSelector = '.' + className;

                return className ?
                    selector.indexOf(classSelector) === -1 ?
                        classSelector + ' ' + selector :
                        selector :
                    selector;
            }
        })
        .addMethods(/** @lends $widget.JqueryWidget */{
            /**
             * Subscribes to DOM events, jQuery-style.
             * @param {string} eventName
             * @param {string} selector
             * @param {string} methodName
             * @returns {$widget.JqueryWidget}
             */
            on: function (eventName, selector, methodName) {
                var globalSelector = this._getGlobalSelector(selector),
                    className = this.className;

                this._jqueryOnProxy(eventName, globalSelector, function (/**jQuery.Event*/event) {
                    var widget = event.originalEvent.toWidget(className);
                    return widget ?
                        widget[methodName].apply(widget, arguments) :
                        undefined;
                });

                return this;
            },

            /**
             * Unsubscribes from DOM events, jQuery-style.
             * @param {string} eventName
             * @param {string} selector
             * @returns {$widget.JqueryWidget}
             */
            off: function (eventName, selector) {
                var globalSelector = this._getGlobalSelector(selector);

                this._jqueryOffProxy(eventName, globalSelector);

                return this;
            }
        });
}, jQuery);

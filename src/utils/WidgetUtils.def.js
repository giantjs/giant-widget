$oop.postpone($widget, 'WidgetUtils', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * The WidgetUtils class is a static class containing general purpose utilities used by widgets.
     * @class
     * @extends $oop.Base
     */
    $widget.WidgetUtils = self
        .addConstants(/** @lends $widget.WidgetUtils */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_ESCAPE_CHARS: /[&<>"'\n]|{{|}}/g,

            /**
             * @type {object}
             * @constant
             */
            ENTITY_MAP: {
                '&' : '&amp;',
                '<' : '&lt;',
                '>' : '&gt;',
                '"' : '&quot;',
                '\'': '&#39;',
                '{{': '&#123;&#123;',
                '}}': '&#125;&#125;'
            }
        })
        .addMethods(/** @lends $widget.WidgetUtils */{
            /**
             * Replace callback function for escaping HTML entities.
             * @param {string} hit
             * @returns {string}
             */
            replaceHtmlEntity: function (hit) {
                return self.ENTITY_MAP[hit] || hit;
            },

            /**
             * Escapes HTML entities, quotes, and placeholder markers in the specified text.
             * @param {string} text
             * @returns {string} Escaped string.
             */
            htmlEscape: function (text) {
                return text.replace(self.RE_ESCAPE_CHARS, this.replaceHtmlEntity);
            },

            /**
             * Retrieves the closest parent node of the specified element that has the specified CSS class.
             * @param {HTMLElement} element
             * @param {string} className
             * @returns {HTMLElement}
             */
            getParentNodeByClassName: function (element, className) {
                var classList;
                while (element && (element.classList || element.className)) {
                    classList = element.classList && slice.call(element.classList) ||
                        element.className.split(/\s+/);
                    if (classList && classList.indexOf(className) > -1) {
                        return element;
                    }
                    element = element.parentNode;
                }
                return undefined;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to HTML escaped string.
         * @returns {string}
         */
        toHtml: function () {
            return $widget.WidgetUtils.htmlEscape(this);
        }
    });
}());

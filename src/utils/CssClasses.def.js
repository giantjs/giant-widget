$oop.postpone($widget, 'CssClasses', function () {
    "use strict";

    var base = $data.Collection,
        self = base.extend();

    /**
     * Creates a CssClasses instance.
     * @name $widget.CssClasses.create
     * @function
     * @param {object|Array} [items] Initial contents.
     * @returns {$widget.CssClasses}
     */

    /**
     * The CssClasses class is a serializable Collection of CSS class names.
     * @class
     * @extends $oop.Base
     */
    $widget.CssClasses = self
        .addMethods(/** @lends $widget.CssClasses# */{
            /**
             * Adds specified CSS class to the collection.
             * @param {string} cssClass
             * @returns {$widget.CssClasses}
             */
            addCssClass: function (cssClass) {
                var refCount = this.getItem(cssClass) || 0;
                this.setItem(cssClass, refCount + 1);
                return this;
            },

            /**
             * Decreases reference count on the specified CSS class.
             * Removes CSS class when reference count drops below 1.
             * @param {string} cssClass
             * @returns {$widget.CssClasses}
             */
            decreaseRefCount: function (cssClass) {
                var refCount = this.getItem(cssClass) || 0;
                if (refCount > 1) {
                    this.setItem(cssClass, refCount - 1);
                } else {
                    this.deleteItem(cssClass);
                }
                return this;
            },

            /**
             * Removes specified CSS class from the collection.
             * @param {string} cssClass
             * @returns {$widget.CssClasses}
             */
            removeCssClass: function (cssClass) {
                this.deleteItem(cssClass);
                return this;
            },

            /**
             * Serializes CSS classes into a space separated string that can be used as an HTML "class" attribute.
             * @example
             * $widget.CssClasses.create()
             *     .addCssClass('foo')
             *     .addCssClass('bar')
             *     .toString() // "foo bar"
             * @returns {string}
             */
            toString: function () {
                return this
                    .getKeys()
                    .sort()
                    .join(' ');
            }
        });
});

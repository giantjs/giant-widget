/*global giant, giant, giant, giant */
giant.postpone(giant, 'InlineStyles', function () {
    "use strict";

    var base = giant.Collection,
        self = base.extend();

    /**
     * Creates an InlineStyles instance.
     * @name giant.InlineStyles.create
     * @function
     * @param {object|Array} [items] Initial contents.
     * @returns {giant.InlineStyles}
     */

    /**
     * The InlineStyles class is a collection of style key-value pairs that can be
     * serialized in the correct style definition format.
     * @class
     * @extends giant.Collection
     */
    giant.InlineStyles = self
        .addMethods(/** @lends giant.InlineStyles# */{
            /**
             * Serializes style collection so that it can be used in a tag as attribute.
             * The order of styles is not determined.
             * @example
             * giant.InlineStyles.create()
             *      .setItem('display', 'inline-block')
             *      .setItem('overflow', 'hidden')
             *      .toString() // "display: inline-block; overflow: hidden"
             * @returns {string}
             */
            toString: function () {
                var result = [];
                this.forEachItem(function (styleValue, styleName) {
                    result.push(styleName + ': ' + styleValue);
                });
                return result.join('; ');
            }
        });
});

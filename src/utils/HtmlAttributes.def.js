$oop.postpone($widget, 'HtmlAttributes', function () {
    "use strict";

    var base = $data.Collection,
        self = base.extend();

    /**
     * Creates a HtmlAttributes instance.
     * @name $widget.HtmlAttributes.create
     * @function
     * @param {object|Array} [items] Initial contents.
     * @returns {$widget.HtmlAttributes}
     */

    /**
     * The HtmlAttributes class manages all aspects of an HTML element's attributes,
     * including CSS classes and inline styles.
     * @class
     * @extends $data.Collection
     */
    $widget.HtmlAttributes = self
        .addMethods(/** @lends $widget.HtmlAttributes# */{
            /**
             * @param {object|Array} [items] Initial contents.
             * @ignore
             */
            init: function (items) {
                base.init.call(this, items);

                /**
                 * ID attribute.
                 * @type {string}
                 */
                this.idAttribute = undefined;

                /**
                 * Collection of CSS classes.
                 * @type {$widget.CssClasses}
                 */
                this.cssClasses = $widget.CssClasses.create();

                /**
                 * Collection of inline styles.
                 * @type {$widget.InlineStyles}
                 */
                this.inlineStyles = $widget.InlineStyles.create();
            },

            /**
             * Removes the specified attribute from the collection.
             * @param {string} attributeName Name of attribute to be removed. Values 'class' and 'style' also
             * clear the corresponding collections. Use carefully!
             * @returns {$widget.HtmlAttributes}
             */
            deleteItem: function (attributeName) {
                switch (attributeName) {
                case 'style':
                    // emptying inline styles
                    this.inlineStyles.clear();
                    break;
                case 'class':
                    // emptying class collection
                    // removes auto-added classes, too!
                    this.cssClasses.clear();
                    break;
                }

                base.deleteItem.call(this, attributeName);

                return this;
            },

            /**
             * Sets ID attribute. ID attribute set this way will override ID attribute set via `setItem`.
             * @param {string} idAttribute
             * @returns {$widget.HtmlAttributes}
             * @see $widget.HtmlAttributes#setItem
             */
            setIdAttribute: function (idAttribute) {
                $assertion.isString(idAttribute, "Invalid ID attribute");
                this.idAttribute = idAttribute;
                return this;
            },

            /**
             * Adds CSS class to the 'class' attribute.
             * @param {string} cssClass
             * @returns {$widget.HtmlAttributes}
             */
            addCssClass: function (cssClass) {
                this.cssClasses.addCssClass(cssClass);
                return this;
            },

            /**
             * Decreases ref count on specified CSS class.
             * @param {string} cssClass
             * @returns {$widget.HtmlAttributes}
             */
            decreaseCssClassRefCount: function (cssClass) {
                this.cssClasses.decreaseRefCount(cssClass);
                return this;
            },

            /**
             * Removes CSS class from the 'class' attribute.
             * @param {string} cssClass
             * @returns {$widget.HtmlAttributes}
             */
            removeCssClass: function (cssClass) {
                this.cssClasses.removeCssClass(cssClass);
                return this;
            },

            /**
             * Adds style definition to the 'style' attribute.
             * @param {string} styleName Style name, eg. "overflow".
             * @param {string} styleValue Style value, eg. "hidden".
             * @returns {$widget.HtmlAttributes}
             */
            addInlineStyle: function (styleName, styleValue) {
                this.inlineStyles.setItem(styleName, styleValue);
                return this;
            },

            /**
             * Adds style definition to the 'style' attribute.
             * @param {string} styleName Style name, eg. "overflow".
             * @returns {$widget.HtmlAttributes}
             */
            removeInlineStyle: function (styleName) {
                this.inlineStyles.deleteItem(styleName);
                return this;
            },

            /**
             * Generates a new HtmlAttributes instance on which the `id`, `class`, and `style` attributes are set
             * based on the corresponding properties of the current instance.
             * @returns {$widget.HtmlAttributes}
             */
            getFinalAttributes: function () {
                // not cloning on purpose so collections and properties don't carry over
                var htmlAttributes = this.getBase().create(this.items);

                if (this.idAttribute) {
                    htmlAttributes.setItem('id', this.idAttribute);
                } else {
                    htmlAttributes.deleteItem('id');
                }

                htmlAttributes.setItem('class', this.cssClasses.toString());

                if (this.inlineStyles.getKeyCount()) {
                    htmlAttributes.setItem('style', this.inlineStyles.toString());
                } else {
                    htmlAttributes.deleteItem('style');
                }

                return htmlAttributes;
            },

            /**
             * Clones HTML attributes with attached ID attribute, inline styles, and CSS classes.
             * @returns {$widget.HtmlAttributes}
             */
            clone: function () {
                var result = base.clone.call(this);

                result.idAttribute = this.idAttribute;
                result.cssClasses = this.cssClasses.clone();
                result.inlineStyles = this.inlineStyles.clone();

                return result;
            },

            /**
             * Serializes HTML attributes to string so that it can be used when composing an HTML tag.
             * The order of attributes is not determined.
             * @example
             * $widget.HtmlAttributes.create()
             *     .setIdAttribute('foo')
             *     .addCssClass('bar')
             *     .addInlineStyle('overflow', 'hidden')
             *     .toString() // 'id="foo" class="bar" style="overflow: hidden"'
             * @returns {string}
             */
            toString: function () {
                return this.getFinalAttributes()
                    .mapValues(function (value, attributeName) {
                        return attributeName + '="' + value + '"';
                    })
                    .getSortedValues()
                    .join(' ');
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $widget */{
        /** @param {$widget.HtmlAttributes} expr */
        isHtmlAttributes: function (expr) {
            return $widget.HtmlAttributes.isBaseOf(expr);
        },

        /** @param {$widget.HtmlAttributes} [expr] */
        isHtmlAttributesOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   $widget.HtmlAttributes.isBaseOf(expr);
        }
    });
}());

/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'src/namespace.js',
            'src/utils/WidgetUtils.js',
            'src/utils/HandlebarsTemplate.js',
            'src/utils/MarkupTemplate.js',
            'src/utils/CssClasses.js',
            'src/utils/InlineStyles.js',
            'src/utils/HtmlAttributes.js',
            'src/behaviors/Progenitor.js',
            'src/behaviors/Renderable.js',
            'src/behaviors/JqueryWidget.js',
            'src/widget/widgetEventSpace.js',
            'src/widget/WidgetEvent.js',
            'src/widget/Widget.js',
            'src/widget/WidgetCollection.js',
            'src/exports.js'
        ],

        test: [
            'src/utils/jsTestDriver.conf',
            'src/behaviors/jsTestDriver.conf',
            'src/widget/jsTestDriver.conf'
        ],

        globals: {}
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};

/*jshint node:true */

/** @namespace */
var $widget = {};

/** @namespace */
var $assertion = $assertion || require('giant-assertion');

/** @namespace */
var $oop = $oop || require('giant-oop');

/** @namespace */
var $utils = $utils || require('giant-utils');

/** @namespace */
var $data = $data || require('giant-data');

/** @namespace */
var $event = $event || require('giant-event');

/**
 * @function
 * @see http://api.jquery.com
 */
var jQuery = jQuery || require('jquery');

if (typeof document === 'undefined') {
    /**
     * Built-in global document object.
     * @type {Document}
     */
    document = undefined;
}
/**
 * Native DOM element class.
 * @name Element
 */
var Element = Element || undefined;

/**
 * Native DOM event class.
 * @name Event
 */
var Event = Event || undefined;

/**
 * Native number class.
 * @name Number
 * @class
 */

/**
 * Native string class.
 * @name String
 * @class
 */

/**
 * Native array class.
 * @name Array
 * @class
 */

/**
 * @name $data.Hash
 * @class
 */

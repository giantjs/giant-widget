/*global giant, Event */
(function () {
    "use strict";

    module("Widget");

    test("Extension", function () {
        var CustomWidget = giant.Widget.extend('CustomWidget');

        ok(CustomWidget.isA(giant.Widget), "should return Widget subclass");
        strictEqual(CustomWidget.getBase(), giant.Widget, "should extend base class");
        notStrictEqual(CustomWidget.htmlAttributes, giant.Widget.htmlAttributes,
            "should clone html attribute collection");
        ok(!!CustomWidget.htmlAttributes.cssClasses.getItem('CustomWidget'),
            "should add class name to CSS class collection");
    });

    test("Trait addition", function () {
        var CustomWidget = giant.Widget.extend('CustomWidget')
            .addTrait(giant.Evented, 'Evented');

        ok(!!CustomWidget.htmlAttributes.cssClasses.getItem('CustomWidget'),
            "should add trait name to CSS class collection");
    });

    test("Instantiation", function () {
        expect(9);

        giant.Renderable.addMocks({
            init: function (htmlAttributes) {
                ok(true, "should initialize Renderable trait");
                ok(htmlAttributes.isA(giant.HtmlAttributes), "should pass HtmlAttributes instance");
                ok(htmlAttributes.idAttribute, 'w0', "should set ID attribute");
            }
        });

        giant.Widget.addMocks({
            setChildName: function (childName) {
                equal(childName, this.instanceId.toWidgetId(), "should set widget ID as child name");
            }
        });

        var widget = giant.Widget.create();

        giant.Renderable.removeMocks();
        giant.Widget.removeMocks();

        ok(widget.hasOwnProperty('containerCssClass'), "should add containerCssClass property");
        equal(typeof widget.containerCssClass, 'undefined', "should set containerCssClass to undefined");

        ok(widget.children.isA(giant.WidgetCollection), "should convert children to WidgetCollection");

        ok(widget.eventPath.isA(giant.Path), "should set eventPath property");
        ok(widget.eventPath.equals(widget.getLineage().prepend(widget.DETACHED_EVENT_PATH_ROOT)),
            "should set eventPath to lineage path");
    });

    test("Conversion from string", function () {
        expect(2);

        var widget = {};

        giant.Managed.addMocks({
            getInstanceById: function (instanceId) {
                equal(instanceId, 14, "should fetch instance from registry");
                return widget;
            }
        });

        strictEqual('w14'.toWidget(), widget, "should return instance fetched by getInstanceId");

        giant.Managed.removeMocks();
    });

    test("Conversion from Element", function () {
        if (document) {
            expect(2);

            var element = document.createElement('div'),
                widget = {};

            element.id = 'w100';

            giant.Managed.addMocks({
                getInstanceById: function (instanceId) {
                    equal(instanceId, 100, "should fetch instance from registry");
                    return widget;
                }
            });

            strictEqual(element.toWidget(), widget, "should fetch widget by instance ID");

            giant.Managed.removeMocks();
        }
    });

    test("Conversion from Event", function () {
        if (Event) {
            expect(3);

            var uiEvent = document.createEvent('MouseEvent'),
                widget = {};

            giant.WidgetUtils.addMocks({
                getParentNodeByClassName: function (childElement, cssClassName) {
                    equal(cssClassName, 'foo', "should fetch nearest widget parent element");
                    return {
                        id: 'w100'
                    };
                }
            });

            giant.Managed.addMocks({
                getInstanceById: function (instanceId) {
                    equal(instanceId, 100, "should fetch instance from registry");
                    return widget;
                }
            });

            strictEqual(uiEvent.toWidget('foo'), widget, "should return instance fetched by getInstanceId");

            giant.WidgetUtils.removeMocks();
            giant.Managed.removeMocks();
        }
    });

    test("Container setter", function () {
        var widget = giant.Widget.create();

        strictEqual(widget.setContainerCssClass('foo'), widget, "should be chainable");
        equal(widget.containerCssClass, 'foo', "should set container CSS class");
    });

    test("Adding to parent", function () {
        expect(10);

        var childWidget = giant.Widget.create(),
            parentWidget = giant.Widget.create();

        throws(function () {
            childWidget.addToParent();
        }, "should raise exception on no arguments");

        throws(function () {
            childWidget.addToParent('foo');
        }, "should raise exception on invalid arguments");

        giant.Event.addMocks({
            triggerSync: function () {
                equal(this.eventName, giant.EVENT_WIDGET_CHILD_ADD, "should trigger addition event");
                strictEqual(this.payload.childWidget, childWidget,
                    "should set child widget in payload");
            }
        });

        childWidget.addMocks({
            isOnRoot: function () {
                ok(true, "should determine whether widget is attached to root");
                return true;
            },

            afterAdd: function () {
                ok(true, "should call afterAdd");
            },

            _renderIntoParent: function () {
                ok(true, "should call _renderIntoParent");
            }
        });

        giant.Progenitor.addMocks({
            addToParent: function (parent) {
                strictEqual(this, childWidget, "should call trait's method on current widget");
                strictEqual(parent, parentWidget, "should pass parent widget to trait");
                return this;
            }
        });

        strictEqual(childWidget.addToParent(parentWidget), childWidget, "should be chainable");

        giant.Event.removeMocks();
        giant.Progenitor.removeMocks();
    });

    test("Re-adding to parent", function () {
        expect(0);

        var childWidget = giant.Widget.create(),
            parentWidget = giant.Widget.create();

        parentWidget.children.addMocks({
            getItem: function () {
                return childWidget;
            }
        });

        childWidget.addMocks({
            _renderIntoParent: function () {
                ok(true, "should NOT call _renderIntoParent");
            }
        });

        childWidget.addToParent(parentWidget);
    });

    test("Adding to detached parent", function () {
        expect(1);

        var childWidget = giant.Widget.create(),
            parentWidget = giant.Widget.create();

        giant.Event.addMocks({
            triggerSync: function () {
                equal(this.eventName, giant.EVENT_WIDGET_CHILD_ADD, "should trigger addition event");
            }
        });

        childWidget.addMocks({
            isOnRoot: function () {
                return false;
            },

            afterAdd: function () {
                ok(true, "should NOT call afterAdd");
            },

            _renderIntoParent: function () {
            }
        });

        childWidget.addToParent(parentWidget);

        giant.Event.removeMocks();
    });

    test("Adding widget as root", function () {
        expect(6);

        var widget = giant.Widget.create(),
            rootWidget = giant.Widget.create();

        giant.Widget.rootWidget = rootWidget;

        rootWidget.addMocks({
            removeRootWidget: function () {
                ok(true, "should remove old root widget");
                return this;
            }
        });

        widget.addMocks({
            afterAdd: function () {
                ok(true, "should call afterAdd");
                return this;
            },

            renderInto: function (targetElement) {
                ok(true, "should call renderInto");
                strictEqual(targetElement, document.getElementsByTagName('body')[0],
                    "should render into body");
                return this;
            }
        });

        strictEqual(widget.setRootWidget(), widget, "should be chainable");
        strictEqual(giant.Widget.rootWidget, widget, "should set root widget");
    });

    test("Re-adding widget as root", function () {
        expect(0);

        var widget = giant.Widget.create();

        giant.Widget.rootWidget = widget;

        widget.addMocks({
            afterAdd: function () {
                ok(true, "should NOT call afterAdd");
                return this;
            },

            renderInto: function () {
                ok(true, "should NOT call renderInto");
                return this;
            }
        });

        widget.setRootWidget();
    });

    test("Root tester", function () {
        giant.Widget.addMocks({
            afterAdd: function () {
            }
        });

        var rootWidget = giant.Widget.create()
                .setRootWidget(),
            parentWidget = giant.Widget.create(),
            childWidget1 = giant.Widget.create()
                .addToParent(parentWidget),
            childWidget2 = giant.Widget.create()
                .addToParent(rootWidget);

        giant.Widget.removeMocks();

        ok(!childWidget1.isOnRoot(), "should return false for widgets not connected to root widget");
        ok(childWidget2.isOnRoot(), "should return true for widgets connected to root widget");
    });

    test("Removal from parent", function () {
        expect(7);

        var parentWidget = giant.Widget.create(),
            childWidget = giant.Widget.create()
                .addToParent(parentWidget);

        giant.Event.addMocks({
            triggerSync: function () {
                equal(this.eventName, giant.EVENT_WIDGET_CHILD_REMOVE, "should trigger removal event");
                strictEqual(this.payload.childWidget, childWidget,
                    "should set child widget in payload");
            }
        });

        childWidget.addMocks({
            isOnRoot: function () {
                ok(true, "should determine if widget is connected to root widget");
                return true;
            },

            getElement: function () {
                ok(true, "should fetch DOM element");
            },

            afterRemove: function () {
                ok(true, "should call afterRemove");
            }
        });

        giant.Progenitor.addMocks({
            removeFromParent: function () {
                strictEqual(this, childWidget, "should call trait's method on current widget");
                return this;
            }
        });

        strictEqual(childWidget.removeFromParent(), childWidget, "should be chainable");

        giant.Event.removeMocks();
        giant.Progenitor.removeMocks();
    });

    test("Root widget removal", function () {
        expect(3);

        var widget = giant.Widget.create();

        giant.Widget.rootWidget = widget;

        widget.addMocks({
            removeFromParent: function () {
                ok(true, "should call removeFromParent");
            }
        });

        strictEqual(widget.removeRootWidget(), widget, "should be chainable");
        equal(typeof giant.Widget.rootWidget, 'undefined', "should root widget to undefined");
    });

    test("Child widget name setter", function () {
        expect(5);

        var widget = giant.Widget.create(),
            oldChildName = widget.childName;

        widget.addMocks({
            removeCssClass: function (className) {
                equal(className, oldChildName, "should remove current widget name from CSS classes");
                return this;
            },

            addCssClass: function (className) {
                equal(className, 'foo', "should add new widget name as CSS class");
                return this;
            }
        });

        giant.Progenitor.addMocks({
            setChildName: function (childName) {
                strictEqual(this, widget, "should call trait's setChildName on current widget");
                equal(childName, 'foo', "should pass specified child name to trait");
                return this;
            }
        });

        strictEqual(widget.setChildName('foo'), widget, "should be chainable");

        giant.Progenitor.removeMocks();
    });

    test("Adjacent widget getter", function () {
        expect(4);

        var widget = giant.Widget.create(),
            targetParentElement = document.createElement('div'),
            instanceIds = [],
            widgets = {
                1  : {
                    childName: 'foo'
                },
                10 : {
                    childName: 'bar'
                },
                100: {
                    childName: 'baz'
                }
            };

        widget.addMocks({
            _getWidgetIdsInDom: function (parentElement) {
                strictEqual(parentElement, targetParentElement, "should get widget IDs under parent element");
                return ['w1', 'w10', 'w100'];
            }
        });

        giant.Managed.addMocks({
            getInstanceById: function (instanceId) {
                instanceIds.push(instanceId);
                return widgets[instanceId];
            }
        });

        giant.OrderedStringList.addMocks({
            spliceIndexOf: function (widgetName) {
                equal(widgetName, 'w11', "should fetch splice index for specified widget name");
                return 100;
            }
        });

        giant.Collection.addMocks({
            getItem: function (itemName) {
                return {
                    1  : widgets[1],
                    10 : widgets[10],
                    100: widgets[100]
                }[itemName];
            }
        });

        strictEqual(widget.getAdjacentWidget('w11', targetParentElement), widgets[100], "should return widget adjacent to specified widget name");
        deepEqual(
            instanceIds.sort(),
            [1, 10, 100].sort(),
            "should fetch IDs of widgets under specified element");

        giant.Widget.removeMocks();
        giant.Managed.removeMocks();
        giant.OrderedStringList.removeMocks();
        giant.Collection.removeMocks();
    });

    // TODO: Add test for when adjacent widget's name is smaller than current.
    test("Rendering into element", function () {
        expect(8);

        var widget = giant.Widget.create().setChildName('A'),
            adjacentWidget = giant.Widget.create().setChildName('B'),
            targetElement = document.createElement('div'),
            adjacentElement = {};

        throws(function () {
            widget.renderInto();
        }, "should raise exception on missing argument");

        throws(function () {
            widget.renderInto('foo');
        }, "should raise exception on invalid argument");

        widget.addMocks({
            getAdjacentWidget: function () {
                ok(true, "should fetch adjacent widget");
                return adjacentWidget;
            },
            afterRender      : function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        adjacentWidget.addMocks({
            getElement: function () {
                ok(true, "should fetch element of adjacent widget");
                return adjacentElement;
            }
        });

        giant.Renderable.addMocks({
            renderBefore: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, adjacentElement, "should call renderBefore with adjacent element");
                return this;
            }
        });

        strictEqual(widget.renderInto(targetElement), widget, "should be chainable");

        giant.Renderable.removeMocks();
    });

    test("Rendering into element w/ no adjacent widget", function () {
        expect(3);

        var widget = giant.Widget.create(),
            targetElement = document.createElement('div');

        widget.addMocks({
            getAdjacentWidget: function () {
                return undefined;
            },
            afterRender      : function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        giant.Renderable.addMocks({
            renderInto: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, targetElement, "should call renderInto with target element");
                return this;
            }
        });

        widget.renderInto(targetElement);

        giant.Renderable.removeMocks();
    });

    test("Rendering before element", function () {
        expect(6);

        var widget = giant.Widget.create(),
            targetElement = document.createElement('div');

        throws(function () {
            widget.renderBefore();
        }, "should raise exception on missing argument");

        throws(function () {
            widget.renderBefore('foo');
        }, "should raise exception on invalid argument");

        widget.addMocks({
            afterRender: function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        giant.Renderable.addMocks({
            renderBefore: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, targetElement, "should call trait's method with target element");
                return this;
            }
        });

        strictEqual(widget.renderBefore(targetElement), widget, "should be chainable");

        giant.Renderable.removeMocks();
    });

    test("Re-rendering", function () {
        expect(3);

        var widget = giant.Widget.create();

        widget.addMocks({
            afterRender: function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        giant.Renderable.addMocks({
            reRender: function () {
                strictEqual(this, widget, "should call trait's method");
                return this;
            }
        });

        strictEqual(widget.reRender(), widget, "should be chainable");

        giant.Renderable.removeMocks();
    });

    test("Re-rendering content", function () {
        expect(3);

        var widget = giant.Widget.create();

        widget.addMocks({
            afterRender: function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        giant.Renderable.addMocks({
            reRenderContents: function () {
                strictEqual(this, widget, "should call trait's method");
                return this;
            }
        });

        strictEqual(widget.reRenderContents(), widget, "should be chainable");

        giant.Renderable.removeMocks();
    });

    test("Default content markup template generation", function () {
        expect(2);

        var widget = giant.Widget.create(),
            child = giant.Widget.create(),
            template = ''.toMarkupTemplate();

        widget.addMocks({
            _getChildrenGroupedByContainer: function () {
                return giant.Collection.create({
                    foo: child
                });
            }
        });

        giant.Renderable.addMocks({
            contentMarkupAsTemplate: function () {
                return template;
            }
        });

        giant.MarkupTemplate.addMocks({
            appendContent: function (contents) {
                deepEqual(contents, {
                    foo: child
                }, "should append content to template");
                return this;
            }
        });

        strictEqual(widget.contentMarkupAsTemplate(), template, "should return cloned template instance");

        giant.Renderable.removeMocks();
        giant.MarkupTemplate.removeMocks();
    });

    test("Adding to hierarchy", function () {
        expect(4);

        var widget = giant.Widget.create();

        widget.children.addMocks({
            addToHierarchy: function () {
                ok(true, "should call children's addToHierarchy");
            }
        });

        widget.addMocks({
            getLineage: function () {
                ok(true, "should fetch widget's lineage");
                return giant.Progenitor.getLineage.call(this);
            },

            setEventPath: function (eventPath) {
                deepEqual(eventPath, [widget.instanceId].toPath().prepend(widget.ATTACHED_EVENT_PATH_ROOT),
                    "should set event path to lineage");
                return this;
            },

            addToRegistry: function () {
                ok(true, "should add widget to registry");
            }
        });

        widget.addToHierarchy();
    });

    test("Removing from hierarchy", function () {
        expect(5);

        var widget = giant.Widget.create(),
            lineage = [widget.instanceId].toPath();

        widget.children.addMocks({
            removeFromHierarchy: function () {
                ok(true, "should call children's removeFromHierarchy");
            }
        });

        widget.addMocks({
            unsubscribeFrom: function () {
                ok(true, "should unsubscribe from widget events");
                return this;
            },

            getLineage: function () {
                ok(true, "should fetch widget's lineage");
                return lineage.clone();
            },

            setEventPath: function (eventPath) {
                deepEqual(eventPath, [widget.instanceId].toPath().prepend(widget.DETACHED_EVENT_PATH_ROOT),
                    "should set event path to lineage");
                return this;
            },

            removeFromRegistry: function () {
                ok(true, "should remove widget from registry");
            }
        });

        widget.removeFromHierarchy();
    });

    test("After render handler", function () {
        expect(2);

        var widget = giant.Widget.create();

        widget.addMocks({
            getElement: function () {
                ok(true, "should fetch widget's DOM");
                return {};
            }
        });

        widget.children.addMocks({
            afterRender: function () {
                ok(true, "should call children's afterRender");
            }
        });

        widget.afterRender();
    });

    test("Spawning widget event", function () {
        var widget = giant.Widget.create(),
            event;

        event = widget.spawnEvent('widget.foo');

        strictEqual(event.senderWidget, widget, "should set senderWidget on event");
    });
}());

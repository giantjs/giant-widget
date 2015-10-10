(function () {
    "use strict";

    module("Widget");

    test("Extension", function () {
        var CustomWidget = $widget.Widget.extend('CustomWidget');

        ok(CustomWidget.isA($widget.Widget), "should return Widget subclass");
        strictEqual(CustomWidget.getBase(), $widget.Widget, "should extend base class");
        notStrictEqual(CustomWidget.htmlAttributes, $widget.Widget.htmlAttributes,
            "should clone html attribute collection");
        ok(!!CustomWidget.htmlAttributes.cssClasses.getItem('CustomWidget'),
            "should add class name to CSS class collection");
    });

    test("Trait addition", function () {
        var CustomWidget = $widget.Widget.extend('CustomWidget')
            .addTrait($event.Evented, 'Evented');

        ok(!!CustomWidget.htmlAttributes.cssClasses.getItem('CustomWidget'),
            "should add trait name to CSS class collection");
    });

    test("Instantiation", function () {
        expect(9);

        $widget.Renderable.addMocks({
            init: function (htmlAttributes) {
                ok(true, "should initialize Renderable trait");
                ok(htmlAttributes.isA($widget.HtmlAttributes), "should pass HtmlAttributes instance");
                ok(htmlAttributes.idAttribute, 'w0', "should set ID attribute");
            }
        });

        $widget.Widget.addMocks({
            setChildName: function (childName) {
                equal(childName, this.instanceId.toWidgetId(), "should set widget ID as child name");
            }
        });

        var widget = $widget.Widget.create();

        $widget.Renderable.removeMocks();
        $widget.Widget.removeMocks();

        ok(widget.hasOwnProperty('containerCssClass'), "should add containerCssClass property");
        equal(typeof widget.containerCssClass, 'undefined', "should set containerCssClass to undefined");

        ok(widget.children.isA($widget.WidgetCollection), "should convert children to WidgetCollection");

        ok(widget.eventPath.isA($data.Path), "should set eventPath property");
        ok(widget.eventPath.equals(widget.getLineage().prepend(widget.DETACHED_EVENT_PATH_ROOT)),
            "should set eventPath to lineage path");
    });

    test("Conversion from string", function () {
        expect(2);

        var widget = {};

        $utils.Managed.addMocks({
            getInstanceById: function (instanceId) {
                equal(instanceId, 14, "should fetch instance from registry");
                return widget;
            }
        });

        strictEqual('w14'.toWidget(), widget, "should return instance fetched by getInstanceId");

        $utils.Managed.removeMocks();
    });

    test("Conversion from Element", function () {
        if (document) {
            expect(2);

            var element = document.createElement('div'),
                widget = {};

            element.id = 'w100';

            $utils.Managed.addMocks({
                getInstanceById: function (instanceId) {
                    equal(instanceId, 100, "should fetch instance from registry");
                    return widget;
                }
            });

            strictEqual(element.toWidget(), widget, "should fetch widget by instance ID");

            $utils.Managed.removeMocks();
        }
    });

    test("Conversion from Event", function () {
        if (Event) {
            expect(3);

            var uiEvent = document.createEvent('MouseEvent'),
                widget = {};

            $widget.WidgetUtils.addMocks({
                getParentNodeByClassName: function (childElement, cssClassName) {
                    equal(cssClassName, 'foo', "should fetch nearest widget parent element");
                    return {
                        id: 'w100'
                    };
                }
            });

            $utils.Managed.addMocks({
                getInstanceById: function (instanceId) {
                    equal(instanceId, 100, "should fetch instance from registry");
                    return widget;
                }
            });

            strictEqual(uiEvent.toWidget('foo'), widget, "should return instance fetched by getInstanceId");

            $widget.WidgetUtils.removeMocks();
            $utils.Managed.removeMocks();
        }
    });

    test("Container setter", function () {
        var widget = $widget.Widget.create();

        strictEqual(widget.setContainerCssClass('foo'), widget, "should be chainable");
        equal(widget.containerCssClass, 'foo', "should set container CSS class");
    });

    test("Adding to parent", function () {
        expect(8);

        var childWidget = $widget.Widget.create(),
            parentWidget = $widget.Widget.create();

        throws(function () {
            childWidget.addToParent();
        }, "should raise exception on no arguments");

        throws(function () {
            childWidget.addToParent('foo');
        }, "should raise exception on invalid arguments");

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

        $widget.Progenitor.addMocks({
            addToParent: function (parent) {
                strictEqual(this, childWidget, "should call trait's method on current widget");
                strictEqual(parent, parentWidget, "should pass parent widget to trait");
                return this;
            }
        });

        strictEqual(childWidget.addToParent(parentWidget), childWidget, "should be chainable");

        $widget.Progenitor.removeMocks();
    });

    test("Re-adding to parent", function () {
        expect(0);

        var childWidget = $widget.Widget.create(),
            parentWidget = $widget.Widget.create();

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
        expect(0);

        var childWidget = $widget.Widget.create(),
            parentWidget = $widget.Widget.create();

        childWidget.addMocks({
            isOnRoot: function () {
                return false;
            },

            afterAdd: function () {
                ok(false, "should NOT call afterAdd");
            },

            _renderIntoParent: function () {
            }
        });

        childWidget.addToParent(parentWidget);
    });

    test("Adding widget as root", function () {
        expect(6);

        var widget = $widget.Widget.create(),
            rootWidget = $widget.Widget.create();

        $widget.Widget.rootWidget = rootWidget;

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
        strictEqual($widget.Widget.rootWidget, widget, "should set root widget");
    });

    test("Re-adding widget as root", function () {
        expect(0);

        var widget = $widget.Widget.create();

        $widget.Widget.rootWidget = widget;

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
        $widget.Widget.addMocks({
            afterAdd: function () {
            }
        });

        var rootWidget = $widget.Widget.create()
                .setRootWidget(),
            parentWidget = $widget.Widget.create(),
            childWidget1 = $widget.Widget.create()
                .addToParent(parentWidget),
            childWidget2 = $widget.Widget.create()
                .addToParent(rootWidget);

        $widget.Widget.removeMocks();

        ok(!childWidget1.isOnRoot(), "should return false for widgets not connected to root widget");
        ok(childWidget2.isOnRoot(), "should return true for widgets connected to root widget");
    });

    test("Removal from parent", function () {
        expect(5);

        var parentWidget = $widget.Widget.create(),
            childWidget = $widget.Widget.create()
                .addToParent(parentWidget);

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

        $widget.Progenitor.addMocks({
            removeFromParent: function () {
                strictEqual(this, childWidget, "should call trait's method on current widget");
                return this;
            }
        });

        strictEqual(childWidget.removeFromParent(), childWidget, "should be chainable");

        $widget.Progenitor.removeMocks();
    });

    test("Root widget removal", function () {
        expect(3);

        var widget = $widget.Widget.create();

        $widget.Widget.rootWidget = widget;

        widget.addMocks({
            removeFromParent: function () {
                ok(true, "should call removeFromParent");
            }
        });

        strictEqual(widget.removeRootWidget(), widget, "should be chainable");
        equal(typeof $widget.Widget.rootWidget, 'undefined', "should root widget to undefined");
    });

    test("Child widget name setter", function () {
        expect(5);

        var widget = $widget.Widget.create(),
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

        $widget.Progenitor.addMocks({
            setChildName: function (childName) {
                strictEqual(this, widget, "should call trait's setChildName on current widget");
                equal(childName, 'foo', "should pass specified child name to trait");
                return this;
            }
        });

        strictEqual(widget.setChildName('foo'), widget, "should be chainable");

        $widget.Progenitor.removeMocks();
    });

    test("Adjacent widget getter", function () {
        expect(4);

        var widget = $widget.Widget.create(),
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

        $utils.Managed.addMocks({
            getInstanceById: function (instanceId) {
                instanceIds.push(instanceId);
                return widgets[instanceId];
            }
        });

        $data.OrderedStringList.addMocks({
            spliceIndexOf: function (widgetName) {
                equal(widgetName, 'w11', "should fetch splice index for specified widget name");
                return 100;
            }
        });

        $data.Collection.addMocks({
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

        $widget.Widget.removeMocks();
        $utils.Managed.removeMocks();
        $data.OrderedStringList.removeMocks();
        $data.Collection.removeMocks();
    });

    // TODO: Add test for when adjacent widget's name is smaller than current.
    test("Rendering into element", function () {
        expect(8);

        var widget = $widget.Widget.create().setChildName('A'),
            adjacentWidget = $widget.Widget.create().setChildName('B'),
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

        $widget.Renderable.addMocks({
            renderBefore: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, adjacentElement, "should call renderBefore with adjacent element");
                return this;
            }
        });

        strictEqual(widget.renderInto(targetElement), widget, "should be chainable");

        $widget.Renderable.removeMocks();
    });

    test("Rendering into element w/ no adjacent widget", function () {
        expect(3);

        var widget = $widget.Widget.create(),
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

        $widget.Renderable.addMocks({
            renderInto: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, targetElement, "should call renderInto with target element");
                return this;
            }
        });

        widget.renderInto(targetElement);

        $widget.Renderable.removeMocks();
    });

    test("Rendering before element", function () {
        expect(6);

        var widget = $widget.Widget.create(),
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

        $widget.Renderable.addMocks({
            renderBefore: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, targetElement, "should call trait's method with target element");
                return this;
            }
        });

        strictEqual(widget.renderBefore(targetElement), widget, "should be chainable");

        $widget.Renderable.removeMocks();
    });

    test("Re-rendering", function () {
        expect(3);

        var widget = $widget.Widget.create();

        widget.addMocks({
            afterRender: function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        $widget.Renderable.addMocks({
            reRender: function () {
                strictEqual(this, widget, "should call trait's method");
                return this;
            }
        });

        strictEqual(widget.reRender(), widget, "should be chainable");

        $widget.Renderable.removeMocks();
    });

    test("Re-rendering content", function () {
        expect(3);

        var widget = $widget.Widget.create();

        widget.addMocks({
            afterRender: function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        $widget.Renderable.addMocks({
            reRenderContents: function () {
                strictEqual(this, widget, "should call trait's method");
                return this;
            }
        });

        strictEqual(widget.reRenderContents(), widget, "should be chainable");

        $widget.Renderable.removeMocks();
    });

    test("Default content markup template generation", function () {
        expect(2);

        var widget = $widget.Widget.create(),
            child = $widget.Widget.create(),
            template = ''.toMarkupTemplate();

        widget.addMocks({
            _getChildrenGroupedByContainer: function () {
                return $data.Collection.create({
                    foo: child
                });
            }
        });

        $widget.Renderable.addMocks({
            contentMarkupAsTemplate: function () {
                return template;
            }
        });

        $widget.MarkupTemplate.addMocks({
            setParameterValues: function (contents) {
                deepEqual(contents, {
                    foo: child
                }, "should append content to template");
                return this;
            }
        });

        strictEqual(widget.contentMarkupAsTemplate(), template, "should return cloned template instance");

        $widget.Renderable.removeMocks();
        $widget.MarkupTemplate.removeMocks();
    });

    test("Adding to hierarchy", function () {
        expect(4);

        var widget = $widget.Widget.create();

        widget.children.addMocks({
            addToHierarchy: function () {
                ok(true, "should call children's addToHierarchy");
            }
        });

        widget.addMocks({
            getLineage: function () {
                ok(true, "should fetch widget's lineage");
                return $widget.Progenitor.getLineage.call(this);
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

        var widget = $widget.Widget.create(),
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

        var widget = $widget.Widget.create();

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
}());

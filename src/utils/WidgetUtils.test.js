(function () {
    "use strict";

    module("Widget Utils");

    test("HTML escape", function () {
        equal($widget.WidgetUtils.htmlEscape("Q&A"), "Q&amp;A",
            "should escape ampersand");
        equal(
            $widget.WidgetUtils.htmlEscape("<script>alert('foo');</script>"),
            "&lt;script&gt;alert(&#39;foo&#39;);&lt;/script&gt;",
            "should escape injected HTML"
        );
        equal(
            $widget.WidgetUtils.htmlEscape("Hello {{name}}!"),
            "Hello &#123;&#123;name&#125;&#125;!",
            "should escape template"
        );
    });

    test("Conversion to HTML encoded string", function () {
        equal('{{Q&A}}'.toHtml(), '&#123;&#123;Q&amp;A&#125;&#125;', "should return HTML encoded string");
    });

    test("Getting parent node by class name", function () {
        var element = document.createElement('div');
        element.innerHTML = [
            '<div id="e1" class="outmost">' +
            '<div id="e2" class="middle">' +
            '<div id="e3" class="innermost">' +
            '</div>' +
            '</div>' +
            '</div>'
        ].join('');

        var e1 = element.getElementsByClassName('outmost')[0],
            e2 = element.getElementsByClassName('middle')[0],
            e3 = element.getElementsByClassName('innermost')[0];

        strictEqual($widget.WidgetUtils.getParentNodeByClassName(e3, 'innermost'), e3,
            "should fetch self when specified class is matching");
        strictEqual($widget.WidgetUtils.getParentNodeByClassName(e3, 'middle'), e2,
            "should fetch parent with specified class");
        equal(typeof $widget.WidgetUtils.getParentNodeByClassName(e3, 'foo'), 'undefined',
            "should return undefined when no such parent exists");
    });
}());

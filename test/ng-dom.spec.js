import {NgDOM} from '../src/class/ng-dom';
import {getXML, isNode, isNumber} from '../src/core';

describe('NgDOM', function () {
    var xmlDoc;
    beforeEach(function () {
        getXML('/base/test/test.xml', function (data) {
            xmlDoc = data;
        }, false);
    });

    it('Should create an instance', function () {
        var dom = new NgDOM(xmlDoc);
        expect(dom instanceof NgDOM).toBe(true);
        expect(isNode(dom.node)).toBe(true);
        expect(dom.type).toBe('#document');
        expect(dom.typePrefix).toBe(null);
        expect(isNumber(dom.id)).toBe(true);
    });

    it('Should throw an error', function () {
        var message;
        try {
            var dom = new NgDOM();
        } catch (e) {
            message = e.message;
        }
        expect(message).toBe('NgDOM error node is not valid');
    });

    it('Should serialize to string', function() {
        var dom = new NgDOM(xmlDoc);
        var str = dom.toString();
        var multiline = `<?xml version="1.0" encoding="UTF-8"?><article>
    <title>HTML enhanced for web apps!</title>
    <subtitle>
        <b>This is an fancy bold subtitle</b>
        How it works ?
    </subtitle>
    <text>
        <p>Hello Igor! This is a test only</p>
        <pre code-type="application/javascript">
            export function instanceOf(type, Class) {
            if (isFunction(Class)) {
            return type instanceof Class;
            }
            return false;
            }
        </pre>
        <div>
            <p>Programing namespaces</p>
        </div>
    </text>
</article>`;
        expect(str).toBe(multiline);
    });
});



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
    <!--- this is an coment node -->
    <igorns:annotation xmlns:igorns="http://www.igorivanovic.info"/>
</article>`;
        expect(str).toBe(multiline);
    });

    it('Should be cached', function() {
        var dom = new NgDOM(xmlDoc);
        var inst = dom.getInstance(dom.node);
        expect(dom.id).toBe(inst.id);
    });


    it('Testing firstChild|firstElementChild', function() {
        var dom = new NgDOM(xmlDoc);
        var fc = dom.firstChild(), fc1, fc2;
        expect(fc.type).toBe('article');
        fc1 = fc.firstChild();
        fc2 = fc.firstElementChild();
        expect(fc1.type).toBe('#text');
        expect(fc2.type).toBe('title');
    });

    it('Testing lastChild|lastElementChild', function() {
        var dom = new NgDOM(xmlDoc);
        var fc = dom.lastChild(), fc1, fc2;
        expect(fc.type).toBe('article');
        fc1 = fc.lastChild();
        fc2 = fc.lastElementChild();
        expect(fc1.type).toBe('#text');
        expect(fc2.type).toBe('annotation');
        expect(fc2.typePrefix).toBe('igorns');
    });

    it('Testing nextSibling|nextElementSibling', function() {
        var dom = new NgDOM(xmlDoc);
        var fc = dom.firstChild(), fc1, fc2, fc3, fc4;
        expect(fc.type).toBe('article');
        fc1 = fc.firstChild();
        fc2 = fc1.nextSibling();
        fc3 = fc2.nextSibling();
        fc4 = fc3.nextElementSibling();
        expect(fc1.type).toBe('#text');
        expect(fc2.type).toBe('title');
        expect(fc3.type).toBe('#text');
        expect(fc4.type).toBe('subtitle');

    });

    it('Testing previousSibling|previousElementSibling', function() {
        var dom = new NgDOM(xmlDoc);
        var fc = dom.firstChild(), fc1, fc2, fc3, fc4;
        expect(fc.type).toBe('article');
        expect(fc.typePrefix).toBe(null);
        fc1 = fc.lastElementChild();
        fc2 = fc1.previousSibling();
        fc3 = fc2.previousSibling();
        fc4 = fc3.previousElementSibling();
        expect(fc1.type).toBe('annotation');
        expect(fc1.typePrefix).toBe('igorns');
        expect(fc2.type).toBe('#text');
        expect(fc3.type).toBe('#comment');
        expect(fc4.type).toBe('text');
    });

    it('Testing parentNode', function() {
        var dom = new NgDOM(xmlDoc);
        var fc = dom.firstChild(), fc1, fc2, fc3, fc4, fc5, fc6;
        expect(fc.type).toBe('article');
        fc1 = fc.lastElementChild().previousElementSibling();
        fc2 = fc1.lastElementChild();
        fc3 = fc2.lastElementChild();
        expect(fc1.type).toBe('text');
        expect(fc2.type).toBe('div');
        expect(fc3.type).toBe('p');
        fc4 = fc1.parentNode();
        fc5 = fc2.parentNode();
        fc6 = fc3.parentNode();
        expect(fc4.type).toBe('article');
        expect(fc5.type).toBe('text');
        expect(fc6.type).toBe('div');
    });

    it('Testing createElement|createElementNs', function() {
        var dom = new NgDOM(xmlDoc);
        var fc = dom.firstChild(), lc = fc.lastElementChild();
        var node = fc.createElement('test'), node2;
        expect(node.type).toBe('test');
        expect(lc.type).toBe('annotation');

        node2 = lc.createElementNs("http://www.igorivanovic.info", "igorns:what");
        expect(node2.type).toBe('what');
        expect(node2.typePrefix).toBe('igorns');
    });

    it('Testing importNode|clone|addChild', function() {
        var dom = new NgDOM(xmlDoc).clone(),
            dom2 = dom.clone();
        expect(dom.toString()).toBe(dom2.toString());
        var fc = dom.firstChild();
        var ne = dom2.createElement('import');
        fc.importNode(ne);
        fc.addChild(ne);
        var sb = fc.lastElementChild();
        expect(sb.type).toBe('import');

        var ne2 = dom2.createElement('mac');
        fc.importNode(ne2);
        fc.addChild(ne2);
        var sb2 = sb.nextElementSibling();
        expect(sb2.type).toBe('mac');
    });

    it('Testing remove', function() {
        var dom = new NgDOM(xmlDoc).clone(),
            dom2 = dom.clone();
        expect(dom.toString()).toBe(dom2.toString());
        var fc = dom.firstChild();
        var ne = dom2.createElement('import');
        ne.addChild(dom2.createElement('import2'));
        fc.importNode(ne);
        fc.addChild(ne);
        var sb = fc.lastElementChild(), sbfc = sb.firstChild();
        expect(sb.type).toBe('import');
        expect(sbfc.type).toBe('import2');
        expect(sb.toString()).toBe('<import><import2/></import>');

        var a = sb.node, b = sbfc.node;

        sb.remove();

        var sb2 = fc.lastElementChild();
        expect(sb2.type).toBe('annotation');
        expect(fc.getCached(a)).toBe(undefined);
        expect(fc.getCached(b)).toBe(undefined);
        expect(fc.getCached(fc.node)).toBe(fc);

    });
});



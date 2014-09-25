import {NgDOM} from '../src/class/ng-dom';
import {getXML, isNode, isNumber,  isMozilla, isDocumentFragmentNode} from '../src/core';

describe('NgDOM', function () {
    var xmlDoc;

    function clone(xmlDoc) {
        var dom = new NgDOM(xmlDoc);
        var clone = dom.clone();
        dom.destroy();
        return clone;
    }
    beforeEach(function () {
        getXML('/base/test/test.xml', function (data) {
            xmlDoc = data;
        }, false);
    });

    it('Should create an instance', function () {
        var dom = clone(xmlDoc);
        expect(dom instanceof NgDOM).toBe(true);
        expect(isNode(dom.node)).toBe(true);
        expect(dom.type).toBe('#document');
        expect(dom.typePrefix).toBe(null);
        expect(isNumber(dom.id)).toBe(true);

        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Should throw an error', function () {
        var message, dom;
        try {
            dom = new NgDOM();
        } catch (e) {
            message = e.message;
        }
        expect(message).toBe('NgDOM error node is not valid');

    });

    it('Should serialize to string', function() {
        var dom = clone(xmlDoc), cl = clone(xmlDoc);
        var str = dom.toString();

        expect(str).toBe(cl.toString());
        cl.destroy();
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Should be cached', function() {
        var dom = clone(xmlDoc);
        var inst = dom.getInstance(dom.node);
        expect(dom.id).toBe(inst.id);
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });


    it('Testing firstChild|firstElementChild', function() {
        var dom = clone(xmlDoc);
        var fc = dom.firstChild(), fc1, fc2;
        expect(fc.type).toBe('article');
        fc1 = fc.firstChild();
        fc2 = fc.firstElementChild();
        expect(fc1.type).toBe('#text');
        expect(fc2.type).toBe('title');
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing lastChild|lastElementChild', function() {
        var dom = clone(xmlDoc);
        var fc = dom.lastChild(), fc1, fc2;
        expect(fc.type).toBe('article');
        fc1 = fc.lastChild();
        fc2 = fc.lastElementChild();
        expect(fc1.type).toBe('#text');
        expect(fc2.type).toBe('annotation');
        expect(fc2.typePrefix).toBe('igorns');
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing nextSibling|nextElementSibling', function() {
        var dom = clone(xmlDoc);
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
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing previousSibling|previousElementSibling', function() {
        var dom = clone(xmlDoc);
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
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing parentNode', function() {
        var dom = clone(xmlDoc);
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
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing createElement|createElementNs', function() {
        var dom = clone(xmlDoc);
        var fc = dom.firstChild(), lc = fc.lastElementChild();
        var node = fc.createElement('test'), node2;
        expect(node.type).toBe('test');
        expect(lc.type).toBe('annotation');

        node2 = lc.createElementNs("http://www.igorivanovic.info", "igorns:what");
        expect(node2.type).toBe('what');
        expect(node2.typePrefix).toBe('igorns');

        dom.destroy();
        node2.destroy();
        node.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing importNode|clone|addChild', function() {
        var dom = clone(xmlDoc), dom2 = clone(xmlDoc);

        expect(dom.toString()).toBe(dom2.toString());
        expect(dom === dom2).toBe(false);
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
        dom.destroy();
        dom2.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing remove|importNode', function() {
        var dom = clone(xmlDoc), dom2 = clone(xmlDoc);
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
        dom.destroy();
        dom2.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing replaceNode', function() {
        var dom = clone(xmlDoc), dom2 = clone(xmlDoc);
        expect(dom.toString()).toBe(dom2.toString());

        var nn = dom.createElement('test');
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

        sb.replaceNode(nn);


        var sb2 = fc.lastElementChild();
        expect(sb2.type).toBe('test');
        expect(fc.getCached(a)).toBe(undefined);
        expect(fc.getCached(b)).toBe(undefined);
        expect(fc.getCached(fc.node)).toBe(fc);
        dom.destroy();
        dom2.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });


    it('Testing insertBefore', function() {
        var dom = clone(xmlDoc), dom2 = clone(xmlDoc);
        expect(dom.toString()).toBe(dom2.toString());

        var nn = dom.createElement('test');
        var fc = dom.firstChild();
        var ne = dom2.createElement('import');
        fc.importNode(ne);
        fc.addChild(nn);
        fc.insertBefore(ne, nn);


        var sb2 = fc.lastElementChild();
        expect(sb2.type).toBe('test');
        var sb3 = sb2.previousElementSibling();
        expect(sb3.type).toBe('import');

        dom.destroy();
        dom2.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });



    it('Testing isCached|getCached', function() {
        var dom = clone(xmlDoc), dom1 = clone(xmlDoc);

        var nn = dom.createElement('bold');
        var fc = dom.firstChild();
        fc.addChild(nn);

        expect(fc.isCached()).toBe(true);
        expect(nn.isCached()).toBe(true);

        expect(nn.getCached(fc.node)).toBe(fc);
        expect(fc.getCached(nn.node)).toBe(nn);
        dom.destroy();
        dom1.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing flushCache 1', function() {
        var dom = clone(xmlDoc), dom1 = clone(xmlDoc);

        var nn = dom.createElement('bold');
        var fc = dom.firstChild();
        fc.addChild(nn);

        expect(fc.isCached()).toBe(true);
        expect(nn.isCached()).toBe(true);

        expect(nn.getCached(fc.node)).toBe(fc);
        expect(fc.getCached(nn.node)).toBe(nn);

        nn.flushCache();

        expect(fc.isCached()).toBe(true);
        expect(nn.isCached()).toBe(false);

        expect(nn.getCached(fc.node)).toBe(fc);
        expect(fc.getCached(nn.node)).toBe(undefined);
        dom.destroy();
        dom1.destroy();
        expect(dom.getCacheSize()).toBe(0);

    });


    it('Testing flushCache 2', function() {
        var dom = clone(xmlDoc), dom1 = clone(xmlDoc);

        var nn = dom.createElement('bold');
        var fc = dom.firstChild();
        fc.addChild(nn);
        expect(fc.isCached()).toBe(true);
        expect(nn.isCached()).toBe(true);

        expect(nn.getCached(fc.node)).toBe(fc);
        expect(fc.getCached(nn.node)).toBe(nn);


        fc.flushCache();

        expect(fc.isCached()).toBe(false);
        expect(nn.isCached()).toBe(false);

        expect(nn.getCached(fc.node)).toBe(undefined);
        expect(fc.getCached(nn.node)).toBe(undefined);
        dom.destroy();
        dom1.destroy();


        expect(fc.getCacheSize()).toBe(0);
    });


    it('Testing destroy|clean', function() {
        var dom = clone(xmlDoc), dom1 = clone(xmlDoc),
            fc, lc;
        fc = dom.firstChild();
        lc = fc.lastElementChild();
        expect(fc.type).toBe('article');
        expect(lc.type).toBe('annotation');
        dom1.destroy();
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
        expect(dom.node).toBe(null);
        expect(fc.node).toBe(null);
        expect(lc.node).toBe(null);
        expect(fc.type).toBe(null);
        expect(lc.type).toBe(null);
    });

    it('Testing isCommentNode|isTextNode|isElementNode|isDocumentNode destroy and cache size', function() {
        var dom = clone(xmlDoc), dom1 = clone(xmlDoc), e1, e2, e3, e4;
        dom1.destroy();
        expect(dom.getCacheSize()).toBe(1);
        e1 = dom.firstChild();
        expect(dom.getCacheSize()).toBe(2);
        e2 = e1.lastElementChild();
        expect(dom.getCacheSize()).toBe(3);
        e3 = e2.previousSibling();
        expect(dom.getCacheSize()).toBe(4);
        e4 = e3.previousSibling();
        expect(dom.getCacheSize()).toBe(5);
        expect(dom.isDocumentNode()).toBe(true);
        expect(e1.isElementNode()).toBe(true);
        expect(e2.isElementNode()).toBe(true);
        expect(e3.isTextNode()).toBe(true);
        expect(e4.isCommentNode()).toBe(true);

        e4.destroy();
        expect(dom.getCacheSize()).toBe(4);
        e3.destroy();
        expect(dom.getCacheSize()).toBe(3);
        e2.destroy();
        expect(dom.getCacheSize()).toBe(2);
        e1.destroy();
        expect(dom.getCacheSize()).toBe(1);

        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });



    it('Testing getDocument', function() {
        var dom = clone(xmlDoc), e1, e2, e3, e4, ne;
        e1 = dom.firstChild();
        e2 = e1.lastElementChild();
        e3 = e2.previousSibling();
        e4 = e3.previousSibling();
        ne = e4.createElement('a');

        expect(e1.getDocument()).toBe(dom);
        expect(e2.getDocument()).toBe(dom);
        expect(e3.getDocument()).toBe(dom);
        expect(e4.getDocument()).toBe(dom);
        expect(ne.getDocument()).toBe(dom);

        ne.destroy();
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });


    it('Testing children', function() {
        var dom = clone(xmlDoc), c1, c2, c3, fc = dom.firstElementChild(), fcl = fc.lastElementChild().previousElementSibling();
        c1 = dom.children();
        c2 = fc.children();
        c3 = fcl.children();
        //c4 = c3.children();
        expect(c1.length).toBe(1);
        expect(c2.length).toBe(11);
        expect(c3.length).toBe(7);
        expect(dom.getCacheSize()).toBe(20);
    });

    it('Testing childElements', function() {
        var dom = clone(xmlDoc), c1, c2, c3, fc = dom.firstElementChild(), fcl = fc.lastElementChild().previousElementSibling();
        c1 = dom.childElements();
        c2 = fc.childElements();
        c3 = fcl.childElements();
        //c4 = c3.children();
        expect(c1.length).toBe(1);
        expect(c2.length).toBe(4);
        expect(c3.length).toBe(3);
        expect(dom.getCacheSize()).toBe(29);
    });

    it('Testing flushAllCache', function() {
        var dom = clone(xmlDoc), c1, c2, c3, fc = dom.firstElementChild(), fcl = fc.lastElementChild().previousElementSibling();
        c1 = dom.childElements();
        c2 = fc.childElements();
        c3 = fcl.childElements();
        //c4 = c3.children();
        expect(c1.length).toBe(1);
        expect(c2.length).toBe(4);
        expect(c3.length).toBe(3);
        dom.flushAllCache();
        expect(dom.getCacheSize()).toBe(0);
    });


    it('Testing createFragment', function() {
        var dom = clone(xmlDoc);
        var fdoc = dom.createFragment();
        expect(fdoc.isDocumentFragmentNode()).toBe(true);
        dom.destroy();
        fdoc.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing hasChildren|removeChildren', function() {
        var dom = clone(xmlDoc);
        var fc = dom.firstElementChild();
        expect(fc.hasChildren()).toBe(true);
        fc.removeChildren();
        expect(fc.hasChildren()).toBe(false);
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });


    it('Testing parse', function() {
        var html = "<first><second>aaaa</second></first>";
        var dom = clone(xmlDoc);
        var fc = dom.parse(html);
        expect(fc.toString()).toBe(html);
        var e1 = fc.firstElementChild();
        var e2 = e1.firstElementChild();

        expect(e1.type).toBe('first');
        expect(e2.type).toBe('second');
        dom.destroy();
        fc.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });

    it('Testing setValue|getValue', function() {
        var html = "<first><second>aaaa bbbb cccc</second></first>";
        var dom = clone(xmlDoc);
        var fc = dom.firstElementChild();
        var lc = fc.lastElementChild();
        expect(lc.type).toBe('annotation');
        expect(lc.getValue()).toBe('ANN');
        lc.setValue(html);
        expect(lc.getValue()).toBe(html);

        var bc = lc.firstElementChild().firstElementChild();
        var bcf = bc.firstChild();

        expect(bcf.type).toBe('#text');
        expect(bcf.getValue()).toBe('aaaa bbbb cccc');
        bcf.setValue(html);
        expect(bcf.getValue()).toBe(html);
        expect(bcf.hasChildren()).toBe(false);
        bcf.setValue('1111');
        expect(bcf.getValue()).toBe('1111');
        expect(bcf.hasChildren()).toBe(false);
        dom.destroy();
        expect(dom.getCacheSize()).toBe(0);
    });
});



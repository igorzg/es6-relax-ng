import {NgSchema} from '../src/class/ng-schema';
import {getXML, isNode, isNumber,  isMozilla, isDocumentFragmentNode, instanceOf, removeWhiteSpace} from '../src/core';

describe('NgSchema', function () {
    var xmlDoc, xmlDocRng, xmlDocRngInvalid;

    function clone(xmlDoc) {
        var dom = new NgSchema(xmlDoc);
        var clone = dom.clone();
        dom.destroy();
        return clone;
    }

    beforeEach(function () {
        getXML('/base/test/xml/schema_1.rng', function (data) {
            xmlDoc = data;
        }, false);
        getXML('/base/test/xml/schema_2.rng', function (data) {
            xmlDocRng = data;
        }, false);
        getXML('/base/test/xml/schema_invalid.rng', function (data) {
            xmlDocRngInvalid = data;
        }, false);
    });
    it('should be invalid', function() {
        try {
            clone(xmlDocRngInvalid);
        } catch (e) {
            expect(e.message).toBe('Schema is not valid relax ng schema, missing ns or is not valid structure');
        }
    });

    it('should create an instance', function() {
        var schema = clone(xmlDoc);
        expect(instanceOf(schema, NgSchema)).toBe(true);
        expect(schema.localName).toBe(null);
    });

    it('should create an instance2', function() {
        var schema = clone(xmlDocRng);
        expect(instanceOf(schema, NgSchema)).toBe(true);
        expect(schema.localName).toBe('rng');
    });

    it('toString', function() {
        var schema = clone(xmlDoc), cloned = schema.clone();
        expect(schema.toString()).toBe(cloned.toString());
        expect(schema === cloned).toBe(false);
    });

    it('toString 2', function() {
        var schema = clone(xmlDocRng), cloned = schema.clone();
        expect(schema.toString()).toBe(cloned.toString());
        expect(schema === cloned).toBe(false);
    });


    it('traverse', function() {
        var schema = clone(xmlDocRng), counter = 0, counter2 = 0, counter3 = 0;

        schema.traverse(function(node) {
            var nNode, nNode2;
            if(this.matchNode(node, 'attribute') && node.getAttribute("name") === "replace") {
                nNode = schema.createElement('div');
                nNode.setAttribute("name", "replaced");
                nNode2 = schema.createElement('element');
                nNode.addChild(nNode2);
                counter2 += 1;
                return node.replaceNode(nNode);
            }
            counter2 += 1;
            counter3 += 1;
        });
        schema.traverse(function() {
            counter += 1;
        });
        schema.destroy();
        expect(counter).toBe(21);
        expect(counter2).toBe(22);
        expect(counter3).toBe(21);
    });



    it('step_1', function() {
        getXML('/base/test/xml/step_1/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(2);
        expect(schemaInstance.schema.querySelectorAll('externalRef').length).toBe(0);
    });

    it('step_1 fail', function() {
        var message = 'NgSchema traverse: invalid schema definition in step step_1 externalRef don\'t have provided correct parent current parent is "div" but allowed are: "attribute,choice,define,element,except,group,interleave,list,mixed,oneOrMore,optional,start,zeroOrMore" or node don\'t have correct namespace assigned';
        getXML('/base/test/xml/step_1/schema2.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        try {
            schemaInstance.step_1();
        } catch (e) {
            expect(e.message).toBe(message);
        }
    });


    it('step_1 fail 2', function() {
        var message = 'NgSchema traverse: external file don\'t have correct namespace external: "brb", don\'t match "rng" . Exchange external or internal to do correct schema merge.';
        getXML('/base/test/xml/step_1/schema3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        try {
            schemaInstance.step_1();
        } catch (e) {
            expect(e.message).toBe(message);
        }
    });



    it('step_2', function() {
        getXML('/base/test/xml/step_2/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(2);
        expect(schemaInstance.schema.querySelectorAll('include').length).toBe(0);
    });


    it('step_2 fail', function() {
        getXML('/base/test/xml/step_2/schema_invalid_children.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        try {
            schemaInstance.step_2();
        } catch (e) {
            expect(e.message).toBe('NgSchema traverse: invalid schema definition in step step_2, include don\'t have provided correct children, current children is element at index 0 but allowed are: define,div,start')
        }
    });

    it('step_2 fail 2', function() {
        getXML('/base/test/xml/step_2/schema_invalid_parent.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        try {
            schemaInstance.step_2();
        } catch (e) {
            expect(e.message).toBe('NgSchema traverse: invalid schema definition in step step_2 include don\'t have provided correct parent current parent is "element" but allowed are: "div,grammar" or node don\'t have correct namespace assigned')
        }
    });

    it('step_2 children no replace', function() {
        getXML('/base/test/xml/step_2/schema_valid_children_no_replace.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc), e1;
        schemaInstance.step_1();
        schemaInstance.step_2();
        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(2);
        expect(schemaInstance.schema.querySelectorAll('start').length).toBe(2);
        e1 = schemaInstance.schema.querySelector('define[name=inline]');
        expect(e1.firstElementChild().type).toBe('zeroOrMore');
        expect(e1.firstElementChild().getAttribute('name')).toBe(null);
    });

    it('step_2 children replace', function() {
        getXML('/base/test/xml/step_2/schema_valid_children_no_replace_2.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc), e1;
        schemaInstance.step_1();
        schemaInstance.step_2();
        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(2);
        expect(schemaInstance.schema.querySelectorAll('start').length).toBe(1);
        e1 = schemaInstance.schema.querySelector('define[name=inline]');
        expect(e1.firstElementChild().type).toBe('zeroOrMore');
        expect(e1.firstElementChild().getAttribute('name')).toBe(null);
    });

    it('step_2 children replace', function() {
        getXML('/base/test/xml/step_2/schema_valid_children_with_replace.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc), e1;
        schemaInstance.step_1();
        schemaInstance.step_2();

        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(2);
        expect(schemaInstance.schema.querySelectorAll('start').length).toBe(2);
        e1 = schemaInstance.schema.querySelector('define[name=inline]');
        expect(e1.firstElementChild().type).toBe('element');
        expect(e1.firstElementChild().getAttribute('name')).toBe('em');
    });


    it('step_3 merge grammars', function() {
        getXML('/base/test/xml/step_2/schema_valid_children_with_replace.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(1);
        expect(schemaInstance.schema.querySelectorAll('start').length).toBe(2);
    });

    it('step_4 merge starts no change', function() {
        getXML('/base/test/xml/step_2/schema_valid_children_with_replace.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(1);
        expect(schemaInstance.schema.querySelectorAll('start').length).toBe(2);
    });

    it('step_4 merge starts unwrap', function() {
        getXML('/base/test/xml/step_2/schema2.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(1);
        expect(schemaInstance.schema.querySelectorAll('start').length).toBe(1);
    });

    it('step_5 collect define', function() {
        getXML('/base/test/xml/step_2/schema2.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc), fc = schemaInstance.schema.firstElementChild();
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();

        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(1);
        expect(schemaInstance.schema.querySelectorAll('start').length).toBe(1);
        expect(fc.lastElementChild().type).toBe('define');
    });

    it('step_6 merge start', function() {
        getXML('/base/test/xml/step_2/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc), fc = schemaInstance.querySelector('start'), e1;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        expect(schemaInstance.schema.querySelectorAll('grammar').length).toBe(1);
        expect(schemaInstance.schema.querySelectorAll('start').length).toBe(1);
        expect(fc.hasChildren()).toBe(true);
        e1 = fc.firstElementChild();
        expect(e1.type).toBe('choice');
        expect(e1.childElements().length).toBe(2);
    });

    it('step_7 remove annotations', function() {
        getXML('/base/test/xml/step_7/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        expect(schemaInstance.querySelectorAll('element').length).toBe(7);
        schemaInstance.step_7();
        expect(schemaInstance.querySelectorAll('grammar').length).toBe(1);
        expect(schemaInstance.querySelectorAll('start').length).toBe(1);
        expect(schemaInstance.querySelectorAll('element').length).toBe(3);
    });

    it('step_8 remove whitespace', function() {
        getXML('/base/test/xml/step_7/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var result = `<?xml version="1.0" encoding="UTF-8" ?><rng:grammar xmlns:rng="http://relaxng.org/ns/structure/1.0" xmlns:cs="http://igorivanovic.info/relaxng/annotations/1.0"><rng:start><rng:ref name="id"/></rng:start><rng:define name="id"><rng:element name="addressBook"><rng:zeroOrMore><rng:element name="card"><rng:choice><rng:element name="name"><rng:text/></rng:element></rng:choice></rng:element></rng:zeroOrMore></rng:element></rng:define></rng:grammar>`;
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        expect(removeWhiteSpace(schemaInstance.toString())).toBe(removeWhiteSpace(result));
        expect(schemaInstance.querySelectorAll('grammar').length).toBe(1);
        expect(schemaInstance.querySelectorAll('start').length).toBe(1);
        expect(schemaInstance.querySelectorAll('element').length).toBe(3);
    });

    it('step_9 remove whitespace on attributes', function() {
        getXML('/base/test/xml/step_9/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
       var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();

        var all = schemaInstance.querySelectorAll("[name=id]");
        expect(all.shift().type).toBe("ref");
        expect(all.shift().type).toBe("define");

        expect(schemaInstance.querySelector("[combine=choice]").type).toBe("define");
        expect(schemaInstance.querySelector("[name=addressBook]").type).toBe("element");
        expect(schemaInstance.querySelector("[name=givenName]").type).toBe("element");
        expect(schemaInstance.querySelector("[name=email]").type).toBe("element");
        expect(schemaInstance.querySelector("[name=note]").type).toBe("element");
        expect(schemaInstance.querySelector("[type=ccc1]").type).toBe("element");
    });

    it('step_10 Inherit datatype', function() {
        getXML('/base/test/xml/step_10/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var url = "http://www.w3.org/2001/XMLSchema-datatypes";
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();

        var all = schemaInstance.querySelectorAll("value,data");
        all.forEach(function(item){
            expect(item.hasAttribute("datatypeLibrary")).toBe(true);
            expect(item.getAttribute("datatypeLibrary")).toBe(url);
        });
        expect(all.length).toBe(4);

        var all2 = schemaInstance.querySelectorAll("[name=id]");
        expect(all2.shift().type).toBe("ref");
        expect(all2.shift().type).toBe("define");

        expect(schemaInstance.querySelector("[combine=interleave]").type).toBe("define");
        expect(schemaInstance.querySelector("[type=int]").type).toBe("data");
        expect(schemaInstance.querySelector("[type=int]").firstElementChild().type).toBe("param");
        expect(schemaInstance.querySelector("[type=int]").firstElementChild().getValue()).toBe(" 123 ");

        var all3 = schemaInstance.querySelectorAll("[name=id]");
        expect(all3.shift().type).toBe("ref");
        expect(all3.shift().type).toBe("define");
    });

    it('step_11 separate name nodes', function() {
        getXML('/base/test/xml/step_10/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        //schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();

        var all = schemaInstance.querySelectorAll("name");
        expect(all.length).toBe(9);
        next("addressBook");
        next("attraddressBook");
        next("card");
        next("name");
        next("name");
        next("givenName");
        next("familyName");
        next("email");
        next("note");
        function next(value) {
            var n = all.shift();
            expect(n.type).toBe("name");
            expect(n.getValue()).toBe(value);
        }
    });

    it('step_12 inherit ns attributes', function() {
        getXML('/base/test/xml/step_12/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        //schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();

        var url = "http://relaxng.org/ns/test1";
        var all = schemaInstance.querySelectorAll('[ns="'+url+'"]');
        expect(all.length).toBe(2);
        expect(all.shift().type).toBe('element');
        var el = all.shift();
        expect(el.type).toBe('name');
        expect(el.getValue()).toBe('card');
    });

    it('step_13 remove ns attributes from different elements', function() {
        getXML('/base/test/xml/step_12/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        //schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();

        var url = "http://relaxng.org/ns/test1";
        var all = schemaInstance.querySelectorAll('[ns="'+url+'"]');
        expect(all.length).toBe(1);
        var el = all.shift();
        expect(el.type).toBe('name');
        expect(el.getValue()).toBe('card');
    });


    it('step_14 remove namespaced name values and assign valid ns', function() {
        getXML('/base/test/xml/step_14/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
       // schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();

        var url = "http://igorivanovic.info/cs";
        var all = schemaInstance.querySelectorAll('[ns="'+url+'"]');
        expect(all.length).toBe(1);
        var el = all.shift();
        expect(el.type).toBe('name');
        expect(el.getValue()).toBe('card');
    });


    it('step_15  each div element is replaced by its children.', function() {
        getXML('/base/test/xml/step_15/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        //schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();

        var el = schemaInstance.querySelector('zeroOrMore'), el1, el2, el3, el4;
        expect(el.type).toBe('zeroOrMore');
        el1 = el.firstElementChild();
        expect(el1.type).toBe('element');
        el1 = el1.firstElementChild();
        el2 = el1.nextElementSibling();
        el3 = el2.nextElementSibling();
        el4 = el3.nextElementSibling();
        expect(el1.type).toBe('name');
        expect(el2.type).toBe('choice');
        expect(el3.type).toBe('element');
        expect(el4.type).toBe('optional');
    });

    it('step_16  oneOrMore, zeroOrMore, optional', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        //schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();

        var all = schemaInstance.querySelectorAll(['define', 'oneOrMore', 'zeroOrMore', 'optional', 'list', 'mixed'].join(','));
        expect(all.length).toBe(10);
        all.forEach(function(node) {
           expect(node.getChildElementCount()).toBe(1);
        });
    });


    it('step_17  element must have exact two child elements first is name and rest', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        //schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();

        var all = schemaInstance.querySelectorAll('element');
        var expectCard = false;
        expect(all.length).toBe(14);
        all.forEach(function(node) {
            var fc = node.firstElementChild();
            expect(fc.type).toBe('name');
            if (fc.getValue() === 'card') {
                expectCard = true;
                expect(fc.nextElementSibling().type).toBe('group');
            }
            expect(node.getChildElementCount()).toBe(2);
        });
        expect(expectCard).toBe(true);
    });


    it('step_18 except children wrap with choice if more than 1 child', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        //schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        var el = schemaInstance.querySelector('except');
        expect(el.firstElementChild().type).toBe('choice');
    });


    it('step_19 attribute', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        ///schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();

        var all = schemaInstance.querySelectorAll('attribute');
        expect(all.length).toBe(3);
        all.forEach(function(node) {
            expect(node.getChildElementCount()).toBe(2);
        });
    });


    it('step_20 choice, group or interleave element', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        ///schemaInstance.config.removeWhiteSpace = false;
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        var el = schemaInstance.querySelector('ref[name="foreign-elements"]');
        expect(el.type).toBe('ref');
        expect(el.parentNode().type).toBe('choice');
        schemaInstance.step_20();
        var all = schemaInstance.querySelectorAll(['choice', 'group', 'interleave'].join(','));
        expect(all.length).toBe(10);
        all.forEach(function(node) {
            expect(node.getChildElementCount() > 1).toBe(true);
        });

        el = schemaInstance.querySelector('ref[name="foreign-elements"]');
        expect(el.type).toBe('ref');
        expect(el.parentNode().type).toBe('group');


    });

    it('step_21 choice, group or interleave deep transform', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();

        var all = schemaInstance.querySelectorAll(['choice', 'group', 'interleave'].join(','));
        expect(all.length).toBe(14);
        all.forEach(function(node) {
            expect(node.getChildElementCount()).toBe(2);
        });

    });

    it('step_22 mixed patterns are transformed', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        var all = schemaInstance.querySelectorAll('interleave');
        expect(all.length).toBe(2);
        all.forEach(function(node) {
            expect(node.getChildElementCount()).toBe(2);
        });
    });



    it('step_23 optional is transformed to choice', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        var all = schemaInstance.querySelectorAll('optional');
        expect(all.length).toBe(2);
        schemaInstance.step_23();
        all = schemaInstance.querySelectorAll('optional');
        expect(all.length).toBe(0);

        all = schemaInstance.querySelectorAll('choice');
        expect(all.length).toBe(7);
        all.forEach(function(node) {
            expect(node.getChildElementCount()).toBe(2);
        });
    });


    it('step_24 optional is transformed to choice', function() {
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        schemaInstance.step_23();
        var all = schemaInstance.querySelectorAll('zeroOrMore');
        expect(all.length).toBe(4);
        schemaInstance.step_24();
        all = schemaInstance.querySelectorAll('zeroOrMore');
        expect(all.length).toBe(0);
        all =  schemaInstance.querySelectorAll('oneOrMore');
        expect(all.length).toBe(4);
        //console.log(schemaInstance.toString(true));
    });

    it('step_25 combine choice', function() {
        getXML('/base/test/xml/step_25/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
        var key = 'choice';
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        schemaInstance.step_23();
        schemaInstance.step_24();
        var all = schemaInstance.querySelectorAll('define');
        expect(all.length).toBe(3);
        all.forEach(function(node) {
            expect(node.getAttribute('combine')).toBe(key);
        });
        schemaInstance.step_25();
        all = schemaInstance.querySelectorAll('define');
        expect(all.length).toBe(1);
        var el = schemaInstance.querySelector('define[name=id]');
        expect(el.type).toBe('define');
        var fc = el.firstElementChild();
        expect(fc.type).toBe(key);
        expect(fc.getChildElementCount()).toBe(2);
        fc.childElements().forEach(function(item) {
            expect(item.type).toBe(key);
        });
        //console.log(schemaInstance.toString(true));
    });
    it('step_25 combine interleave', function() {
        getXML('/base/test/xml/step_25/schema2.rng', function (data) {
            xmlDoc = data;
        }, false);
        var key = 'interleave';
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        schemaInstance.step_23();
        schemaInstance.step_24();
        var all = schemaInstance.querySelectorAll('define');
        expect(all.length).toBe(3);
        all.forEach(function(node) {
            expect(node.getAttribute('combine')).toBe(key);
        });
        schemaInstance.step_25();
        all = schemaInstance.querySelectorAll('define');
        expect(all.length).toBe(1);
        var el = schemaInstance.querySelector('define[name=id]');
        expect(el.type).toBe('define');
        var fc = el.firstElementChild();
        expect(fc.type).toBe(key);
        expect(fc.getChildElementCount()).toBe(2);
        expect(fc.firstElementChild().type).toBe(key);
        expect(fc.lastElementChild().type).toBe('choice');

        //console.log(schemaInstance.toString(true));
    });

    it('step_25 combine invalid', function() {
        getXML('/base/test/xml/step_25/schema_invalid.rng', function (data) {
            xmlDoc = data;
        }, false);
        var error = false;
        var key = 'NgSchema traverse: nodes with same name must have same combine attribute: <rng:define xmlns:rng="http://relaxng.org/ns/structure/1.0" name="id" combine="interleave"><rng:choice><rng:group><rng:group><rng:element><rng:name ns="">combine2</rng:name><rng:text/></rng:element><rng:element><rng:name ns="">combine2_1</rng:name><rng:text/></rng:element></rng:group><rng:interleave><rng:choice><rng:oneOrMore><rng:element><rng:name ns="">combine2_2</rng:name><rng:text/></rng:element></rng:oneOrMore><rng:empty/></rng:choice><rng:text/></rng:interleave></rng:group><rng:empty/></rng:choice></rng:define>, <rng:define xmlns:rng="http://relaxng.org/ns/structure/1.0" name="id" combine="choice"><rng:element><rng:name ns="">addressBook</rng:name><rng:group><rng:attribute><rng:name ns="">attrAddressBook</rng:name><rng:value datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes" type="token" ns="">asdasd</rng:value></rng:attribute><rng:choice><rng:oneOrMore><rng:group><rng:group><rng:element><rng:name ns="">card</rng:name><rng:group><rng:group><rng:choice><rng:choice><rng:choice><rng:interleave><rng:choice><rng:oneOrMore><rng:element><rng:name ns="">fnote1</rng:name><rng:interleave><rng:choice><rng:oneOrMore><rng:element><rng:name ns="">fnote4</rng:name><rng:text/></rng:element></rng:oneOrMore><rng:empty/></rng:choice><rng:text/></rng:interleave></rng:element></rng:oneOrMore><rng:empty/></rng:choice><rng:text/></rng:interleave><rng:element><rng:name ns="">name</rng:name><rng:text/></rng:element></rng:choice><rng:element><rng:name ns="">name2</rng:name><rng:text/></rng:element></rng:choice><rng:group><rng:element><rng:name ns="">givenName</rng:name><rng:text/></rng:element><rng:element><rng:name ns="">familyName</rng:name><rng:text/></rng:element></rng:group></rng:choice><rng:element><rng:name ns="">email</rng:name><rng:text/></rng:element></rng:group><rng:choice><rng:element><rng:name ns="">note</rng:name><rng:text/></rng:element><rng:empty/></rng:choice></rng:group></rng:element><rng:element><rng:name ns="">valid</rng:name><rng:text/></rng:element></rng:group><rng:interleave><rng:choice><rng:oneOrMore><rng:element><rng:name ns="">fnote2</rng:name><rng:text/></rng:element></rng:oneOrMore><rng:empty/></rng:choice><rng:text/></rng:interleave></rng:group></rng:oneOrMore><rng:empty/></rng:choice></rng:group></rng:element></rng:define>';
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        schemaInstance.step_23();
        schemaInstance.step_24();
        try {
            schemaInstance.step_25();
        } catch (e) {
            error = true;
            expect(e.message).toBe(key);
        }
        expect(error).toBe(true);


        //console.log(schemaInstance.toString(true));
    });

    it('step_25 combine invalid 2', function() {
        getXML('/base/test/xml/step_25/schema_invalid2.rng', function (data) {
            xmlDoc = data;
        }, false);
        var error = false;
        var key = 'NgSchema traverse: invalid combine value on node: <rng:define xmlns:rng="http://relaxng.org/ns/structure/1.0" name="id" combine="choice2"><rng:element><rng:name ns="">addressBook</rng:name><rng:group><rng:attribute><rng:name ns="">attrAddressBook</rng:name><rng:value datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes" type="token" ns="">asdasd</rng:value></rng:attribute><rng:choice><rng:oneOrMore><rng:group><rng:group><rng:element><rng:name ns="">card</rng:name><rng:group><rng:group><rng:choice><rng:choice><rng:choice><rng:interleave><rng:choice><rng:oneOrMore><rng:element><rng:name ns="">fnote1</rng:name><rng:interleave><rng:choice><rng:oneOrMore><rng:element><rng:name ns="">fnote4</rng:name><rng:text/></rng:element></rng:oneOrMore><rng:empty/></rng:choice><rng:text/></rng:interleave></rng:element></rng:oneOrMore><rng:empty/></rng:choice><rng:text/></rng:interleave><rng:element><rng:name ns="">name</rng:name><rng:text/></rng:element></rng:choice><rng:element><rng:name ns="">name2</rng:name><rng:text/></rng:element></rng:choice><rng:group><rng:element><rng:name ns="">givenName</rng:name><rng:text/></rng:element><rng:element><rng:name ns="">familyName</rng:name><rng:text/></rng:element></rng:group></rng:choice><rng:element><rng:name ns="">email</rng:name><rng:text/></rng:element></rng:group><rng:choice><rng:element><rng:name ns="">note</rng:name><rng:text/></rng:element><rng:empty/></rng:choice></rng:group></rng:element><rng:element><rng:name ns="">valid</rng:name><rng:text/></rng:element></rng:group><rng:interleave><rng:choice><rng:oneOrMore><rng:element><rng:name ns="">fnote2</rng:name><rng:text/></rng:element></rng:oneOrMore><rng:empty/></rng:choice><rng:text/></rng:interleave></rng:group></rng:oneOrMore><rng:empty/></rng:choice></rng:group></rng:element></rng:define>, allowed are "interleave,choice"';
        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        schemaInstance.step_23();
        schemaInstance.step_24();
        try {
            schemaInstance.step_25();
        } catch (e) {
            error = true;
            expect(e.message).toBe(key);
        }
        expect(error).toBe(true);
        //console.log(schemaInstance.toString(true));
    });

    it('step_26 replace parentRef', function() {
        getXML('/base/test/xml/step_26/schema.rng', function (data) {
            xmlDoc = data;
        }, false);
       var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        schemaInstance.step_23();
        schemaInstance.step_24();
        schemaInstance.step_25();
        var el = schemaInstance.querySelector('parentRef[name=id2]');
        expect(el.type).toBe('parentRef');
        var el2 = schemaInstance.querySelector('ref[name=id2]');
        expect(el2).toBe(null);
        schemaInstance.step_26();
        el = schemaInstance.querySelector('parentRef[name=id2]');
        expect(el).toBe(null);
        el2 = schemaInstance.querySelector('ref[name=id2]');
        expect(el2.type).toBe('ref');

        //console.log(schemaInstance.toString(true));
    });

    it('step_27 replace refs', function() {
        var xmlDoc2;
        getXML('/base/test/xml/step_27/schema.rng', function (data) {
            xmlDoc = data;
        }, false);


        var schemaInstance = clone(xmlDoc);
        schemaInstance.step_1();
        schemaInstance.step_2();
        schemaInstance.step_3();
        schemaInstance.step_4();
        schemaInstance.step_5();
        schemaInstance.step_6();
        schemaInstance.step_7();
        schemaInstance.step_8();
        schemaInstance.step_9();
        schemaInstance.step_10();
        schemaInstance.step_11();
        schemaInstance.step_12();
        schemaInstance.step_13();
        schemaInstance.step_14();
        schemaInstance.step_15();
        schemaInstance.step_16();
        schemaInstance.step_17();
        schemaInstance.step_18();
        schemaInstance.step_19();
        schemaInstance.step_20();
        schemaInstance.step_21();
        schemaInstance.step_22();
        schemaInstance.step_23();
        schemaInstance.step_24();
        schemaInstance.step_25();
        schemaInstance.step_26();
        var el = schemaInstance.querySelector('ref[name=id2]');
        expect(el.type).toBe('ref');
        var el2 = schemaInstance.querySelector('ref[name=id3]');
        expect(el2.type).toBe('ref');
        var el3 = schemaInstance.querySelector('ref[name=id4]');
        expect(el3.type).toBe('ref');
        var all = schemaInstance.querySelectorAll('define');
        expect(all.length).toBe(4);
        schemaInstance.step_27();

        el = schemaInstance.querySelector('ref[name=id2]');
        expect(el).toBe(null);
        el2 = schemaInstance.querySelector('ref[name=id3]');
        expect(el2).toBe(null);
        el3 = schemaInstance.querySelector('ref[name=id4]');
        expect(el3.type).toBe('ref');
        all = schemaInstance.querySelectorAll('define');
        expect(all.length).toBe(2);

        ///console.log(schemaInstance.toString(true));
    });



    it('step_28 - step_ 30 - cleanup', function() {
        var xmlDoc2;
        getXML('/base/test/xml/schema_3.rng', function (data) {
            xmlDoc = data;
        }, false);
        getXML('/base/test/xml/schema_3_result.rng', function (data) {
            xmlDoc2 = data;
        }, false);
        var schemaInstanceResult = clone(xmlDoc2);
        schemaInstanceResult.step_8();
        var schemaInstance = clone(xmlDoc);
        schemaInstance.simplify();
        expect(schemaInstance.toString(true)).toBe(schemaInstanceResult.toString(true));
    });
});

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
        schemaInstance.config.removeWhiteSpace = false;
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
});



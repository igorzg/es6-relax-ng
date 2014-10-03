import {NgSchema} from '../src/class/ng-schema';
import {getXML, isNode, isNumber,  isMozilla, isDocumentFragmentNode, instanceOf} from '../src/core';

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
    });

    it('step_1 fail', function() {
        var message = 'NgSchema traverse: invalid schema definition in step step_1 externalRef don\'t have provided correct parent current parent is "div" but allowed are: "attribute,choice,define,element,except,group,interleave,list,mixed,oneOrMore,optional,start,zeroOrMore"';
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
});



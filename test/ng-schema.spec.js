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
        expect(schema.localName).toBe('xmlns');
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
        var schema = clone(xmlDocRng), counter = 0, queue = [];

        schema.traverse(function(node) {
            if (node.isElementNode() && queue.indexOf(node) === -1) {
                counter += 1;
                queue.push(node);
            }
        });
        queue = [];
        schema.destroy();
        expect(counter).toBe(21);

    })



});



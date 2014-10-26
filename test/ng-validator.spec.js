import {NgValidator} from '../src/class/ng-validator';
import {NgSchema} from '../src/class/ng-schema';
import {NgPattern} from '../src/class/ng-pattern';
import {NgDOM} from '../src/class/ng-dom';
import {NgQName} from '../src/class/ng-qname';
import {getXML} from '../src/core';
describe('NgValidator', function () {

    var schemaInstance, patternInstance, xml;
    beforeEach(function () {
        getXML('/base/test/xml/schema_4.rng', false).then((data) => {
            schemaInstance = new NgSchema(data);
            schemaInstance.simplify();
            patternInstance = new NgPattern(schemaInstance);

        });

        getXML('/base/test/xml/test.xml', false).then((data) => {
            xml = new NgDOM(data);
        });
    });

    it('qName', function () {
        var validator = new NgValidator(patternInstance);

        var node = {
            typePrefix: 'nodePrefix',
            type: 'node',
            getNamespaces() {
                return [
                    {
                        prefix: 'xmlns',
                        localName: 'nodePrefix',
                        value: 'value'
                    }
                ];
            }
        };
        var node2 = {
            type: 'node',
            getNamespaces() {
                return [
                    {
                        name: 'xmlns',
                        value: 'value1'
                    }
                ];
            }
        };
        spyOn(node, 'getNamespaces').andCallThrough();
        spyOn(node2, 'getNamespaces').andCallThrough();
        var qNode = validator.qName(node);
        expect(node.getNamespaces).toHaveBeenCalled();
        expect(qNode.uri).toBe('value');
        expect(qNode.localName).toBe('node');
        expect(qNode instanceof NgQName).toBe(true);

        qNode = validator.qName(node2);
        expect(node2.getNamespaces).toHaveBeenCalled();
        expect(qNode.uri).toBe('value1');
        expect(qNode.localName).toBe('node');
        expect(qNode instanceof NgQName).toBe(true);
    });

    it('isWhitespace', function () {
        var validator = new NgValidator(patternInstance);
        expect(validator.isWhitespace(' ')).toBe(true);
        expect(validator.isWhitespace(' a')).toBe(false);
        expect(validator.isWhitespace(' a   ')).toBe(false);
    });


    it('normalizeWhitespace', function () {
        var validator = new NgValidator(patternInstance);
        expect(validator.normalizeWhitespace('      a           v      c')).toBe(' a v c');
        expect(validator.normalizeWhitespace('bbbb     aaaa ccc   ')).toBe('bbbb aaaa ccc ');
        expect(validator.normalizeWhitespace('ccc    aaa   bb')).toBe('ccc aaa bb');
    });



    it('strip', function () {
        var validator = new NgValidator(patternInstance);
        var commentF = false;
        var textF = true;
        var ctx = {
            isWhitespace(val) {
                return val;
            }
        };
        var node = {
            type: 'node',
            isCommentNode() {
                return commentF;
            },
            isTextNode() {
                return textF;
            },
            getValue() {
                return '1';
            }
        };
        spyOn(node, 'isCommentNode').andCallThrough();
        spyOn(node, 'isTextNode').andCallThrough();
        spyOn(node, 'getValue').andCallThrough();
        spyOn(ctx, 'isWhitespace').andCallThrough();
        var o = validator.strip.call(ctx, node);
        expect(node.isCommentNode).toHaveBeenCalled();
        expect(node.isTextNode).toHaveBeenCalled();
        expect(node.getValue).toHaveBeenCalled();
        expect(ctx.isWhitespace).toHaveBeenCalled();
        expect(o).toBe('1');

        commentF = true;
        o = validator.strip.call(ctx, node);
        expect(o).toBe(true);
        commentF = false;
        textF = false;
        o = validator.strip.call(ctx, node);
        expect(o).toBe(false);
    });




    it('contains', function () {
        var validator = new NgValidator(patternInstance);
        var qNode = {};
        var o;
        var pattern = {
            className: '',
            contains(a, b) {
                expect(a).toBe(pattern);
                expect(b).toBe(qNode);
                return true;
            }
        };
        spyOn(pattern, 'contains').andCallThrough();
        function createCase(className) {
            pattern.className = className;

            o = validator.contains(pattern, qNode);
            expect(pattern.contains).toHaveBeenCalled();
            expect(o).toBe(true);
        }

        createCase('NgAnyName');
        createCase('NgAnyNameExcept');
        createCase('NgNsName');
        createCase('NgNsNameExcept');
        createCase('NgName');
        createCase('NgNameClassChoice');

        pattern.className = 'bbb';
        o = validator.contains(pattern, qNode);
        expect(pattern.contains).toHaveBeenCalled();
        expect(o.className).toBe('NgNotAllowed');
        expect(o.errorClassName).toBe('NgValidatorContainsError');
    });




    it('nullable', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var pattern = {
            className: '',
            pattern1: 1,
            pattern2: 2,
            pattern: 0
        };
        var ctx = {
            nullable(a) {
                expect([1, 2, 0].indexOf(a) > -1).toBe(true);
                return '1';
            }
        };
        spyOn(ctx, 'nullable').andCallThrough();
        function createCase(className) {
            pattern.className = className;
            o = validator.nullable.call(ctx, pattern);
            expect(ctx.nullable).toHaveBeenCalled();
            expect(o).toBe('1');
        }

        createCase('NgGroup');
        createCase('NgInterLeave');
        createCase('NgChoice');
        createCase('NgOneOrMore');

        function createCase2(className, value) {
            pattern.className = className;
            o = validator.nullable(pattern);
            expect(o).toBe(value);
        }
        createCase2('NgElement', false);
        createCase2('NgAttribute', false);
        createCase2('NgList', false);
        createCase2('NgValue', false);
        createCase2('NgData', false);
        createCase2('NgDataExcept', false);
        createCase2('NgAfter', false);
        createCase2('NgNotAllowed', false);
        createCase2('NgEmpty', true);
        createCase2('NgText', true);

        pattern.className = '1';
        o = validator.nullable(pattern);
        expect(o.errorClassName).toBe('NgValidatorNullableError');
    });



    it('choice', function () {
        var validator = new NgValidator(patternInstance);

        var p1 = {
            className: ''
        };
        var p2 = {
            className: ''
        };

        function createCase(p1, p2, result) {
            var o = validator.choice(p1, p2);
            expect(o).toBe(result);
        }

        p2.className = 'NgNotAllowed';
        p1.className = '1';
        createCase(p1, p2, p1);
        p1.className = 'NgNotAllowed';
        p2.className = '1';
        createCase(p1, p2, p2);

        p2.className = 'NgEmpty';
        p1.className = 'NgEmpty';
        var o = validator.choice(p1, p2);
        expect(o.className).toBe('NgEmpty');



        p2.className = '1';
        p1.className = '2';
        o = validator.choice(p1, p2);
        expect(o.className).toBe('NgChoice');
    });


    it('group', function () {
        var validator = new NgValidator(patternInstance);

        var p1 = {
            className: ''
        };
        var p2 = {
            className: ''
        };


        function createCase(p1, p2, result) {
            var o = validator.group(p1, p2);
            expect(o).toBe(result);
        }

        p2.className = 'NgNotAllowed';
        p1.className = '1';
        createCase(p1, p2, p2);
        p1.className = 'NgNotAllowed';
        p2.className = '2';
        createCase(p1, p2, p1);


        p2.className = 'NgEmpty';
        p1.className = '3';
        createCase(p1, p2, p1);
        p1.className = 'NgEmpty';
        p2.className = '4';
        createCase(p1, p2, p2);



        p2.className = '1';
        p1.className = '2';
        var o = validator.group(p1, p2);
        expect(o.className).toBe('NgGroup');
    });



    it('interleave', function () {
        var validator = new NgValidator(patternInstance);

        var p1 = {
            className: ''
        };
        var p2 = {
            className: ''
        };


        function createCase(p1, p2, result) {
            var o = validator.interleave(p1, p2);
            expect(o).toBe(result);
        }

        p2.className = 'NgNotAllowed';
        p1.className = '1';
        createCase(p1, p2, p2);
        p1.className = 'NgNotAllowed';
        p2.className = '2';
        createCase(p1, p2, p1);


        p2.className = 'NgEmpty';
        p1.className = '3';
        createCase(p1, p2, p1);
        p1.className = 'NgEmpty';
        p2.className = '4';
        createCase(p1, p2, p2);



        p2.className = '1';
        p1.className = '2';
        var o = validator.interleave(p1, p2);
        expect(o.className).toBe('NgInterLeave');
    });



    it('after', function () {
        var validator = new NgValidator(patternInstance);

        var p1 = {
            className: ''
        };
        var p2 = {
            className: ''
        };


        function createCase(p1, p2, result) {
            var o = validator.after(p1, p2);
            expect(o).toBe(result);
        }

        p2.className = 'NgNotAllowed';
        p1.className = '1';
        createCase(p1, p2, p2);
        p1.className = 'NgNotAllowed';
        p2.className = '2';
        createCase(p1, p2, p1);
        p2.className = '1';
        p1.className = '2';
        var o = validator.after(p1, p2);
        expect(o.className).toBe('NgAfter');
    });


    it('oneOrMore', function () {
        var validator = new NgValidator(patternInstance);

        var p1 = {
            className: 'NgNotAllowed'
        };

        var o = validator.oneOrMore(p1);
        expect(o).toBe(p1);

        p1.className= '1';
        o = validator.oneOrMore(p1);
        expect(o.className).toBe('NgOneOrMore');
    });


    it('Construct', function () {
        var validator = new NgValidator(patternInstance);
        //console.log('xml', xml);
        var validation = validator.validate(xml);
        //console.log(validation.errorClassName);
        //console.log(validation);
    });


});

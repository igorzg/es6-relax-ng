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

        p1.className = '1';
        o = validator.oneOrMore(p1);
        expect(o.className).toBe('NgOneOrMore');
    });


    it('endTagDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var node = {};
        var p1 = {
            className: 'NgNotAllowed',
            endTagDeriv(a, b) {
                expect(a).toBe(p1);
                expect(b).toBe(node);
                return p1;
            }
        };
        var o;

        spyOn(p1, 'endTagDeriv').andCallThrough();
        o = validator.endTagDeriv(p1, node);
        expect(o).toBe(p1);

        p1.className = 'NgChoice';
        o = validator.endTagDeriv(p1, node);
        expect(o).toBe(p1);
        expect(p1.endTagDeriv).toHaveBeenCalled();

        p1.className = 'NgAfter';
        o = validator.endTagDeriv(p1, node);
        expect(o).toBe(p1);
        expect(p1.endTagDeriv).toHaveBeenCalled();


        p1.className = '1';
        o = validator.endTagDeriv(p1, node);
        expect(p1.endTagDeriv).toHaveBeenCalled();
        expect(o.errorClassName).toBe('NgValidatorEndTagDerivError');
    });


    it('applyAfter', function () {
        var validator = new NgValidator(patternInstance);


        var p1 = {
            className: 'NgNotAllowed',
            applyAfter(a, b) {
                expect(a).toBe(p1);
                expect(b).toBe(p1);
                return p1;
            }
        };
        var o;

        spyOn(p1, 'applyAfter').andCallThrough();
        o = validator.applyAfter(p1, p1);
        expect(o).toBe(p1);

        p1.className = 'NgChoice';
        o = validator.applyAfter(p1, p1);
        expect(o).toBe(p1);
        expect(p1.applyAfter).toHaveBeenCalled();

        p1.className = 'NgAfter';
        o = validator.applyAfter(p1, p1);
        expect(o).toBe(p1);
        expect(p1.applyAfter).toHaveBeenCalled();


        p1.className = '1';
        o = validator.applyAfter(p1, p1);
        expect(p1.applyAfter).toHaveBeenCalled();
        expect(o.errorClassName).toBe('NgValidatorApplyAfterError');
    });


    it('listDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var node = {};
        var p = {};
        var context = [];
        var str = [];
        var ctx = {
            textDeriv(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(p);
                expect(c).toBe(1);
                expect(d).toBe(node);
                return p;
            },
            listDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(p);
                expect(c).toBe(str);
                return b;
            }
        }
        var o;

        spyOn(ctx, 'textDeriv').andCallThrough();
        spyOn(ctx, 'listDeriv').andCallThrough();
        o = validator.listDeriv.call(ctx, context, p, str, node);
        expect(o).toBe(p);

        str.push(1);
        o = validator.listDeriv.call(ctx, context, p, str, node);
        expect(o).toBe(p);

        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(ctx.listDeriv).toHaveBeenCalled();


    });


    it('textDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var node = {};

        var context = [];
        var str = 'str';
        var pattern = {
            className: '',
            textDeriv(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe(str);
                expect(d).toBe(node);
                return 'textDeriv';
            }
        };
        spyOn(pattern, 'textDeriv').andCallThrough();
        function createCase(className, errorClassName, isCustom = true) {
            pattern.className = className;
            o = validator.textDeriv(context, pattern, str, node);
            if (errorClassName) {
                if (isCustom) {
                    expect(o.errorClassName).toBe(errorClassName);
                } else {
                    expect(o.className).toBe(errorClassName);
                }
            } else {
                expect(pattern.textDeriv).toHaveBeenCalled();
                expect(o).toBe('textDeriv');
            }
        }

        createCase('NgChoice');
        createCase('NgInterLeave');
        createCase('NgGroup');
        createCase('NgAfter');
        createCase('NgOneOrMore');
        createCase('NgText');
        createCase('NgValue');
        createCase('NgData');
        createCase('NgDataExcept');
        createCase('NgList');
        createCase('NgReference');


        createCase('NgEmpty', 'NgValidatorTextDerivNotAllowedError');
        createCase('NgElement', 'NgValidatorTextDerivNotAllowedError');
        createCase('NgNotAllowed', 'NgNotAllowed', false);

        createCase('1', 'NgValidatorTextDerivError');
    });


    it('attDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var node = {};

        var context = [];
        var pattern = {
            className: '',
            attDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe(node);
                return 'attDeriv';
            }
        };
        spyOn(pattern, 'attDeriv').andCallThrough();
        function createCase(className, errorClassName, isCustom = true) {
            pattern.className = className;
            o = validator.attDeriv(context, pattern, node);
            if (errorClassName) {
                if (isCustom) {
                    expect(o.errorClassName).toBe(errorClassName);
                } else {
                    expect(o.className).toBe(errorClassName);
                }
            } else {
                expect(pattern.attDeriv).toHaveBeenCalled();
                expect(o).toBe('attDeriv');
            }
        }

        createCase('NgAfter');
        createCase('NgChoice');
        createCase('NgGroup');
        createCase('NgInterLeave');
        createCase('NgOneOrMore');
        createCase('NgAttribute');
        createCase('NgReference');

        createCase('NgNotAllowed', 'NgNotAllowed', false);

        createCase('1', 'NgValidatorAttDerivError');
    });


    it('startTagOpenDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var node = {};

        var qName = {};
        var pattern = {
            className: '',
            startTagOpenDeriv(a, b, c) {
                expect(a).toBe(pattern);
                expect(b).toBe(qName);
                expect(c).toBe(node);
                return 'startTagOpenDeriv';
            }
        };
        spyOn(pattern, 'startTagOpenDeriv').andCallThrough();
        function createCase(className, errorClassName, isCustom = true) {
            pattern.className = className;
            o = validator.startTagOpenDeriv(pattern, qName, node);
            if (errorClassName) {
                if (isCustom) {
                    expect(o.errorClassName).toBe(errorClassName);
                } else {
                    expect(o.className).toBe(errorClassName);
                }
            } else {
                expect(pattern.startTagOpenDeriv).toHaveBeenCalled();
                expect(o).toBe('startTagOpenDeriv');
            }
        }

        createCase('NgChoice');
        createCase('NgElement');
        createCase('NgInterLeave');
        createCase('NgOneOrMore');
        createCase('NgGroup');
        createCase('NgReference');
        createCase('NgAfter');

        createCase('NgEmpty', 'NgValidatorStartTagOpenDerivNgEmptyError');
        createCase('NgNotAllowed', 'NgNotAllowed', false);

        createCase('1', 'NgValidatorStartTagOpenDerivError');
    });


    it('startTagCloseDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var hasAttriubte = true;
        var node = {
            hasAttribute() {
                return hasAttriubte;
            }
        };
        var pattern = {
            className: '',
            nameClass: {
                localName: '1'
            },
            startTagCloseDeriv(a, b) {
                expect(a).toBe(pattern);
                expect(b).toBe(node);
                return 'startTagCloseDeriv';
            }
        };
        spyOn(node, 'hasAttribute').andCallThrough();
        spyOn(pattern, 'startTagCloseDeriv').andCallThrough();
        function createCase(className, errorClassName, isCustom = true) {
            pattern.className = className;
            o = validator.startTagCloseDeriv(pattern, node);
            if (errorClassName) {
                if (isCustom) {
                    expect(o.errorClassName).toBe(errorClassName);
                } else {
                    expect(o.className).toBe(errorClassName);
                }
            } else {
                expect(pattern.startTagCloseDeriv).toHaveBeenCalled();
                expect(o).toBe('startTagCloseDeriv');
            }
        }

        createCase('NgReference');
        createCase('NgAfter');
        createCase('NgChoice');
        createCase('NgGroup');
        createCase('NgInterLeave');
        createCase('NgOneOrMore');

        createCase('NgAttribute', 'NgAttributeInvalidValueError');
        expect(node.hasAttribute).toHaveBeenCalled();
        hasAttriubte = false;
        pattern.nameClass.localName = null;
        createCase('NgAttribute', 'NgAttributeMissingValueError');
        expect(node.hasAttribute).toHaveBeenCalled();

        pattern.className = '1';
        createCase('1', '1', false);
    });


    it('attsDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var node = {};
        var attrs = [];
        var context = [];
        var pattern = {
            className: 'NgChoice'
        };
        var ctx = {
            attsDeriv(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe(attrs);
                expect(d).toBe(node);
                return 'attsDeriv';
            },
            attDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c.className).toBe('NgAttributeNode');
                return pattern;
            }
        };

        spyOn(ctx, 'attsDeriv').andCallThrough();
        spyOn(ctx, 'attDeriv').andCallThrough();

        o = validator.attsDeriv.call(ctx, context, pattern, attrs, node);
        expect(o).toBe(pattern);

        attrs.push({
            namespaceURI: "http://www.w3.org/2000/xmlns/"
        });
        o = validator.attsDeriv.call(ctx, context, pattern, attrs, node);
        expect(o).toBe('attsDeriv');
        expect(ctx.attsDeriv).toHaveBeenCalled();


        attrs.push({
            namespaceURI: "1",
            localName: "ln",
            value: 'value'
        });
        o = validator.attsDeriv.call(ctx, context, pattern, attrs, node);
        expect(o).toBe('attsDeriv');
        expect(ctx.attsDeriv).toHaveBeenCalled();
        expect(ctx.attDeriv).toHaveBeenCalled();
    });


    it('valueMatch', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var node = {};
        var str = 'aaa';
        var context = [];
        var pattern = {
            className: 'NgChoice'
        };
        var isNullable = true;
        var ctx = {
            nullable() {
                return isNullable;
            },
            isWhitespace() {
                return true;
            },
            textDeriv(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe(str);
                expect(d).toBe(node);
                return 'textDeriv';
            }
        };

        spyOn(ctx, 'nullable').andCallThrough();
        spyOn(ctx, 'isWhitespace').andCallThrough();
        spyOn(ctx, 'textDeriv').andCallThrough();
        o = validator.valueMatch.call(ctx, context, pattern, str, node);
        expect(o.className).toBe('NgEmpty');
        expect(ctx.nullable).toHaveBeenCalled();
        expect(ctx.isWhitespace).toHaveBeenCalled();
        isNullable = false;


        o = validator.valueMatch.call(ctx, context, pattern, str, node);
        expect(o).toBe('textDeriv');
        expect(ctx.nullable).toHaveBeenCalled();
        expect(ctx.isWhitespace).toHaveBeenCalled();
        expect(ctx.textDeriv).toHaveBeenCalled();
    });


    it('datatypeAllows', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var str = 'aaa';
        var datatype = {
            localName: "token",
            uri: null
        };
        var context = [];
        var paramlist = [];
        var ctx = {
            datatypeLibrary: {
                datatypeAllows: function (a, b, c, d) {
                    expect(a).toBe(datatype);
                    expect(b).toBe(paramlist);
                    expect(c).toBe(str);
                    expect(d).toBe(context);
                    return 'datatypeAllows';
                }
            }
        };
        var message;


        o = validator.datatypeAllows.call(ctx, datatype, paramlist, str, context);
        expect(o.className).toBe('NgEmpty');

        datatype.localName = "null";
        o = validator.datatypeAllows.call(ctx, datatype, paramlist, str, context);
        expect(o.className).toBe('NgNotAllowed');
        expect(o.errorClassName).toBe('NgDataTypeError');
        datatype.uri = "token";
        datatype.localName = "token";
        spyOn(ctx.datatypeLibrary, 'datatypeAllows').andCallThrough();
        o = validator.datatypeAllows.call(ctx, datatype, paramlist, str, context);
        expect(o).toBe('datatypeAllows');
        expect(ctx.datatypeLibrary.datatypeAllows).toHaveBeenCalled();
        try {
            ctx.datatypeLibrary = {};
            validator.datatypeAllows.call(ctx, datatype, paramlist, str, context);
        } catch (e) {
            message = e.message;
        }

        expect(message).toBe('datatypeLibrary don\'t have an datatypeAllows method');
    });


    it('datatypeEqual', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var str = 'aaa';
        var str1 = 'aaa';
        var datatype = {
            localName: "string",
            uri: null
        };
        var context = [];
        var context1 = [];
        var ctx = {
            datatypeLibrary: {
                datatypeEqual: function (a, b, c, d, e) {
                    expect(a).toBe(datatype);
                    expect(b).toBe(str);
                    expect(c).toBe(context);
                    expect(d).toBe(str1);
                    expect(e).toBe(context1);
                    return 'datatypeEqual';
                }
            },
            normalizeWhitespace(a) {
                return a;
            }
        };
        var message;
        spyOn(ctx.datatypeLibrary, 'datatypeEqual').andCallThrough();
        spyOn(ctx, 'normalizeWhitespace').andCallThrough();

        o = validator.datatypeEqual.call(ctx, datatype, str, context, str1, context1);
        expect(o.className).toBe('NgEmpty');
        str1 = 'bbb';
        o = validator.datatypeEqual.call(ctx, datatype, str, context, str1, context1);
        expect(o.className).toBe('NgNotAllowed');
        expect(o.errorClassName).toBe('NgDataTypeEqualityError');
        datatype.localName = 'token';

        str1 = 'aaa';
        o = validator.datatypeEqual.call(ctx, datatype, str, context, str1, context1);
        expect(o.className).toBe('NgEmpty');
        expect(ctx.normalizeWhitespace).toHaveBeenCalled();
        str1 = 'bbb';
        o = validator.datatypeEqual.call(ctx, datatype, str, context, str1, context1);
        expect(o.className).toBe('NgNotAllowed');
        expect(o.errorClassName).toBe('NgDataTypeEqualityError');
        expect(ctx.normalizeWhitespace).toHaveBeenCalled();

        datatype.localName = 'null';
        o = validator.datatypeEqual.call(ctx, datatype, str, context, str1, context1);
        expect(o.className).toBe('NgNotAllowed');
        expect(o.errorClassName).toBe('NgDataTypeError');


        datatype.uri = "token";

        o = validator.datatypeEqual.call(ctx, datatype, str, context, str1, context1);
        expect(o).toBe('datatypeEqual');

        try {
            ctx.datatypeLibrary = {};
            validator.datatypeEqual.call(ctx, datatype, str, context, str1, context1);
        } catch (e) {
            message = e.message;
        }
        expect(message).toBe('datatypeLibrary don\'t have an datatypeEqual method');
    });


    it('childrenDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var isTextNode = true;
        var isWhitespace = true;
        var o;
        var children = [];
        var context = [];
        var pattern = {};
        var node = {
            isTextNode() {
                return isTextNode;
            },
            getValue() {

            }
        };
        var ctx = {
            childDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe(node);
                return 'childDeriv';
            },
            isWhitespace(a) {
                return isWhitespace;
            },
            choice(a, b) {
                expect(a).toBe(pattern);
                expect(b).toBe('childDeriv');
                return 'choice';
            },
            stripChildrenDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe(children);
                return 'strip';
            }
        };

        spyOn(ctx, 'childDeriv').andCallThrough();
        spyOn(ctx, 'isWhitespace').andCallThrough();
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'stripChildrenDeriv').andCallThrough();

        o = validator.childrenDeriv.call(ctx, context, pattern, children);
        expect(o).toBe(pattern);

        children.push(node);
        o = validator.childrenDeriv.call(ctx, context, pattern, children);
        expect(o).toBe('choice');

        expect(ctx.childDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.isWhitespace).toHaveBeenCalled();

        isWhitespace = false;
        children.push(node);
        o = validator.childrenDeriv.call(ctx, context, pattern, children);
        expect(o).toBe('childDeriv');

        expect(ctx.childDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        isTextNode = false;
        isWhitespace = false;
        children.push(node);
        o = validator.childrenDeriv.call(ctx, context, pattern, children);
        expect(o).toBe('strip');
    });


    it('stripChildrenDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var strip = false;
        var o;
        var children = [];
        var context = [];
        var pattern = {};
        var node = {};
        var ctx = {
            childDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe(node);
                return pattern;
            },
            strip() {
                return strip;
            },
            stripChildrenDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe(children);
                return 'strip';
            }
        };

        spyOn(ctx, 'childDeriv').andCallThrough();
        spyOn(ctx, 'strip').andCallThrough();
        spyOn(ctx, 'stripChildrenDeriv').andCallThrough();

        o = validator.stripChildrenDeriv.call(ctx, context, pattern, children);
        expect(o).toBe(pattern);

        children.push(node);
        o = validator.stripChildrenDeriv.call(ctx, context, pattern, children);
        expect(o).toBe('strip');
        expect(ctx.childDeriv).toHaveBeenCalled();
        expect(ctx.strip).toHaveBeenCalled();
        expect(ctx.stripChildrenDeriv).toHaveBeenCalled();
    });


    it('childDeriv', function () {
        var validator = new NgValidator(patternInstance);
        var textNode = true;
        var isElNode = true;
        var o;
        var context = [];
        var pattern = {};
        var node = {
            getValue() {
                return 'value';
            },
            isTextNode() {
                return textNode;
            },
            isElementNode() {
                return isElNode;
            },
            getNamespaces() {
                return 'namespaces';
            },
            getAttributes() {
                return 'attributes';
            },
            children() {
                return 'children';
            }
        };
        var ctx = {
            textDeriv(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(pattern);
                expect(c).toBe('value');
                expect(d).toBe(node);
                return pattern;
            },
            qName(a) {
                expect(a).toBe(node);
                return a;
            },
            startTagOpenDeriv(a, b, c) {
                expect(a).toBe(pattern);
                expect(b).toBe(node);
                expect(c).toBe(node);
                return pattern;
            },
            attsDeriv(a, b, c, d) {
                expect(a).toBe('namespaces');
                expect(b).toBe(pattern);
                expect(c).toBe('attributes');
                expect(d).toBe(node);
                return b;
            },
            startTagCloseDeriv(a, b) {
                expect(a).toBe(pattern);
                expect(b).toBe(node);
                return a;
            },
            childrenDeriv(a, b, c) {
                expect(a).toBe('namespaces');
                expect(b).toBe(pattern);
                expect(c).toBe('children');
                return b;
            },
            endTagDeriv(a, b) {
                expect(a).toBe(pattern);
                expect(b).toBe(node);
                return a;
            }
        };
        spyOn(node, 'getValue').andCallThrough();
        spyOn(node, 'isTextNode').andCallThrough();
        spyOn(node, 'isElementNode').andCallThrough();
        spyOn(node, 'getNamespaces').andCallThrough();
        spyOn(node, 'getAttributes').andCallThrough();
        spyOn(node, 'children').andCallThrough();


        spyOn(ctx, 'textDeriv').andCallThrough();
        spyOn(ctx, 'qName').andCallThrough();
        spyOn(ctx, 'startTagOpenDeriv').andCallThrough();
        spyOn(ctx, 'attsDeriv').andCallThrough();
        spyOn(ctx, 'startTagCloseDeriv').andCallThrough();
        spyOn(ctx, 'childrenDeriv').andCallThrough();
        spyOn(ctx, 'endTagDeriv').andCallThrough();

        o = validator.childDeriv.call(ctx, context, pattern, node);
        expect(o).toBe(pattern);
        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(node.getValue).toHaveBeenCalled();
        expect(node.isTextNode).toHaveBeenCalled();

        textNode = false;
        o = validator.childDeriv.call(ctx, context, pattern, node);
        expect(o).toBe(pattern);
        expect(ctx.qName).toHaveBeenCalled();
        expect(ctx.startTagOpenDeriv).toHaveBeenCalled();
        expect(ctx.attsDeriv).toHaveBeenCalled();
        expect(ctx.startTagCloseDeriv).toHaveBeenCalled();
        expect(ctx.childrenDeriv).toHaveBeenCalled();
        expect(ctx.endTagDeriv).toHaveBeenCalled();

        expect(node.isElementNode).toHaveBeenCalled();
        expect(node.getNamespaces).toHaveBeenCalled();
        expect(node.children).toHaveBeenCalled();


        textNode = false;
        isElNode = false;


        var message;
        try {
            o = validator.childDeriv.call(ctx, context, pattern, node);
            expect(o).toBe(pattern);
            expect(node.isElementNode).toHaveBeenCalled();
            expect(node.isTextNode).toHaveBeenCalled();
        } catch (e) {
            message = e.message;
        }

        expect(message).toBe('only text and element nodes are allowed in childDeriv');

    });


    it('validate', function () {
        var validator = new NgValidator(patternInstance);
        var o;
        var pattern = {};

        var node = new NgDOM({nodeType: 3});
        node.isDocumentNode = function () {
            return true;
        };
        node.firstElementChild = function () {
            return node;
        };
        var ctx = {
            childDeriv(a, b, c) {
                expect(a.className).toBe('NgContext');
                expect(b).toBe(pattern);
                expect(c).toBe(node);
                return 'childDeriv';
            },
            patternInstance: {
                getPattern() {
                    return pattern;
                }
            }
        };


        spyOn(node, 'isDocumentNode').andCallThrough();
        spyOn(node, 'firstElementChild').andCallThrough();
        spyOn(ctx, 'childDeriv').andCallThrough();
        spyOn(ctx.patternInstance, 'getPattern').andCallThrough();

        o = validator.validate.call(ctx, node, null);
        expect(o).toBe('childDeriv');

        expect(node.isDocumentNode).toHaveBeenCalled();
        expect(node.firstElementChild).toHaveBeenCalled();
        expect(ctx.childDeriv).toHaveBeenCalled();


        o = validator.validate.call(ctx, node, pattern);
        expect(o).toBe('childDeriv');

        expect(node.isDocumentNode).toHaveBeenCalled();
        expect(node.firstElementChild).toHaveBeenCalled();
        expect(ctx.childDeriv).toHaveBeenCalled();
        expect(ctx.patternInstance.getPattern).toHaveBeenCalled();
    });

    it('Construct', function () {
        var validator = new NgValidator(patternInstance);
        var validation = validator.validate(xml);
        expect(validation.errorClassName).toBe('NgElementError');
        expect(validation.className).toBe('NgNotAllowed');
        expect(validation.message).toBe(`invalid tag name: 'title' or uri: '',
        expected tag name is: 'content' and uri: ''`);
    });


});

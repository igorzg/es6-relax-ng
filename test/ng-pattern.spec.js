import {NgSchema} from '../src/class/ng-schema';
import {NgPattern} from '../src/class/ng-pattern';
import {getXML} from '../src/core';
import {NgClass} from '../src/class/ng-class';
import {NgError} from '../src/class/ng-error';
import {NgContext} from '../src/class/ng-context';
import {NgReference} from '../src/class/ng-reference';
import {NgElement} from '../src/class/ng-element';
import {NgAttribute} from '../src/class/ng-attribute';
import {NgAnyNameExcept} from '../src/class/ng-any-name-except';
import {NgNsNameExcept} from '../src/class/ng-ns-name-except';
import {NgAnyName} from '../src/class/ng-any-name';
import {NgNsName} from '../src/class/ng-ns-name';
import {NgName} from '../src/class/ng-name';
import {NgChoice} from '../src/class/ng-choice';
import {NgInterLeave} from '../src/class/ng-interleave';
import {NgGroup} from '../src/class/ng-group';
import {NgOneOrMore} from '../src/class/ng-one-or-more';
import {NgNameClassChoice} from '../src/class/ng-name-class-choice';
import {NgList} from '../src/class/ng-list';
import {NgText} from '../src/class/ng-text';
import {NgNotAllowed} from '../src/class/ng-not-allowed';
import {NgEmpty} from '../src/class/ng-empty';
import {NgParam} from '../src/class/ng-param';
import {NgData} from '../src/class/ng-data';
import {NgDataExcept} from '../src/class/ng-data-except';
import {NgDataType} from '../src/class/ng-data-type';
import {NgValue} from '../src/class/ng-value';

describe('NgPattern', function () {
    var schemaInstance, schemaInstance2;
    beforeEach(function () {
        getXML('/base/test/xml/schema_3.rng', false).then((data) => {
            schemaInstance = new NgSchema(data);
            schemaInstance.simplify();
        });
        getXML('/base/test/xml/schema.rng', false).then((data) => {
            schemaInstance2 = new NgSchema(data);
            schemaInstance2.simplify();
        });
    });

    it('construct', function() {
        //console.log(schemaInstance.toString(true));
        var paternInstance = new NgPattern(schemaInstance), message;
        expect(paternInstance.className).toBe('NgPattern');
        expect(paternInstance.schemaInstance).toBe(schemaInstance);

        try {
            new NgPattern();
        } catch (e) {
            message = e.message;
        }
        expect(message).toBe('schema object is not valid schema instance it must be NgSchema');
    });

    it('create pattern creation partly', function() {

        var paternInstance = new NgPattern(schemaInstance);
        expect(paternInstance.className).toBe('NgPattern');
        expect(paternInstance.schemaInstance).toBe(schemaInstance);

        var p = paternInstance.pattern, p1, p2, a, b, e;
        expect(p instanceof NgGroup).toBe(true);
        a = p.pattern1;
        e = p.pattern2;
        expect(a instanceof NgElement).toBe(true);
        expect(e instanceof NgChoice).toBe(true);
        p1 = a.nameClass;
        p2 = a.pattern;
        expect(p1 instanceof NgName).toBe(true);
        expect(p1.uri).toBe("");
        expect(p1.localName).toBe("addressBook");
        expect(p2 instanceof NgGroup).toBe(true);
        a = p2.pattern1;
        b = p2.pattern2;
        expect(a instanceof NgAttribute).toBe(true);
        expect(b instanceof NgChoice).toBe(true);
        expect(a.nameClass instanceof NgName).toBe(true);
        expect(a.pattern instanceof NgValue).toBe(true);
        expect(a.nameClass.uri).toBe("");
        expect(a.nameClass.localName).toBe("attrAddressBook");

        expect(a.pattern.string).toBe("asdasd");
        expect(a.pattern.datatype instanceof NgDataType).toBe(true);
        expect(a.pattern.datatype.uri).toBe("http://www.w3.org/2001/XMLSchema-datatypes");
        expect(a.pattern.datatype.localName).toBe("token");

        expect(b.pattern1 instanceof NgOneOrMore).toBe(true);
        expect(b.pattern2 instanceof NgEmpty).toBe(true);
        expect(b.pattern1.pattern instanceof NgGroup).toBe(true);
        p1 = b.pattern1.pattern.pattern1;
        p2 = b.pattern1.pattern.pattern2;
        expect(p1 instanceof NgElement).toBe(true);
        expect(p2 instanceof NgElement).toBe(true);

        p1 = e.pattern1;
        p2 = p1.pattern2;
        expect(p2 instanceof NgElement).toBe(true);
        p1 = p2.pattern;
        p2 = p1.pattern2;
        p1 = p2.pattern1;
        expect(p1 instanceof NgOneOrMore).toBe(true);
        p = p1.pattern;
        expect(p instanceof NgElement).toBe(true);
        expect(p.nameClass.localName).toBe("musthave");
        p1 = p.pattern;
        expect(p1 instanceof NgAttribute).toBe(true);
        expect(p1.nameClass instanceof NgAnyNameExcept).toBe(true);
        p = p1.nameClass.nameClass;
        expect(p.nameClass1 instanceof NgNameClassChoice).toBe(true);
        expect(p.nameClass2 instanceof NgNsName).toBe(true);

        p1 = p.nameClass1;
        p2 = p.nameClass2;

        expect(p2.uri).toBe("http://igorivanovic.info/ns");

        expect(p1.nameClass1.uri).toBe("");
        expect(p1.nameClass2.uri).toBe("http://igorivanovic.info/javascript");
    });



    it('ref', function() {
        var selector = 'define[name="text"]';
        var pattern = {
            name: 'text',
            pattern: selector
        };
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {getAttribute() {return 'text';}};
        var ctx = {
            schemaInstance: {
                querySelector(value) {
                    expect(value).toBe(selector);
                    return value;
                }
            },
            refCache: [],
            getDefinition(value) {
                expect(value).toBe(selector);
                return value;
            }
        };
        spyOn(ctx.schemaInstance, 'querySelector').andCallThrough();
        spyOn(ctx, 'getDefinition').andCallThrough();

        var result = paternInstance.ref.call(ctx, node, new NgContext);

        expect(ctx.schemaInstance.querySelector).toHaveBeenCalled();
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(result).toBe(selector);

        expect(ctx.refCache.length).toBe(1);
        expect(ctx.refCache[0].name).toBe(pattern.name);
        expect(ctx.refCache[0].pattern).toBe(pattern.pattern);

        result = paternInstance.ref.call(ctx, node, new NgContext);
        expect(result instanceof NgReference).toBe(true);
        expect(ctx.refCache.length).toBe(1);
        expect(result.name).toBe('text');
        expect(result.func()).toBe(selector);
    });


    it('element', function() {
        var calls = 0;
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return node;},
            nextElementSibling() {return 'next';}
        };
        var ctx = {
            getDefinition(value) {
                if (typeof value === 'string') {
                    expect(value).toBe('next');
                }
                ++calls;
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        var result = paternInstance.element.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(calls).toBe(2);
        expect(result instanceof NgElement).toBe(true);
        expect(result.nameClass).toBe(node);
        expect(result.pattern).toBe('next');
    });


    it('attribute', function() {
        var calls = 0;
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return node;},
            nextElementSibling() {return 'next';}
        };
        var ctx = {
            getDefinition(value) {
                if (typeof value === 'string') {
                    expect(value).toBe('next');
                }
                ++calls;
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        var result = paternInstance.attribute.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(calls).toBe(2);
        expect(result instanceof NgAttribute).toBe(true);
        expect(result.nameClass).toBe(node);
        expect(result.pattern).toBe('next');
    });


    it('group', function() {
        var calls = 0;
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return node;},
            nextElementSibling() {return 'next';}
        };
        var ctx = {
            getDefinition(value) {
                if (typeof value === 'string') {
                    expect(value).toBe('next');
                }
                ++calls;
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        var result = paternInstance.group.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(calls).toBe(2);
        expect(result instanceof NgGroup).toBe(true);
        expect(result.pattern1).toBe(node);
        expect(result.pattern2).toBe('next');
    });


    it('interleave', function() {
        var calls = 0;
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return node;},
            nextElementSibling() {return 'next';}
        };
        var ctx = {
            getDefinition(value) {
                if (typeof value === 'string') {
                    expect(value).toBe('next');
                }
                ++calls;
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        var result = paternInstance.interleave.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(calls).toBe(2);
        expect(result instanceof NgInterLeave).toBe(true);
        expect(result.pattern1).toBe(node);
        expect(result.pattern2).toBe('next');
    });


    it('choice', function() {
        var calls = 0;
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return node;},
            nextElementSibling() {return 'next';}
        };
        var ctx = {
            getDefinition(value) {
                if (typeof value === 'string') {
                    expect(value).toBe('next');
                }
                ++calls;
                return value;
            },
            isNameClassChoice() {return false;}
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        spyOn(ctx, 'isNameClassChoice').andCallThrough();
        var result = paternInstance.choice.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(ctx.isNameClassChoice).toHaveBeenCalled();
        expect(calls).toBe(2);
        expect(result instanceof NgChoice).toBe(true);
        expect(result.pattern1).toBe(node);
        expect(result.pattern2).toBe('next');
    });

    it('choice name class', function() {
        var calls = 0;
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return node;},
            nextElementSibling() {return 'next';}
        };
        var ctx = {
            getDefinition(value) {
                if (typeof value === 'string') {
                    expect(value).toBe('next');
                }
                ++calls;
                return value;
            },
            isNameClassChoice() {return true;}
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        spyOn(ctx, 'isNameClassChoice').andCallThrough();
        var result = paternInstance.choice.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(ctx.isNameClassChoice).toHaveBeenCalled();
        expect(calls).toBe(2);
        expect(result instanceof NgNameClassChoice).toBe(true);
        expect(result.nameClass1).toBe(node);
        expect(result.nameClass2).toBe('next');
    });


    it('except', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var parent = {
            type: 'anyName',
            getAttribute(ns) {
                expect(ns).toBe(ns);
                return ns;
            }
        };
        var node = {
            firstElementChild() {return 'first';},
            parentNode() {
                return parent;
            },
            toXML() {
                return 'first';
            }
        };
        var ctx = {
            getDefinition(value) {
                expect(value).toBe('first');
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        var result = paternInstance.except.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(result instanceof NgAnyNameExcept).toBe(true);
        expect(result.nameClass).toBe('first');

        parent.type = 'nsName';
        result = paternInstance.except.call(ctx, node, new NgContext);
        expect(result instanceof NgNsNameExcept).toBe(true);
        expect(result.uri).toBe('ns');
        expect(result.nameClass).toBe('first');

        parent.type = 'data';
        result = paternInstance.except.call(ctx, node, new NgContext);
        expect(result).toBe('first');

        parent.type = '111';
        var message;
        try {
            paternInstance.except.call(ctx, node, new NgContext);
        } catch (e) {
            message = e.message;
        }
        expect(message).toBe('excepted valid pattern at node "first"');
    });



    it('define', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return 'first';}
        };
        var ctx = {
            getDefinition(value) {
                expect(value).toBe('first');
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        var result = paternInstance.define.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(result).toBe('first');
    });

    it('anyName', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var hasChildren = false;
        var node = {
            firstElementChild() {return 'first';},
            hasChildElements() {
                return hasChildren;
            }
        };
        var ctx = {
            getDefinition(value) {
                expect(value).toBe('first');
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        spyOn(node, 'hasChildElements').andCallThrough();
        spyOn(node, 'firstElementChild').andCallThrough();
        var result = paternInstance.anyName.call(ctx, node, new NgContext);
        expect(result instanceof NgAnyName).toBe(true);

        hasChildren = true;
        result = paternInstance.anyName.call(ctx, node, new NgContext);
        expect(result).toBe('first');
        expect(node.hasChildElements).toHaveBeenCalled();
        expect(node.firstElementChild).toHaveBeenCalled();
        expect(ctx.getDefinition).toHaveBeenCalled();

    });


    it('nsName', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var hasChildren = false;
        var node = {
            firstElementChild() {return 'first';},
            hasChildElements() {
                return hasChildren;
            },
            getAttribute(value) {
                return value;
            }
        };
        var ctx = {
            getDefinition(value) {
                expect(value).toBe('first');
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        spyOn(node, 'hasChildElements').andCallThrough();
        spyOn(node, 'firstElementChild').andCallThrough();
        var result = paternInstance.nsName.call(ctx, node, new NgContext);
        expect(result instanceof NgNsName).toBe(true);
        expect(result.uri).toBe('ns');

        hasChildren = true;
        result = paternInstance.nsName.call(ctx, node, new NgContext);
        expect(result).toBe('first');
        expect(node.hasChildElements).toHaveBeenCalled();
        expect(node.firstElementChild).toHaveBeenCalled();
        expect(ctx.getDefinition).toHaveBeenCalled();

    });


    it('name', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            textContent() {return 'context';},
            getAttribute(value) {
                return value;
            }
        };

        spyOn(node, 'textContent').andCallThrough();
        spyOn(node, 'getAttribute').andCallThrough();
        var result = paternInstance.name(node);
        expect(result instanceof NgName).toBe(true);
        expect(result.uri).toBe('ns');
        expect(result.localName).toBe('context');
        expect(node.textContent).toHaveBeenCalled();
        expect(node.getAttribute).toHaveBeenCalled();


    });

    it('param', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            textContent() {return 'param';},
            getAttribute(value) {
                return value;
            }
        };

        spyOn(node, 'textContent').andCallThrough();
        spyOn(node, 'getAttribute').andCallThrough();
        var result = paternInstance.param(node);
        expect(result instanceof NgParam).toBe(true);
        expect(result.string).toBe('param');
        expect(result.localName).toBe('name');
        expect(node.textContent).toHaveBeenCalled();
        expect(node.getAttribute).toHaveBeenCalled();
    });

    it('value', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            textContent() {return 'value';}
        };
        var ctx = {
            datatype(value) {
                expect(value).toBe(node);
                return 'dt';
            },
            namespace(value, ctx) {
                expect(value).toBe(node);
                expect(ctx instanceof NgContext).toBe(true);
                return 'ns';
            }
        }

        spyOn(ctx, 'datatype').andCallThrough();
        spyOn(ctx, 'namespace').andCallThrough();
        spyOn(node, 'textContent').andCallThrough();
        var result = paternInstance.value.call(ctx, node, new NgContext);
        expect(result instanceof NgValue).toBe(true);
        expect(result.string).toBe('value');
        expect(result.datatype).toBe('dt');
        expect(result.context).toBe('ns');
        expect(node.textContent).toHaveBeenCalled();
        expect(ctx.datatype).toHaveBeenCalled();
        expect(ctx.namespace).toHaveBeenCalled();
    });

    it('namespace', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            getAttribute(value) {return value;}
        };

        spyOn(node, 'getAttribute').andCallThrough();
        var result = paternInstance.namespace(node, new NgContext("uri"));
        expect(result instanceof NgContext).toBe(true);
        expect(result.uri).toBe('uri');
        expect(result.map.length).toBe(1);
        expect(result.map[0]).toBe('xmlns');
        expect(node.getAttribute).toHaveBeenCalled();

    });

    it('datatype', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            getAttribute(value) {return value;}
        };

        spyOn(node, 'getAttribute').andCallThrough();
        var result = paternInstance.datatype(node);
        expect(result instanceof NgDataType).toBe(true);
        expect(result.uri).toBe('datatypeLibrary');
        expect(result.localName).toBe('type');
        expect(node.getAttribute).toHaveBeenCalled();

    });


    it('oneOrMore', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return 'oneOrMore';}
        };
        var ctx = {
            getDefinition(value) {
                expect(value).toBe('oneOrMore');
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        var result = paternInstance.oneOrMore.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(result instanceof NgOneOrMore).toBe(true);
        expect(result.pattern).toBe('oneOrMore');
    });


    it('list', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            firstElementChild() {return 'list';}
        };
        var ctx = {
            getDefinition(value) {
                expect(value).toBe('list');
                return value;
            }
        };
        spyOn(ctx, 'getDefinition').andCallThrough();
        var result = paternInstance.list.call(ctx, node, new NgContext);
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(result instanceof NgList).toBe(true);
        expect(result.pattern).toBe('list');
    });


    it('data', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var isExcept = false;
        var called = 0;
        var cNode = {
            name: 'list',
            is(value) {
                expect(value).toBe('except');
                return isExcept;
            },
            nextElementSibling() {
                if (called > 4) {
                    return false;
                }
                cNode.name = 'next';
                ++called;
                return cNode;
            }
        };
        var node = {
            firstElementChild() {return cNode;}
        };
        var ctx = {
            getDefinition(value) {

                return value;
            },
            datatype(value) {
                return 'dt';
            }
        };
        spyOn(cNode, 'is').andCallThrough();
        spyOn(cNode, 'nextElementSibling').andCallThrough();
        spyOn(node, 'firstElementChild').andCallThrough();
        spyOn(ctx, 'getDefinition').andCallThrough();
        spyOn(ctx, 'datatype').andCallThrough();
        var result = paternInstance.data.call(ctx, node, new NgContext);
        expect(cNode.is).toHaveBeenCalled();
        expect(cNode.nextElementSibling).toHaveBeenCalled();
        expect(node.firstElementChild).toHaveBeenCalled();
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(ctx.datatype).toHaveBeenCalled();
        expect(result instanceof NgData).toBe(true);
        expect(result.datatype).toBe('dt');
        expect(result.paramList.length).toBe(6);
    });



    it('data except', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var isExcept = true;
        var called = 0;
        var cNode = {
            name: 'list',
            is() {
                return isExcept;
            },
            nextElementSibling() {
                if (called > 4) {
                    return false;
                }
                if (called > 0) {
                    isExcept = false;
                }
                cNode.name = 'next';
                ++called;
                return cNode;
            }
        };
        var node = {
            firstElementChild() {return cNode;}
        };
        var ctx = {
            getDefinition(value) {

                return value;
            },
            datatype(value) {
                return 'dt';
            }
        };
        spyOn(cNode, 'is').andCallThrough();
        spyOn(cNode, 'nextElementSibling').andCallThrough();
        spyOn(node, 'firstElementChild').andCallThrough();
        spyOn(ctx, 'getDefinition').andCallThrough();
        spyOn(ctx, 'datatype').andCallThrough();


        var result = paternInstance.data.call(ctx, node, new NgContext);
        expect(cNode.is).toHaveBeenCalled();
        expect(cNode.nextElementSibling).toHaveBeenCalled();
        expect(node.firstElementChild).toHaveBeenCalled();
        expect(ctx.getDefinition).toHaveBeenCalled();
        expect(ctx.datatype).toHaveBeenCalled();
        expect(result instanceof NgDataExcept).toBe(true);
        expect(result.datatype).toBe('dt');
        expect(result.paramList.length).toBe(4);
        expect(result.pattern.name).toBe('next');
    });

    it('isNameClassChoice true', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            name: 'parent',
            parentNode() {
                return node;
            },
            is(m1) {
               expect(m1.length).toBe(3);
               expect(m1.pop()).toBe('name');
               expect(m1.pop()).toBe('nsName');
               expect(m1.pop()).toBe('anyName');
               return true;
            },
            isDocumentNode() {
                return false;
            }
        };

        spyOn(node, 'parentNode').andCallThrough();
        spyOn(node, 'is').andCallThrough();
        var result = paternInstance.isNameClassChoice(node);
        expect(node.parentNode).toHaveBeenCalled();
        expect(node.is).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('isNameClassChoice false', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            name: 'parent',
            parentNode() {
                return node;
            },
            is(m1) {
                if (m1.length === 2) {
                    expect(m1.length).toBe(2);
                    expect(m1.pop()).toBe('attribute');
                    expect(m1.pop()).toBe('element');
                    return true;
                }
            },
            isDocumentNode() {
                return false;
            }
        };

        spyOn(node, 'parentNode').andCallThrough();
        spyOn(node, 'is').andCallThrough();
        var result = paternInstance.isNameClassChoice(node);
        expect(node.parentNode).toHaveBeenCalled();
        expect(node.is).toHaveBeenCalled();
        expect(result).toBe(false);
    });


    it('getDefinition', function() {
        var paternInstance = new NgPattern(schemaInstance2, false);
        var node = {
            type: 'parent',
            toXML() {
                return 'parent';
            }
        };
        var context = [];


        var ctx = {
            define(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            ref(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            element(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            attribute(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            except(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            anyName(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            nsName(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            name(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            choice(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            interleave(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            group(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            oneOrMore(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            list(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            param(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            value(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            },
            data(a, b) {
                expect(a).toBe(node);
                expect(b).toBe(context);
            }
        };

        var cases = [
            'define', 'ref', 'element', 'attribute', 'except',
            'anyName', 'nsName', 'name', 'choice', 'interleave',
            'group', 'oneOrMore', 'list', 'param', 'value',
            'data'
        ];
        var result;






        spyOn(node, 'toXML').andCallThrough();

        function createTestCase(method) {
            node.type = method;
            paternInstance.getDefinition.call(ctx, node, context);
            expect(ctx[method]).toHaveBeenCalled();
        }

        cases.forEach((item) => {
            spyOn(ctx, item);
            createTestCase(item);
        });

        node.type = 'text';
        result = paternInstance.getDefinition.call(ctx, node, context);
        expect(result instanceof NgText).toBe(true);
        node.type = 'notAllowed';
        result = paternInstance.getDefinition.call(ctx, node, context);
        expect(result instanceof NgNotAllowed).toBe(true);
        node.type = 'empty';
        result = paternInstance.getDefinition.call(ctx, node, context);
        expect(result instanceof NgEmpty).toBe(true);


        var message;
        node.type = 'parent';
        try {
            paternInstance.getDefinition.call(ctx, node, context);
        } catch (e) {
            message = e.message;
        }
        var m1 = `No valid node provided, pattern is not recognized
        or schema is not simplified correctly, current node: parent`;
        expect(message).toBe(m1);


    });


    it('copy', function() {
        var paternInstance = new NgPattern(schemaInstance2);
        var clone = paternInstance.clone();

        expect(paternInstance === clone).toBe(false);
        expect(paternInstance.pattern === clone.pattern).toBe(false);
        expect(JSON.stringify(paternInstance.pattern)).toBe(JSON.stringify(clone.pattern));
        expect(JSON.stringify(paternInstance.pattern) == JSON.stringify(clone.pattern)).toBe(true);
        clone.pattern.pattern = {
            pattern1: 1,
            pattern2: 2
        };
        expect(JSON.stringify(paternInstance.pattern) == JSON.stringify(clone.pattern)).toBe(false);
    });



    it('getPattern', function() {
        var paternInstance = new NgPattern(schemaInstance2);
        expect(JSON.stringify(paternInstance.getPattern())).toBe(JSON.stringify(paternInstance.pattern));

    });

});



import {NgClass} from './ng-class';
import {NgError} from './ng-error';
import {NgContext} from './ng-context';
import {NgSchema} from './ng-schema';
import {NgReference} from './ng-reference';
import {NgElement} from './ng-element';
import {NgAttribute} from './ng-attribute';
import {NgAnyNameExcept} from './ng-any-name-except';
import {NgNsNameExcept} from './ng-ns-name-except';
import {NgAnyName} from './ng-any-name';
import {NgNsName} from './ng-ns-name';
import {NgName} from './ng-name';
import {NgChoice} from './ng-choice';
import {NgInterLeave} from './ng-interleave';
import {NgGroup} from './ng-group';
import {NgOneOrMore} from './ng-one-or-more';
import {NgNameClassChoice} from './ng-name-class-choice';
import {NgList} from './ng-list';
import {NgText} from './ng-text';
import {NgNotAllowed} from './ng-not-allowed';
import {NgEmpty} from './ng-empty';
import {NgParam} from './ng-param';
import {NgData} from './ng-data';
import {NgDataExcept} from './ng-data-except';
import {NgDataType} from './ng-data-type';
import {NgValue} from './ng-value';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgPattern
 *
 * @constructor
 * @description
 *
 * NgPattern class is creating pattern ot of schema for validation algorithm
 */
export class NgPattern extends NgClass{

    constructor(schema, createPattern = true) {
        var element;
        super(NgPattern);
        this.className = 'NgPattern';
        this.context = new NgContext();
        this.schemaInstance = null;
        this.pattern = null;
        this.refCache = [];
        if (schema instanceof NgSchema) {
            this.schemaInstance = schema;
        } else {
            throw new NgError('schema object is not valid schema instance it must be NgSchema')
        }
        element = this.schemaInstance.querySelector('start').firstElementChild();
        if (!element) {
            throw new NgError('No valid start element provided');
        }
        if (createPattern) {
            this.pattern = this.getDefinition(element, this.context);
        }
    }

    /**
     * @since 0.0.1
     * @method NgPattern#ref
     * @description
     * Create ref pattern
     */
    ref(node, context) {
        var name, define, pattern, created;
        name = node.getAttribute('name');
        define = this.schemaInstance.querySelector('define[name="' + name + '"]');
        pattern = this.refCache.find((item) => {return item.name === name;});

        if (pattern) {
            return new NgReference(name, () => {
                var ref = this.refCache.find((item) => {return item.name === name;});
                if (!ref || !ref.pattern) {
                    throw new NgError("No reference found {0}, {1}",  name, ref);
                }
                return ref.pattern;
            });
        }
        created = {
            name: name,
            pattern: null
        };
        this.refCache.push(created);
        pattern = this.getDefinition(define, new NgContext(context.uri));
        created.pattern = pattern;
        return pattern;
    }
    /**
     * @since 0.0.1
     * @method NgPattern#element
     * @description
     * Create element pattern
     */
    element(node, context) {
        var fc, si, p1, p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        return new NgElement(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#attribute
     * @description
     * Create attribute pattern
     */
    attribute(node, context) {
        var fc, si, p1, p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        return new NgAttribute(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#except
     * @description
     * Create except pattern
     */
    except(node, context) {
        var pattern = this.getDefinition(node.firstElementChild(), context),
            parent = node.parentNode();
        switch (parent.type) {
            case 'anyName':
                return new NgAnyNameExcept(pattern);
                break;
            case 'nsName':
                return new NgNsNameExcept(parent.getAttribute('ns'), pattern);
                break;
            case 'data':
                return pattern;
                break;
        }
        throw new NgError('excepted valid pattern at node "{0}"', node.toXML());
    }
    /**
     * @since 0.0.1
     * @method NgPattern#define
     * @description
     * Create define pattern
     */
    define(node, context) {
        return this.getDefinition(node.firstElementChild(), context);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#anyName
     * @description
     * Create anyName pattern
     */
    anyName(node, context) {
        if (node.hasChildElements()) {
            return this.getDefinition(node.firstElementChild(), context);
        }
        return new NgAnyName();
    }
    /**
     * @since 0.0.1
     * @method NgPattern#nsName
     * @description
     * Create nsName pattern
     */
    nsName(node, context) {
        if (node.hasChildElements()) {
            return this.getDefinition(node.firstElementChild(), context);
        }
        return new NgNsName(node.getAttribute('ns'));
    }
    /**
     * @since 0.0.1
     * @method NgPattern#name
     * @description
     * Create name pattern
     */
    name(node) {
        return new NgName(node.getAttribute('ns'), node.textContent());
    }
    /**
     * @since 0.0.1
     * @method NgPattern#choice
     * @description
     * Create choice pattern
     */
    choice(node, context) {
        var fc, si, p1, p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        if (this.isNameClassChoice(node)) {
            return new NgNameClassChoice(p1, p2);
        }
        return new NgChoice(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#isNameClassChoice
     * @description
     * Check if node is name class choice pattern
     */
    isNameClassChoice(node) {

        for(let parent of gen(node.parentNode())) {
            if (parent.is(['anyName', 'nsName', 'name'])) {
                return true;
            } else if (parent.is(['element', 'attribute'])) {
                return false;
            }
        }

        function* gen(node) {
            while(node) {
                if (node.isDocumentNode()) {
                    break;
                } else {
                    yield node;
                }
                node = node.parentNode();
            }
        }
    }
    /**
     * @since 0.0.1
     * @method NgPattern#group
     * @description
     * Create group pattern
     */
    group(node, context) {
        var fc, si, p1, p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        return new NgGroup(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#interleave
     * @description
     * Create interleave pattern
     */
    interleave(node, context) {
        var fc, si, p1, p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        return new NgInterLeave(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#oneOrMore
     * @description
     * Create oneOrMore pattern
     */
    oneOrMore(node, context) {
        var p = this.getDefinition(node.firstElementChild(), context);
        return new NgOneOrMore(p);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#list
     * @description
     * Create list pattern
     */
    list(node, context) {
        var p = this.getDefinition(node.firstElementChild(), context);
        return new NgList(p);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#param
     * @description
     * Create param pattern
     */
    param(node) {
        return new NgParam(node.getAttribute('name'), node.textContent());
    }
    /**
     * @since 0.0.1
     * @method NgPattern#namespace
     * @description
     * Gets namespace pattern
     */
    namespace(node, context) {
        var ctx = new NgContext(), ns = node.getAttribute('xmlns');
        Object.assign(ctx, context);
        if (ns) {
            ctx.map.push(ns);
        }
        return ctx;
    }
    /**
     * @since 0.0.1
     * @method NgPattern#value
     * @description
     * Gets value pattern
     */
    value(node, context) {
        return new NgValue(this.datatype(node), node.textContent(), this.namespace(node, context));
    }
    /**
     * @since 0.0.1
     * @method NgPattern#datatype
     * @description
     * Gets data pattern
     */
    datatype(node) {
        var att1, att2;
        att1 = node.getAttribute('datatypeLibrary');
        att2 = node.getAttribute('type');
        return new NgDataType(att1, att2);
    }
    /**
     * @since 0.0.1
     * @method NgPattern#data
     * @description
     * Gets data pattern
     */
    data(node, context) {
        var paramList = [], except;

        for(let cNode of gen(node.firstElementChild())) {
            if (cNode.is('except')) {
                except = this.getDefinition(cNode, context);
            } else {
                paramList.push(this.getDefinition(cNode, context));
            }
        }

        if (except) {
            return new NgDataExcept(this.datatype(node), paramList, except);
        }

        return new NgData(this.datatype(node), paramList);


        function* gen(node) {
            while(node) {
                yield node;
                node = node.nextElementSibling();
            }
        }
    }

    /**
     * @since 0.0.1
     * @method NgPattern#getDefinition
     * @description
     * Gets definition of node
     */
    getDefinition(node, context) {
        var nodeLiteral;
        switch(node.type) {
            case 'define':
                return this.define(node, context);
            case 'ref':
                return this.ref(node, context);
            case 'element':
                return this.element(node, context);
            case 'attribute':
                return this.attribute(node, context);
            case 'except':
                return this.except(node, context);
            case 'anyName':
                return this.anyName(node, context);
            case 'nsName':
                return this.nsName(node, context);
            case 'name':
                return this.name(node);
            case 'choice':
                return this.choice(node, context);
            case 'interleave':
                return this.interleave(node, context);
            case 'group':
                return this.group(node, context);
            case 'oneOrMore':
                return this.oneOrMore(node, context);
            case 'list':
                return this.list(node, context);
            case 'param':
                return this.param(node);
            case 'value':
                return this.value(node, context);
            case 'data':
                return this.data(node, context);
            case 'text':
                return new NgText();
            case 'notAllowed':
                return new NgNotAllowed();
            case 'empty':
                return new NgEmpty();
        }

        nodeLiteral = node.toXML();
        throw new NgError(`No valid node provided, pattern is not recognized
        or schema is not simplified correctly, current node: ${nodeLiteral}`);
    }
}
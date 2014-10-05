import {NgClass} from './ng-class';
import {NgDOM} from "./ng-dom";
import {NgError} from './ng-error';
import {
    extend,
    isNode,
    removeComments,
    toXML,
    isObject,
    clean,
    isFunction,
    getXML,
    instanceOf,
    isString,
    isArray,
    forEach
} from "../core";
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgSchema
 *
 * @constructor
 * @description
 *
 * NgSchema class simplification algorithm
 */
export class NgSchema extends NgClass {
    /**
     * Schema constructor
     * @param schema
     * @param config
     */
     constructor(schema, config) {
        var fc, ns;
        super(NgSchema);
        /**
         * If not schema
         */
        if (!schema && !isNode(schema)) {
            throw new NgError('NgSchema: schema is not provided or have parsing errors schema:', schema);
        }

        /**
         * Remove comments
         * @type {Object}
         */
        schema = removeComments(schema);

        /**
         * Config
         * @type {{cloneComplex: boolean}}
         */
        this.config = {
            cloneComplex: true,
            removeInvalidNodes: true
        };
        /**
         * Is object
         */
        if (isObject(config)) {
            extend(this.config, config);
        }
        /**
         * Create instance of schema dom
         * @type {object}
         */
        this.schema = new NgDOM(schema);

        /**
         * Relax ng namespace
         * @type {string}
         */
        this.rngNs = 'http://relaxng.org/ns/structure/1.0';
        /**
         * Is schema prefixed
         * @type {boolean}
         */
        this.localName = null;

        try {
            fc = this.schema.firstElementChild();
            ns = fc.getNamespace(this.rngNs);
            if (ns && ns.localName) {
                if (ns.localName !== 'xmlns') {
                    this.localName = ns.localName;
                }
            } else {
                throw new NgError('Schema is not valid relax ng schema, missing ns or is not valid structure');
            }
        } catch (e) {
            if (e.message) {
                throw new NgError(e.message);
            } else {
                throw new NgError('Invalid schema xml structure');
            }
        }
        /**
         * Clone complex schema
         */
        if (this.config.cloneComplex) {
            this.complex = this.schema.clone();
        } else {
            this.complex = this.schema;
        }
        /**
         * Annotations
         * @type {Array}
         */
        this.annotations = [];
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_1
     * @description
     * Replacing rng:externalRef with external content
     */
    step_1() {
        var parents = [
            'attribute', 'choice', 'define', 'element',
            'except', 'group', 'interleave', 'list',
            'mixed', 'oneOrMore', 'optional', 'start',
            'zeroOrMore'
        ];
        this.traverse(function step_1_traverse(node) {
            var parent = node.parentNode(), message, href, replacedNode = null;
            if (this.matchNode(parent, parents)) {
                href = node.getAttribute('href');
                if (href) {
                    getXML(href, function (data, error, status) {
                        if (status === 200) {
                            replacedNode = node.replaceNode(mergeExternal.call(this, data), true);
                        } else {
                            throw new NgError("field to load xml file status code: {0}", status);
                        }
                    }, false, this); // sync call
                }
            } else {
                message = 'invalid schema definition in step step_1 externalRef don\'t have provided correct parent current parent is "{0}" but allowed are: "{1}" or node don\'t have correct namespace assigned';
                throw new NgError(message, parent.type, parents.join(','));
            }
            return replacedNode;
        }, 'externalRef');

        /**
         * Merge external schema
         * @param data
         * @returns {Object}
         */
        function mergeExternal(data) {
            var doc = new NgDOM(data), fc, ns, message;
            fc = doc.firstElementChild();
            ns = fc.getNamespace(this.rngNs);
            if (ns && ns.localName) {
                if(ns.localName !== 'xmlns' && this.localName !== ns.localName) {
                    message = 'external file don\'t have correct namespace external: "{0}", ';
                    message += 'don\'t match "{1}" . Exchange external or internal to do ';
                    message += 'correct schema merge.';
                    throw new NgError(message, ns.localName, this.localName);
                } else {
                    return fc;
                }
            } else {
                throw new NgError('step_1_traverse, checkExternal: invalid schema xml structure');
            }
        }

    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_2
     * @description
     * Replacing rng:include with external content
     */
    step_2() {
        var parents = ['div', 'grammar'],
            children = ['define', 'div', 'start'];

        this.traverse(function step_2_traverse(node) {
            var parent = node.parentNode(), message, href, replacedNode = null;
            if (this.matchNode(parent, parents)) {
                forEach(node.childElements(), function (cNode, index) {
                    if (!this.matchNode(cNode, children)) {
                        var message = 'invalid schema definition in step step_2';
                        message += ', include don\'t have provided correct children';
                        message += ', current children is {0} at index {1} but allowed are: {2}';
                        throw new NgError(message, cNode.type, index, children.join(','));
                    } else if (this.matchNode(cNode, 'div')) {
                        cNode.unwrap();
                    }
                }, this);
                href = node.getAttribute('href');
                if (href) {
                    getXML(href, function (data, error, status) {
                        if (status === 200) {
                            replacedNode = node.replaceNode(mergeExternal.call(this, data, node), true);
                        } else {
                            throw new NgError("field to load xml file status code: {0}", status);
                        }
                    }, false, this); // sync call
                }
            } else {
                message = 'invalid schema definition in step step_2 include don\'t have provided correct parent current parent is "{0}" but allowed are: "{1}" or node don\'t have correct namespace assigned';
                throw new NgError(message, parent.type, parents.join(','));
            }

            return replacedNode;
        }, 'include');

        /**
         * Merge external schema
         * @param data
         * @param node
         * @returns {Object}
         */
        function mergeExternal(data, node) {
            var doc = new NgDOM(data), fc, ce, ns, message;
            fc = doc.firstElementChild();
            ce = fc.childElements();

            ///merge
            forEach(node.childElements(), function step2_merge_external(cNode) {
                forEach(
                    ce.filter(function (nItem) {
                        return nItem.type === cNode.type;
                    }),
                    function step2_merge_external_filter(fItem) {
                        if (fItem.is('start') || (fItem.is('define') && cNode.is('define') && fItem.getAttribute('name') ===  cNode.getAttribute('name'))) {
                            fItem.replaceNode(cNode, true);
                        }
                    }
                );
            });

            ns = fc.getNamespace(this.rngNs);
            if (ns && ns.localName) {
                if(ns.localName !== 'xmlns' && this.localName !== ns.localName) {
                    message = 'external file don\'t have correct namespace external: "{0}", ';
                    message += 'don\'t match "{1}" . Exchange external or internal to do ';
                    message += 'correct schema merge.';
                    throw new NgError(message, ns.localName, this.localName);
                } else {
                    return fc;
                }
            } else {
                throw new NgError('step_2_traverse, checkExternal: invalid schema xml structure');
            }
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_3
     * @description
     * Replace child grammars with its content
     */
    step_3() {
        this.traverse(function grammar_no_parent_doc(node) {
            if (!this.matchNode(node.parentNode(), '#document')) {
                return node.unwrap();
            }
        }, 'grammar');
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_4
     * @description
     * Replace starts whit its content if parent is not grammar
     */
    step_4() {
        this.traverse(function merge_start(node) {
            if (!this.matchNode(node.parentNode(), 'grammar')) {
                return node.unwrap();
            }
        }, 'start');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_5
     * @description
     * Collect all defined which parent is not grammar and attach them to grammar
     */
    step_5() {
        this.traverse(function merge_define(node) {
            if (!this.matchNode(node.parentNode(), 'grammar')) {
                node.getDocument().querySelector('grammar').addChild(node);
            }
        }, 'define');
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_6
     * @description
     * Merge starts add choice to roots if there is more then one start
     */
    step_6() {
        var nodes = [], first;
        this.traverse(function merge_start(node) {
            if (this.matchNode(node.parentNode(), 'grammar')) {
                if (nodes.length > 1 && node.getAttribute('combine') && node.getAttribute('combine') !== 'choice') {
                    throw new NgError('while merging schema, multiple start nodes must have combine as choice pattern');
                }
                nodes.push(node);
            }
        }, 'start');
        if (nodes.length > 1) {
            first = nodes.shift();
            nodes.forEach(iNode => {
                first.addChild(iNode);
                iNode.unwrap();
            });
            first.wrapChildren(this.createElement('choice'));
        } else {
            nodes = null;
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_7
     * @description
     * Annotations (elements) are removed.
     */
    step_7() {
        this.traverse(function step_7_remove_annotations(node) {
            var parent;
            if (this.isAnnotation(node)) {
                this.annotations.push(node.clone());
                parent = node.parentNode();
                node.remove();
                return parent;
            }
        });
    }
    /**
     * @since 0.0.1
     * @method NgSchema#simplify
     * @description
     * Simplify schema
     */
    simplify() {
        this.step_1();
        this.step_2();
        this.step_3();
        this.step_4();
        this.step_5();
        this.step_6();
        this.step_7();
    }

    /**
     * @since 0.0.1
     * @method NgSchema#isAnnotation
     * @description
     * Is node annotation
     */
    isAnnotation(node) {
        return this.localName !== node.typePrefix;
    }
    /**
     * @since 0.0.1
     * @method NgSchema#matchNode
     * @description
     * Go over tree and execute function
     */
    matchNode(node, match) {
        if (match && node) {
            if (!node.isDocumentNode() && this.localName && this.isAnnotation(node)) {
                return false;
            } else if (isArray(match) && match.indexOf(node.type) === -1) {
                return false;
            } else if (isString(match) && match !== node.type) {
                return false;
            }
            return true;
        }
        return false;
    }
    /**
     * @since 0.0.1
     * @method NgSchema#traverse
     * @description
     * Go over tree and execute function
     */
    traverse(callback, match) {
        var node = this.schema, skip = false;
        try {
            while (true) {
                if (node.firstElementChild() && !skip) {
                    node = node.firstElementChild();
                    apply.call(this);
                } else if (node.nextElementSibling()) {
                    node = node.nextElementSibling();
                    apply.call(this);
                    skip = false;
                } else if (node.parentNode()) {
                    node = node.parentNode();
                    skip = true;
                } else {
                    break;
                }
            }
        } catch (e) {
            throw new NgError('NgSchema traverse: ' + e.message, callback.toString(), e.stack ? e.stack.toString() : e.toString());
        }

        function apply() {
            var result;
            if (isFunction(callback)) {
                if (match) {
                    if (this.matchNode(node, match)) {
                        result = callback.call(this, node);
                        if (result && instanceOf(result, NgDOM)) {
                            node = result;
                        }
                    }
                } else {
                    result = callback.call(this, node);
                    if (result && instanceOf(result, NgDOM)) {
                        node = result;
                    }
                }
            } else {
                new NgError('callback is not function');
            }
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#toString
     * @description
     * Convert schema to string
     */
    createElement(element) {
        if (this.localName) {
            return this.schema.createElementNs(this.rngNs,  this.localName + ':' + element);
        }
        return this.schema.createElement(element);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#querySelector
     * @description
     * Map to query selector
     */
    querySelectorAll(selector) {
        return this.schema.querySelectorAll(selector);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#querySelector
     * @description
     * Map to query selector
     */
    querySelector(selector) {
        return this.schema.querySelector(selector);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#toString
     * @description
     * Convert schema to string
     */
    toString(complex) {
        if (this.schema.isDocumentNode()) {
            if (!!complex) {
                return toXML(this.complex.node);
            }
            return toXML(this.schema.node);
        }
        return false;
    }

    /**
     * @since 0.0.1
     * @method NgSchema#destroy
     * @description
     * Destroy schema
     */
    destroy() {
        if (this.schema) {
            this.schema.destroy();
        }
        if (this.complex) {
            this.complex.destroy();
        }
        clean(this);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#clone
     * @description
     * Clone schema
     */
    clone() {
        try {
            return new NgSchema(this.schema.clone().node, this.config);
        } catch (e) {
            new NgError('Error in cloning schema', e);
        }
        return false;
    }
}
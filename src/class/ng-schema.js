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
    isArray
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
            throw new NgError('Schema is not provided or have parsing errors schema:', schema);
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
         * Invalid nodes
         * @type {Array}
         */
        this.invalidNodes = [];
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
                message = 'invalid schema definition in step step_1 externalRef don\'t have provided correct parent current parent is "{0}" but allowed are: "{1}"';
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
     * @method NgSchema#matchNode
     * @description
     * Go over tree and execute function
     */
    matchNode(node, match) {
        if (match && node) {
            if (this.localName && this.localName !== node.typePrefix) {
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
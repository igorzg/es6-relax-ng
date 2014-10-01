import {NgClass} from './ng-class';
import {NgDOM} from "./ng-dom";
import {NgError} from './ng-error';
import {extend, isNode, removeComments, toXML, isObject, clean, isFunction} from "../core";
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
                this.localName = ns.localName;
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
     * @method NgSchema#traverse
     * @description
     * Go over tree and execute function
     */
    traverse(callback) {
        var node = this.schema, skip = false, result;
        try {
            while (true) {
                if (isFunction(callback)) {
                    result = callback.call(this, node);
                    if (result && isNode(result)) {
                        node = result;
                        skip = false;
                    }
                } else {
                    throw new NgError('NgSchema traverse: callback is not function');
                }
                if (node.firstChild() && !skip) {
                    node = node.firstChild();
                } else if (node.nextSibling()) {
                    skip = false;
                    node = node.nextSibling();
                } else if (node.parentNode()) {
                    skip = true;
                    node = node.parentNode();
                } else {
                    break;
                }
            }
        } catch (e) {
            throw new NgError('NgSchema traverse: to many iterations {0}, {1}, {2}', callback, e, e.stack);
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#toString
     * @description
     * Convert schema to string
     */
    createElement(element) {
        if (this.localName !== 'xmlns') {
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
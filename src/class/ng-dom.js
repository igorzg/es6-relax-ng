import {NgClass} from './ng-class';
import {NgError} from './ng-error';
import {NgCache} from './ng-cache';
import {isNode, nextUid, forEach, getAllChildren, instanceOf, isDocumentNode} from '../core';
/**
 * Cache dom
 * @type {Array}
 */
var ngCache = new NgCache();
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgDOM
 *
 * @constructor
 * @description
 *
 * NgDOM is used for DOM query and manipulation
 *
 */
export class NgDOM extends NgClass{
    /**
     * NgDOM constructor
     * @param node
     */
    constructor(node) {
        super(NgDOM);
        if (!isNode(node)) {
            throw new NgError('NgDOM error node is not valid');
        }
        this.node = node;
        if (this.node.localName && this.node.prefix) {
            this.type = this.node.localName;
            this.typePrefix = this.node.prefix;
        } else {
            this.type = this.node.nodeName;
            this.typePrefix = null;
        }
        // used for debugging
        this.id = nextUid();
        ngCache.add(this);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#toString
     * @description
     * Get serialized string from current node
     * @return string
     */
    toString() {
        return (new XMLSerializer()).serializeToString(this.node);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#isDocumentNode
     * @description
     * Check if current node is document
     * @return boolean
     */
    isDocumentNode() {
       return isDocumentNode(this.node);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#getDocument
     * @description
     * Get document of current node
     * @return object|null instance of NgDOM
     */
    getDocument() {
        if (this.isDocumentNode()) {
            return this;
        } else if (!this.$document) {
            this.$document = this.node.ownerDocument;
        }
        return this.getInstance(this.$document);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#getInstance
     * @description
     * Return instance of current class
     * @return object instance of current class
     */
    getInstance(node) {
        var doc;
        if (instanceOf(node, NgDOM)) {
            return node;
        } else if (isNode(node)) {
            doc = ngCache.get(find.bind(this));
            if (!doc) {
                doc = new NgDOM(node);
                doc.$document = this.getDocument();
                ngCache.add(doc);
            }
            return doc;
        }

        return null;

        /**
         * Get it from cache
         * @param obj
         * @returns {boolean}
         */
        function find(obj) {
            return obj === this.node;
        }
    }
    /**
     * @since 0.0.1
     * @method NgDOM#children
     * @description
     * Get all children
     * @return array of nodes
     */
    children() {
        var nodes = [];
        forEach(getAllChildren(this.node), function (node) {
            nodes.push(this.getInstance(node));
        }, this);
        return nodes;
    }
}
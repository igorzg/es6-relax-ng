import {NgClass} from './ng-class';
import {NgError} from './ng-error';
import {NgCache} from './ng-cache';
import {
    isNode,
    isArray,
    isString,
    nextUid,
    forEach,
    instanceOf,
    isDocumentNode,
    isElementNode,
    isTextNode,
    isCommentNode,
    isDocumentFragmentNode,
    isSafari,
    isIE,
    clean,
    parseXML,
    toXML
} from '../core';
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
     * @method NgDOM#firstChild
     * @description
     * Get first child
     * @return object
     */
    firstChild() {
        if (this.node) {
            return this.getInstance(this.node.firstChild);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#firstElementChild
     * @description
     * Get first element child
     * @return object
     */
    firstElementChild() {
        if (this.node) {
            return this.getInstance(this.node.firstElementChild);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#lastChild
     * @description
     * Get last child
     * @return object
     */
    lastChild() {
        if (this.node) {
            return this.getInstance(this.node.lastChild);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#lastElementChild
     * @description
     * Get last element child
     * @return object
     */
    lastElementChild() {
        if (this.node) {
            return this.getInstance(this.node.lastElementChild);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#nextSibling
     * @description
     * Get next sibling node
     * @return object
     */
    nextSibling() {
        if (this.node) {
            return this.getInstance(this.node.nextSibling);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#nextElementSibling
     * @description
     * Get next element sibling node
     * @return object
     */
    nextElementSibling() {
        if (this.node) {
            return this.getInstance(this.node.nextElementSibling);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#prevSibling
     * @description
     * Get previous sibling node
     * @return object
     */
    previousSibling() {
        if (this.node) {
            return this.getInstance(this.node.previousSibling);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#previousElementSibling
     * @description
     * Get previous element sibling node
     * @return object
     */
    previousElementSibling() {
        if (this.node) {
            return this.getInstance(this.node.previousElementSibling);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#parentNode
     * @description
     * Get parent node
     * @return object
     */
    parentNode() {
        if (this.node) {
            return this.getInstance(this.node.parentNode);
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#createElement
     * @description
     * Create element from current document
     */
    createElement(name) {
        var doc = this.getDocument();
        if (doc && doc.isDocumentNode()) {
            return this.getInstance(doc.node.createElement(name));
        }
        throw new NgError('Element is not attached to document node');
    }
    /**
     * @since 0.0.1
     * @method NgDOM#createElement
     * @description
     * Create namespaced element from current document
     */
    createElementNs(namespace, name) {
        var doc = this.getDocument();
        if (doc && doc.isDocumentNode()) {
            return this.getInstance(doc.node.createElementNS(namespace, name));
        }
        throw new NgError('Element is not attached to document node');
    }
    /**
     * @since 0.0.1
     * @method NgDOM#importNode
     * @description
     * Import node to current document
     */
    importNode(nNode) {
        var doc = this.getDocument(),
            node = this.getInstance(nNode);

        ngCache.remove(node);

        if (doc.isDocumentNode() && instanceOf(node, NgDOM)) {
            doc.node.adoptNode(node.node);
            doc.node.importNode(node.node, true);
        } else {
            throw new NgError('There is no valid document at importNode');
        }
    }
    /**
     * @since 0.0.1
     * @method NgDOM#addChild
     * @description
     * Add child node
     */
    addChild(nNode, importNode) {
        var node = this.getInstance(nNode);
        if (!!importNode) {
            this.importNode(node);
        }
        if (!instanceOf(node, NgDOM)) {
            throw new NgError('Error in addChild node must be instance of NgDOM');
        }
        this.node.appendChild(node.node);
        return node;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#replaceNode
     * @description
     * Replace node
     */
    replaceNode(nNode, importNode) {
        var parent = this.parentNode(),
            node = this.getInstance(nNode),
            current;
        if (parent && node) {
            if (!!importNode) {
                this.importNode(node);
            }
            current = this.node;
            try {
                this.destroy();
            } catch (e) {
                throw new NgError('replaceNode cannot destroy current child, parent "{0}", replace with "{1}", current "{2}",', [parent, node, current]);
            } finally {
                parent.node.replaceChild(node.node, current);
            }
            return parent;
        } else {
            throw new NgError('replaceNode parent or node is not provided parent "{0}", replace with "{1}", current "{2}",', [parent, node, this]);
        }
    }
    /**
     * @since 0.0.1
     * @method NgDOM#insertBefore
     * @description
     * Insert before
     */
    insertBefore(newNode, beforeNode, importNode) {
        var n = this.getInstance(newNode),
            b = this.getInstance(beforeNode);
        try {
            if (!!importNode) {
                this.importNode(newNode);
            }
            this.node.insertBefore(n.node, b.node);
        } catch (e) {
            throw new NgError('Unable to execute insert before error "{0}"', [e]);
        }
    }
    /**
     * @since 0.0.1
     * @method NgDOM#destroyCache
     * @description
     * Clean up all references from cache
     * @return boolean
     */
    flushAllCache() {
        return ngCache.destroy();
    }
    /**
     * @since 0.0.1
     * @method NgDOM#getCacheSize
     * @description
     * Get cache size is used only for debugging and testing
     * @return boolean
     */
    getCacheSize() {
        return ngCache.size();
    }
    /**
     * @since 0.0.1
     * @method NgDOM#isCached
     * @description
     * Check if node is cached
     * @return boolean
     */
    getCached(node) {
        if (!isNode(node)) {
            throw new NgError('Node param is not valid node at getCached in NgDOM');
        }
        return ngCache.filter(find);

        /**
         * Get it from cache
         * @param obj
         * @returns {boolean}
         */
        function find(obj) {
            return obj.node === node;
        }
    }
    /**
     * @since 0.0.1
     * @method NgDOM#isCached
     * @description
     * Is cached
     * @return boolean
     */
    isCached() {
        return ngCache.isCached(this);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#clone
     * @description
     * Clone node
     * @return object
     */
    clone() {
        var clone;
        if (isSafari() && this.isDocumentNode()) {
            clone = parseXML(toXML(this.node)); // copy hack for safari :)
        } else {
            clone = this.node.cloneNode(true);
        }
        return this.getInstance(clone);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#remove
     * @description
     * Remove node
     * @return string
     */
    remove() {
        var parent = this.parentNode(),
            node = this.node;
        try {
            this.destroy();
        } catch (e) {
            throw new NgError('Child not removed from node "{0}"', [e]);
        } finally {
            if (parent && parent.node) {
                parent.node.removeChild(node);
            }
            node = null;
            parent = null;
        }
    }
    /**
     * @since 0.0.1
     * @method NgDOM#flushCache
     * @description
     * Clear cache
     * @return string
     */
    flushCache(cleanAllChildren) {
        var node = this.node.firstChild,
            stop = this.node,
            skip = false,
            obj;

        ngCache.remove(this);

        while (node && node !== stop) {
            obj = this.getInstance(node, true);
            if (obj) {
                ngCache.remove(obj);
                if (cleanAllChildren) {
                    clean(obj);
                }
            }
            if (node.firstChild && !skip) {
                node = node.firstChild;
            } else if (node.nextSibling) {
                skip = false;
                node = node.nextSibling;
            } else if (node.parentNode) {
                node = node.parentNode;
                skip = true;
            } else {
                node = null;
            }
        }
    }


    /**
     * @since 0.0.1
     * @method NgDOM#destroy
     * @description
     * Destroy all references
     * @return string
     */
    destroy() {
        this.flushCache(true);
        clean(this);
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
     * @method NgDOM#isCommentNode
     * @description
     * Check if current node is comment
     * @return boolean
     */
    isCommentNode() {
        return isCommentNode(this.node);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#isElementNode
     * @description
     * Check if current node is text
     * @return boolean
     */
    isTextNode() {
        return isTextNode(this.node);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#isElementNode
     * @description
     * Check if current node is element
     * @return boolean
     */
    isElementNode() {
        return isElementNode(this.node);
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
     * @method NgDOM#isDocumentFragmentNode
     * @description
     * Check if current node is document fragment
     * @return boolean
     */
    isDocumentFragmentNode() {
        return isDocumentFragmentNode(this.node);
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
     * @param {object} node
     * @param {boolean|optional} avoidCreate
     * @return object instance of current class
     */
    getInstance(node, avoidCreate) {
        var doc;
        if (instanceOf(node, NgDOM)) {
            return node;
        } else if (isNode(node)) {
            doc = this.getCached(node);
            if (!doc && !avoidCreate) {
                doc = new NgDOM(node);
                doc.$document = this.getDocument();
            }
        }
        return !!doc ? doc : null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#setValue
     * @description
     * Set value to text or element node
     * @param {string} value
     */
    setValue(value) {
        if (this.isTextNode()) {
            this.node.nodeValue = value;
            return true;
        } else if (this.isElementNode()) {
            this.flushCache(true);
            if (isSafari() || isIE()) { // safari,IE
                this.removeChildren();
                this.addChild(this.parse(value));
            } else {
                this.node.innerHTML = value;
            }
            return true;
        }
        return false;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#getValue
     * @description
     * Get value from text or element node
     */
    getValue() {
        var str = '';
        if (this.isTextNode()) {
            return this.node.nodeValue;
        } else if (this.isElementNode()) {
            if (isSafari() || isIE()) {
                forEach(this.children(), function (cNode) {
                    if (cNode.isTextNode()) {
                        str += cNode.getValue();
                    } else {
                        str += cNode.toString();
                    }
                });
                return str;
            } else {
                return this.node.innerHTML;
            }
        }
        return str;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#createFragment
     * @description
     * Create fragment from current document
     */
    createFragment() {
        var doc = this.getDocument();
        if (doc) {
            return this.getInstance(doc.node.createDocumentFragment());
        }
        return null;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#parse
     * @description
     * Parse html string
     * @param {string} html
     */
    parse(html) {
        var docFragment = this.createFragment(), parseElement, importNode = false;
        if (docFragment) {
            if (isSafari() || isIE()) { /// safari,IE
                parseElement = this.getInstance(parseXML('<div>' + html + '</div>').documentElement.cloneNode(true));
                importNode = true;
            } else {
                parseElement = docFragment.createElement('div');
                parseElement.node.innerHTML = html;
            }
            if (parseElement.hasChildren()) {
                forEach(parseElement.children(), function (cNode) {
                    docFragment.addChild(cNode.clone(), importNode);
                });
            }
            parseElement.destroy();
            return docFragment;
        }
        return false;
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
        forEach(this.node.childNodes, function (node) {
            nodes.push(this.getInstance(node));
        }, this);
        return nodes;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#removeChildren
     * @description
     * Remove child nodes
     * @return {object} instance
     */
    removeChildren() {
        forEach(this.children(), function (cNode) {
            cNode.remove();
        });
        return this;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#hasChildren
     * @description
     * Get information if node have children
     * @return boolean
     */
    hasChildren() {
        if (this.node) {
            return this.node.hasChildNodes();
        }
       return false;
    }
    /**
    * @since 0.0.1
    * @method NgDOM#childElements
    * @description
    * Get child elements
    * @return array of nodes
    */
    childElements() {
        var nodes = [];
        forEach(this.node.childNodes, function (node) {
            if (isElementNode(node)) {
                nodes.push(this.getInstance(node));
            }
        }, this);
        return nodes;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#wrap
     * @description
     * Wrap current node with new node
     * @return {object}
     */
    wrap(node) {
        node.addChild(this.clone());
        this.replaceNode(node);
        return node;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#unwrap
     * @description
     * Unwrap current element
     * @return {object}
     */
    unwrap() {
        var parent = this.parentNode();
        forEach(this.children(), function (cNode) {
            parent.insertBefore(cNode.clone(), this);
        }, this);
        this.remove();
        return parent;
    }

    /**
     * @since 0.0.1
     * @method NgDOM#wrapChildren
     * @description
     * Wrap child elements with new node
     * @return {object}
     */
    wrapChildren(node, prevent) {
        var nodesToSlice = [];
        if (isArray(prevent) || isString(prevent)) {
            forEach(this.children(), function (cNode) {
                if (isArray(prevent)) {
                    if (prevent.indexOf(cNode.type) === -1) {
                        nodesToSlice.push(cNode);
                    }
                } else if (cNode.type !== prevent) {
                    nodesToSlice.push(cNode);
                }
            });
        } else {
            nodesToSlice = this.children();
        }
        forEach(nodesToSlice, function (cNode) {
            node.addChild(cNode.clone());
            cNode.remove();
        });
        this.addChild(node);
        return this;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#wrapChildren
     * @description
     * Wrap child elements with new node
     * @example
     * var tree = new NgDOM(node);
     * tree.wrapAllToTwoChildNs('choice', 'http://relaxng.org/ns/structure/1.0', 'rng:');
     */
    wrapDeepInTwoChildNs(node, ns, prefix) {
        var children = this.childElements();
        /// process multiple time
        if (children.length > 2) {
            do {
                wrap.call(this, children, node, ns, prefix);
                children = this.childElements();
            }
            while (children.length > 2);
        }
        /**
         * Wrap children
         * @param childNodes
         * @param nodeName
         * @param nameSpace
         * @param nsPrefix
         */
        function wrap(childNodes, nodeName, nameSpace, nsPrefix) {
            var wrapNode;
            if (nodeName && !nameSpace) {
                wrapNode = this.createElement(nodeName);
            } else {
                if (nsPrefix) {
                    nodeName = nsPrefix + nodeName;
                }
                wrapNode = this.createElementNs(nameSpace, nodeName);
            }
            forEach(childNodes.splice(0, 2), function (cNode) {
                wrapNode.addChild(cNode.clone());
                cNode.remove();
            });
            this.insertBefore(wrapNode, this.firstElementChild());
        }

        return this;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#setAttributeNS
     * @description
     * Set namespaced attribute to node
     */
    setAttributeNS(namespace, name, value) {
        this.node.setAttributeNS(namespace, name, value);
        return this;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#removeAttributeNS
     * @description
     * Remove namespaced attribute to node
     */
    removeAttributeNS(namespace, name) {
        this.node.removeAttributeNS(namespace, name);
        return this;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#setAttribute
     * @description
     * Set attribute to node
     */
    setAttribute(name, value) {
        this.node.setAttribute(name, value);
        return this;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#removeAttribute
     * @description
     * Remove attribute from node
     */
    removeAttribute(name) {
        this.node.removeAttribute(name);
        return this;
    }
    /**
     * @since 0.0.1
     * @method NgDOM#getAttributes
     * @description
     * Get all attributes
     */
    getAttributes() {
        return Array.prototype.slice.call(this.node.attributes);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#getAttributeNode
     * @description
     * Get attribute node
     */
    getAttributeNode(name) {
        return this.node.getAttributeNode(name);
    }
    /**
     * @since 0.0.1
     * @method NgDOM#getAttribute
     * @description
     * Get attribute value
     */
    getAttribute(name) {
        return this.node.getAttribute(name);
    }
}
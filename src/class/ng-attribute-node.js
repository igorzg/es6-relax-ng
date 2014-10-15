import {NgClass} from './ng-class';
import {NgQName} from './ng-qname';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAttributeNode
 *
 * @constructor
 * @description
 * NgAttributeNode is class which is used by NgValidator
 *
 * @param {object} attr
 * @param {object} node
 *
 */
export class NgAttributeNode extends NgClass{
    /**
     * @since 0.0.1
     * @method NgAttributeNode#constructor
     * @param attr
     * @param node
     */
     constructor(attr, node) {
        super(NgAttributeNode);
        this.qName = new NgQName(attr.namespaceURI ? attr.namespaceURI : "", attr.localName);
        this.string = attr.value;
        this.node = node;
     }
}
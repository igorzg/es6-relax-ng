import {NgNotAllowed} from './ng-not-allowed';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAttributeError
 *
 * @constructor
 * @description
 * NgAttributeError is class which is used by NgAttribute
 * @param {string} message
 * @param {object} node is instanceof NgAttributeNode
 * @param {object} pattern instance of pattern class
 */
export class NgAttributeError extends NgNotAllowed {
    /**
     * NgAttributeError constructor
     * @param node
     * @param pattern
     */
    constructor(node, pattern) {
        this.instanceOf(NgAttributeError);
        var message = `invalid attribute on node: "${node.node.type}",
        attribute: "${node.qName.localName}", ns "${node.qName.uri}",
        is not allowed on this element`;
        super(message, node, pattern);
        this.className = 'NgAttributeError';
    }
}
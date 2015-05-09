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
     * @param attrNode
     * @param pattern
     */
    constructor(attrNode, pattern) {
        var message = `invalid attribute on node: "${attrNode.node.type}",
        attribute: "${attrNode.qName.localName}", ns "${attrNode.qName.uri}",
        is not allowed on this element`;
        super(message, attrNode.node, pattern);
        this.instanceOf(NgAttributeError);
        this.errorClassName = 'NgAttributeError';
    }
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAttributeInvalidValueError
 *
 * @constructor
 * @description
 * NgAttributeInvalidValueError is class which is used by NgAttribute
 * @param {string} message
 * @param {object} node is instanceof NgAttributeNode
 * @param {object} pattern instance of pattern class
 */

export class NgAttributeInvalidValueError extends NgNotAllowed {
     constructor(node, pattern) {
        var message = `invalid attribute on node: "${node.type}",
        attribute: "${pattern.nameClass.localName}", ns "${pattern.nameClass.uri}",
        has an invalid value`;
        super(message, node, pattern);
        this.instanceOf(NgAttributeInvalidValueError);
        this.errorClassName = 'NgAttributeInvalidValueError';
    }
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAttributeMissingValueError
 *
 * @constructor
 * @description
 * NgAttributeMissingValueError is class which is used by NgAttribute
 * @param {string} message
 * @param {object} node is instanceof NgAttributeNode
 * @param {object} pattern instance of pattern class
 */

export class NgAttributeMissingValueError extends NgNotAllowed {
    constructor(node, pattern) {
        var message = `missing attribute on node: "${node.type}",
        attribute: "${pattern.nameClass.localName}", ns "${pattern.nameClass.uri}"`;
        super(message, node, pattern);
        this.instanceOf(NgAttributeMissingValueError);
        this.errorClassName = 'NgAttributeMissingValueError';
    }
}
import {NgNotAllowed} from './ng-not-allowed';

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgListError
 *
 * @constructor
 * @description
 * NgListError is class which is used by NgData
 *
 * @param {object} pattern instance of pattern class
 * @param {object} tree is instanceof Tree
 * @param {object} message is message of error
 *
 * @example
 * new NgListError(tree, pattern);
 */
export class NgListError extends NgNotAllowed {
    /**
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof NgDOM
     * @param {object} str value of text
     */
     constructor(node, pattern, str) {
        var nodeLocal = node.toXML(),
            message = `list invalid, "${str}" found  on "${nodeLocal}"`;
        this.instanceOf(NgListError);
        super(message, node, pattern);
        this.className = 'NgListError';
     }
}
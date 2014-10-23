import {NgNotAllowed} from './ng-not-allowed';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAfterError
 *
 * @constructor
 * @description
 * NgAfterError is class which is used by NgAfter
 */
export class NgAfterError extends NgNotAllowed {
    /**
     * NgAfterError constructor
     * @param node
     * @param pattern
     */
     constructor(node, pattern) {
        this.instanceOf(NgAfterError);
        var nodeLocal = node.toXML();
        super(`Missing content at node: ${nodeLocal}`, node, pattern);
        this.errorClassName = 'NgAfterError';
     }
}
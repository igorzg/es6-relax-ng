import {NgNotAllowed} from './ng-not-allowed';
import {NgDataType} from './ng-data-type';
import {instanceOf} from '../core';
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
export class NgDataError extends NgNotAllowed {
    /**
     * NgAfterError constructor
     * @param node
     * @param pattern
     * @param ngNotAllowed
     */
     constructor(node, pattern, ngNotAllowed) {
        this.instanceOf(NgDataError);
        super(ngNotAllowed.message, node, pattern);
        if (instanceOf(ngNotAllowed.node, NgDataType)) {
            this.dataType = ngNotAllowed.node;
            this.dataTypePattern = ngNotAllowed.pattern;
        }
        this.type = 'NgDataError';
     }
}
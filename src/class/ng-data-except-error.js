import {NgNotAllowed} from './ng-not-allowed';
import {NgDataType} from './ng-data-type';
import {instanceOf} from '../core';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgDataExceptError
 *
 * @constructor
 * @description
 * NgDataExceptError is class which is used by NgAfter
 */
export class NgDataExceptError extends NgNotAllowed {
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @name NgDataError
     *
     * @constructor
     * @description
     * NgDataExceptError is class which is used by NgData
     *
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof NgDOM
     * @param {object} ngNotAllowed is instanceof NgNotAllowed
     * @param {boolean} noExpectedValue there is no expected value provided
     */
     constructor(node, pattern, ngNotAllowed, noExpectedValue = false) {
        this.instanceOf(NgDataExceptError);
        super(ngNotAllowed.message, node, pattern);
        if (instanceOf(ngNotAllowed.node, NgDataType)) {
            this.dataType = ngNotAllowed.node;
            this.dataTypePattern = ngNotAllowed.pattern;
        }
        this.expected = !!noExpectedValue;
        this.type = 'NgDataExceptError';
     }
}
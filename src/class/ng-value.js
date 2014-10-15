import {NgClass} from './ng-class';
import {NgNotAllowed} from './ng-not-allowed';
import {NgValueError} from './ng-value-error';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValue
 *
 * @constructor
 * @description
 * NgValue is class which is used by NgPattern
 * @param {object} datatype instanceof NgDataType
 * @param {object} string value of string
 * @param {object} context instanceof NgContext
 */
export class NgValue extends NgClass {
    /**
     * @since 0.0.1
     * @method NgValue#constructor
     */
    constructor(datatype, string, context) {
        super(NgValue);
        this.datatype = datatype;
        this.string = string;
        this.context = context;
    }
    /**
     * @since 0.0.1
     * @method NgValue#textDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern is instance of pattern class
     * @param {string} str value of text
     * @param {object} node is instanceof NgDOM
     * @returns {object} The newly created pattern.
     */
    textDeriv(context, pattern, str, node) {
        var p = this.datatypeEqual(pattern.datatype, pattern.string, pattern.context, str, context);
        if (p instanceof NgNotAllowed) {
            return new NgValueError(node, pattern, p);
        }
        return p;
    }

}

import {NgClass} from './ng-class';
import {NgNotAllowed} from './ng-not-allowed';
import {NgEmpty} from './ng-empty';
import {NgDataExceptError} from './ng-data-except-error';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgDataExcept
 *
 * @constructor
 * @description
 * NgData is class which is used by NgPattern
 * @param {object} datatype is instanceof NgDatatype
 * @param {array} paramList is list of parameters which is allowed
 * @param {object} pattern instance of pattern class
 */
export class NgDataExcept extends NgClass {
    /**
     * @since 0.0.1
     * @method NgDataExcept#constructor
     *
     */
    constructor(datatype, paramList, pattern) {
        super(NgDataExcept);
        this.datatype = datatype;
        this.paramList = paramList;
        this.pattern = pattern;
    }
    /**
     * @since 0.0.1
     * @method NgData#textDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern instance of pattern class
     * @param {string} str is string which should be validated
     * @param {object} node is instanceof NgAttributeNode
     * @returns {object} The newly created pattern.
     */
     textDeriv(context, pattern, str, node) {
        var p1, p2, n, message;
        p1 = this.datatypeAllows(pattern.datatype, pattern.paramList, str, context);
        p2 = this.textDeriv(context, pattern.pattern, str, node);
        n = !this.nullable(p2);
        if (p1 instanceof NgEmpty && n) {
            return p1;
        } else if (p1 instanceof NgNotAllowed) {
            return new NgDataExceptError(node, pattern, p1);
        }
        message = `data invalid, attribute value "${str}" found on node "${node.type}"`;
        return new NgDataExceptError(node, pattern, new NgNotAllowed(message), true);
    }

}

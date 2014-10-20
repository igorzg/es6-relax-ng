import {NgClass} from './ng-class';
import {NgNotAllowed} from './ng-not-allowed';
import {NgDataError} from './ng-data-error';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgData
 *
 * @constructor
 * @description
 * NgData is class which is used by NgPattern
 * @param {object} datatype is instanceof NgDatatype
 * @param {array} paramList is list of parameters which is allowed
 */
export class NgData extends NgClass {
    /**
     * @since 0.0.1
     * @method NgContext#constructor
     *
     * @param {object} datatype is instanceof NgDatatype
     * @param {object} paramList is list of parameters which is allowed
     *
     */
    constructor(datatype, paramList) {
        super(NgData);
        this.className = 'NgData';
        this.datatype = datatype;
        this.paramList = paramList;
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
     * @param {object} attributeNode is instanceof NgAttributeNode
     * @returns {object} The newly created pattern.
     */
    textDeriv(context, pattern, str, attributeNode) {
        var p = this.datatypeAllows(pattern.datatype, pattern.paramList, str, context);
        if (p instanceof NgNotAllowed) {
            return new NgDataError(attributeNode, pattern, p);
        }
        return p;
    }

}

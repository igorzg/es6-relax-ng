import {NgClass} from './ng-class';
import {NgAttributeError} from './ng-attribute-error';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAttribute
 *
 * @constructor
 * @description
 * NgAttribute is class which is used by NgPattern
 *
 * @param {object} nameClass is instanceof NgName
 * @param {pattern} pattern instance of pattern class
 *
 */
export class NgAttribute extends NgClass{
    /**
     * @since 0.0.1
     * @method NgAttribute#constructor
     * @param nameClass
     * @param pattern
     */
    constructor(nameClass, pattern) {
        super(NgAttribute);
        this.nameClass = nameClass;
        this.pattern = pattern;
        this.className = 'NgAttribute';
    }
    /**
     * @since 0.0.1
     * @method NgAttribute#attDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern instance of pattern class
     * @param {object} attrNode is instanceof Tree
     * @returns {object} The newly created pattern.
     */
    attDeriv(context, pattern, attrNode) {
        if (this.contains(pattern.nameClass, attrNode.qName)) {
            return this.valueMatch(context, pattern.pattern, attrNode.string, attrNode);
        }
        return new NgAttributeError(attrNode, pattern);
    }
}
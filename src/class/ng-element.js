import {NgClass} from './ng-class';
import {NgEmpty} from './ng-empty';
import {NgElementError} from './ng-element-error';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgElement
 *
 * @constructor
 * @description
 * NgData is class which is used by NgPattern
 * @param {object} nameClass instanceof NameClass
 * @param {object} pattern instanceof pattern class
 * @example
 * new NgElement(nameClass, pattern);
 */
export class NgElement extends NgClass {
    /**
     * @since 0.0.1
     * @method NgDataType#constructor
     * @param {object} nameClass instanceof NameClass
     * @param {object} pattern instanceof pattern class
     */
    constructor(nameClass, pattern) {
        super(NgElement);
        this.className = 'NgElement';
        this.nameClass = nameClass;
        this.pattern = pattern;
    }

    /**
     * @since 0.0.1
     * @method NgElement#startTagCloseDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} qName is instanceof NgQName
     * @param {object} node is instanceof NgDOM
     * @returns {object} The newly created pattern.
     *
     */
    startTagOpenDeriv(pattern, qName, node) {
        if (this.contains(pattern.nameClass, qName)) {
            return this.after(pattern.pattern, new NgEmpty());
        }
        return new NgElementError(node, pattern, qName);
    }
}

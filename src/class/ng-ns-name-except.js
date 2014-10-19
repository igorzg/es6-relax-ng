import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgNsNameExcept
 *
 * @constructor
 * @description
 * NgNsNameExcept is class which is used by NgPattern
 */
export class NgNsNameExcept extends NgClass{
    /**
     * @since 0.0.1
     * @method NgNsNameExcept#constructor
     */
    constructor(uri, nameClass) {
        super(NgNsNameExcept);
        this.uri = uri;
        this.nameClass = nameClass;
        this.className = 'NgNsNameExcept';
    }
    /**
     * @since 0.0.1
     * @method NgNsNameExcept#contains
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} nameClass
     * @param {object} qName instance of NgQName class
     * @returns {boolean} this is nullified
     */
    contains(nameClass, qName) {
        return nameClass.uri === qName.uri && !this.contains(nameClass.nameClass, qName);
    }
}
import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgNsName
 *
 * @constructor
 * @description
 * NgNsName is class which is used by NgPattern
 * @example
 * new NgNsName(uri);
 */
export class NgNsName extends NgClass{
    /**
     * @since 0.0.1
     * @method NgNsName#constructor
     *
     */
    constructor(uri) {
        super(NgNsName);
        this.uri = uri;
    }
    /**
     * @since 0.0.1
     * @method NgNsName#contains
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} nameClass
     * @param {object} qName instance of NgQName class
     * @returns {boolean} this is nullified
     */
    contains(nameClass, qName) {
        return nameClass.uri === qName.uri;
    }
}
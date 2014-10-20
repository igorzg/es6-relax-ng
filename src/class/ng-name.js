import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgName
 *
 * @constructor
 * @description
 * NgName is class which is used by NgPattern
 * @example
 * new NgName(uri, localName);
 */
export class NgName extends NgClass{
    /**
     * @since 0.0.1
     * @method NgAnyName#constructor
     *
     */
    constructor(uri, localName) {
        super(NgName);
        this.className = 'NgName';
        this.uri = uri;
        this.localName = localName;
    }
    /**
     * @since 0.0.1
     * @method NgName#contains
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} nameClass
     * @param {object} qName instance of NgQName class
     * @returns {boolean} this is nullified
     */
    contains(nameClass, qName) {
        return (nameClass.uri == qName.uri && nameClass.localName == qName.localName);
    }
}
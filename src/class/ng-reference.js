import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgReference
 *
 * @constructor
 * @description
 * NgReference is class which is used by NgPattern
 */
export class NgReference extends NgClass {
    constructor(name, callback) {
        super(NgReference);
        this.name = name;
        this.func = callback;
        this.className = 'NgReference';
    }
    /**
     * @since 0.0.1
     * @method NgReference#textDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern instance of pattern class
     * @param {string} string which is validated
     * @param {object} node instance of NgDOM
     * @returns {object} The newly created pattern.
     */
    textDeriv(context, pattern, string, node) {
        return this.textDeriv(context, pattern.func(), string, node);
    }
    /**
     * @since 0.0.1
     * @method NgReference#attDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern instance of pattern class
     * @param {object} node instance of NgDOM
     * @returns {object} The newly created pattern.
     */
    attDeriv(context, pattern, node) {
        return this.attDeriv(context, pattern.func(), node);
    }
    /**
     * @since 0.0.1
     * @method NgReference#startTagOpenDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} qName instanceof NgQName pattern
     * @param {object} node instance of NgDOM
     * @returns {object} The newly created pattern.
     */
    startTagOpenDeriv(pattern, qName, node) {
        return this.startTagOpenDeriv(pattern.func(), qName, node);
    }
    /**
     * @since 0.0.1
     * @method NgReference#startTagCloseDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} node instance of NgDOM
     * @returns {object} The newly created pattern.
     */
    startTagCloseDeriv(pattern, node) {
        return this.startTagCloseDeriv(pattern.func(), node);
    }
}

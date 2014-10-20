import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgNameClassChoice
 *
 * @constructor
 * @description
 * NgNameClassChoice is class which is used by NgPattern
 * @example
 * new NgNameClassChoice(nameClass1, nameClass2);
 */
export class NgNameClassChoice extends NgClass{
    /**
     * @since 0.0.1
     * @method NgNameClassChoice#constructor
     *
     */
    constructor(nameClass1, nameClass2) {
        super(NgNameClassChoice);
        this.className = 'NgNameClassChoice';
        this.nameClass1 = nameClass1;
        this.nameClass2 = nameClass2;
    }
    /**
     * @since 0.0.1
     * @method NgNameClassChoice#contains
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} nameClass
     * @param {object} qName instance of NgQName class
     * @returns {boolean} this is nullified
     *
     */
    contains(nameClass, qName) {
        return this.contains(nameClass.nameClass1, qName) || this.contains(nameClass.nameClass2, qName);
    }
}
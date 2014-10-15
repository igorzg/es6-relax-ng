import {NgClass} from './ng-class';
import {NgListError} from './ng-list-error';
import {NgEmpty} from './ng-empty';
import {isString} from '../core';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgList
 *
 * @constructor
 * @description
 * NgList is class which is used by NgPattern
 * @example
 * new NgList(patter);
 */
export class NgList extends NgClass {
    constructor(pattern) {
        super(NgList);
        this.pattern = pattern;
    }
    /**
     * @since 0.0.1
     * @method NgList#textDeriv
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
        var p1, n;
        p1 = this.listDeriv(context, pattern.pattern, reverseWords(str), node);
        n = this.nullable(p1);
        if (n) {
            return new NgEmpty();
        } else {
            return new NgListError(node, pattern, str);
        }
        /**
         * Reverse
         * @param string
         * @returns {Array}
         */
        function reverseWords(string) {
            if (!isString(string)) {
                string = string.toString();
            }
            return string.split(/\s+/).reverse();
        }
    }
}


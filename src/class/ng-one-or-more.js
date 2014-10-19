import {NgClass} from './ng-class';
import {NgEmpty} from './ng-empty';
import {ApplyFlip} from './apply-flip';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgOneOrMore
 *
 * @constructor
 * @description
 * NgOneOrMore is class which is used by NgPattern
 * @param {object} pattern instance of pattern class
 * @example
 * new NgOneOrMore(pattern);
 */
export class NgOneOrMore extends NgClass {

    constructor(pattern) {
        super(NgOneOrMore);
        this.pattern = pattern;
        this.className = 'NgOneOrMore';
    }
    /**
     * @since 0.0.1
     * @method NgOneOrMore#attDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof NgDOM
     * @returns {object} The newly created pattern.
     */
    attDeriv(context, pattern, node) {
        var p1, p2;
        p1 = this.attDeriv(context, pattern.pattern, node);
        p2 = this.choice(pattern, new NgEmpty());
        return  this.group(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgOneOrMore#textDeriv
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
        var p1, p2;
        p1 = this.textDeriv(context, pattern.pattern, str, node);
        p2 = this.choice(pattern, new NgEmpty());
        return this.group(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgOneOrMore#startTagOpenDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern is instance of pattern class
     * @param {object} qName instance of NgQName class
     * @param {object} node is instanceof NgDOM
     * @returns {object} The newly created pattern.
     */
    startTagOpenDeriv(pattern, qName, node) {
        var p1, c1, flip;
        p1 = this.startTagOpenDeriv(pattern.pattern, qName, node);
        c1 = this.choice(pattern, new NgEmpty());
        flip = new ApplyFlip('group', c1, this);
        return this.applyAfter(flip, p1);
    }

    /**
     * @since 0.0.1
     * @method NgOneOrMore#startTagCloseDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof NgDOM
     * @returns {object} The newly created pattern.
     */
    startTagCloseDeriv(pattern, node) {
        var p1 = this.startTagCloseDeriv(pattern.pattern, node);
        return this.oneOrMore(p1);
    }
}

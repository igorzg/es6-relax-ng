import {NgClass} from './ng-class';
import {ApplyFlip} from './apply-flip';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgGroup
 *
 * @constructor
 * @description
 * NgChoice is class which is used by NgPattern
 * @param {object} pattern1 is instanceof pattern class
 * @param {object} pattern2 is instanceof pattern class
 * @example
 * new NgGroup(pattern1, pattern2);
 */
export class NgGroup extends NgClass {
    constructor(pattern1, pattern2) {
        super(NgGroup);
        this.pattern1 = pattern1;
        this.pattern2 = pattern2;
    }
    /**
     * @since 0.0.1
     * @method NgGroup#attDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof NgDOM
     * @returns {object} The newly created pattern.
     */
    attDeriv(context, pattern, node) {
        var p1, p2, gr1, gr2;
        p1 = this.attDeriv(context, pattern.pattern1, node);
        p2 = this.attDeriv(context, pattern.pattern2, node);
        gr1 = this.group(p1, pattern.pattern2);
        gr2 = this.group(pattern.pattern1, p2);
        return this.choice(gr1, gr2);
    }
    /**
     * @since 0.0.1
     * @method NgGroup#startTagOpenDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern is instance of pattern class
     * @param {object} qName instance of NgQName class
     * @param {object} node is instanceof Tree
     * @returns {object} The newly created pattern.
     */
    startTagOpenDeriv(pattern, qName, node) {
        var p1, flip, x, p2;
        p1 = this.startTagOpenDeriv(pattern.pattern1, qName, node);
        flip = new ApplyFlip('group', pattern.pattern2, this);
        x = this.applyAfter(flip, p1);
        if (this.nullable(pattern.pattern1)) {
            p2 = this.startTagOpenDeriv(pattern.pattern2, qName, node);
            return this.choice(x, p2);
        } else {
            return x;
        }
    }
    /**
     * @since 0.0.1
     * @method NgGroup#startTagCloseDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof Tree
     * @returns {object} The newly created pattern.
     *
     */
    startTagCloseDeriv(pattern, node) {
        var p1, p2;
        p1 = this.startTagCloseDeriv(pattern.pattern1, node);
        p2 = this.startTagCloseDeriv(pattern.pattern2, node);
        return  this.group(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgGroup#textDeriv
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
        var p1, p, p2;
        p1 = this.textDeriv(context, pattern.pattern1, str, node);
        p = this.group(p1, pattern.pattern2);

        if (this.nullable(p)) {
            p2 = this.textDeriv(context, pattern.pattern2, str, node);
            return this.choice(p, p2);
        } else {
            return p;
        }
    }
}

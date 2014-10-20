import {NgClass} from './ng-class';
import {ApplyFlip} from './apply-flip';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgEmpty
 *
 * @constructor
 * @description
 * NgEmpty is class which is used by NgPattern
 * @example
 * new NgEmpty();
 */
export class NgInterLeave extends NgClass {

    constructor(pattern1, pattern2) {
        super(NgInterLeave);
        this.className = 'NgInterLeave';
        this.pattern1 = pattern1;
        this.pattern2 = pattern2;
    }

    /**
     * @since 0.0.1
     * @method NgInterLeave#startTagOpenDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern is instance of pattern class
     * @param {object} qName instance of NgQName class
     * @param {object} node is instanceof NgDOM
     * @returns {object} The newly created pattern.
     */
    startTagOpenDeriv(pattern, qName, node) {
        var p1, p2, flip, flip2, c1, c2;
        p1 = this.startTagOpenDeriv(pattern.pattern1, qName, node);
        p2 = this.startTagOpenDeriv(pattern.pattern2, qName, node);
        flip = new ApplyFlip('interleave', pattern.pattern2, this);
        flip2 = new ApplyFlip('interleave', pattern.pattern1, this, true); // reverse
        c1 = this.applyAfter(flip, p1);
        c2 = this.applyAfter(flip2, p2);
        return this.choice(c1, c2);
    }

    /**
     * @since 0.0.1
     * @method NgInterLeave#textDeriv
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
        var p1, p2, c1, c2;
        p1 = this.textDeriv(context, pattern.pattern1, str, node);
        p2 = this.textDeriv(context, pattern.pattern2, str, node);
        c1 = this.interleave(p1, pattern.pattern2);
        c2 = this.interleave(pattern.pattern1, p2);
        return this.choice(c1, c2);
    }
    /**
     * @since 0.0.1
     * @method NgInterLeave#startTagCloseDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof NgDOM
     * @returns {object} The newly created pattern.
     */
    startTagCloseDeriv(pattern, node) {
        var p1, p2;
        p1 = this.startTagCloseDeriv(pattern.pattern1, node);
        p2 = this.startTagCloseDeriv(pattern.pattern2, node);
        return this.interleave(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgInterLeave#attDeriv
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
        gr1 = this.interleave(p1, pattern.pattern2);
        gr2 = this.interleave(pattern.pattern1, p2);
        return this.choice(gr1, gr2);
    }
}

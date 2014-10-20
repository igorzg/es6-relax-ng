import {NgClass} from './ng-class';
/**
 * @license 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgChoice
 *
 * @constructor
 * @description
 * NgChoice is class which is used by NgValidator
 *
 */
export class NgChoice extends NgClass{
    /**
     * @since 0.0.1
     * @method NgChoice#constructor
     * @param pattern1
     * @param pattern2
     */
     constructor(pattern1, pattern2) {
        super(NgChoice);
        this.className = 'NgChoice';
        this.pattern1 = pattern1;
        this.pattern2 = pattern2;

     }
    /**
     * @since 0.0.1
     * @method NgChoice#attDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern instance of pattern class
     * @param {object} attributeNode is instanceof NgAttributeNode
     * @returns {object} The newly created pattern.
     */
     attDeriv(context, pattern, attributeNode) {
         var p1, p2;
         p1 = this.attDeriv(context, pattern.pattern1, attributeNode);
         p2 = this.attDeriv(context, pattern.pattern2, attributeNode);
         return this.choice(p1, p2);
     }
    /**
     * @since 0.0.1
     * @method NgChoice#endTagDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof Tree
     * @returns {object} The newly created pattern.
     */
    endTagDeriv(pattern, node) {
        var p1, p2;
        p1 = this.endTagDeriv(pattern.pattern1, node);
        p2 = this.endTagDeriv(pattern.pattern2, node);
        return this.choice(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgChoice#startTagOpenDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern is instance of pattern class
     * @param {object} qName instance of NgQName class
     * @param {object} node is instanceof Tree
     * @returns {object} The newly created pattern.
     */
    startTagOpenDeriv(pattern, qName, node) {
        var p1, p2;
        p1 = this.startTagOpenDeriv(pattern.pattern1, qName, node);
        p2 = this.startTagOpenDeriv(pattern.pattern2, qName, node);
        return this.choice(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgChoice#applyAfter
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} func is instance of ApplyAfter
     * @param {object} pattern instance of pattern class
     * @returns {object} The newly created pattern.
     *
     */
    applyAfter(func, pattern) {
        var p1, p2;
        p1 = this.applyAfter(func, pattern.pattern1);
        p2 = this.applyAfter(func, pattern.pattern2);
        return this.choice(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgChoice#textDeriv
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
        p1 = this.textDeriv(context, pattern.pattern1, str, node);
        p2 = this.textDeriv(context, pattern.pattern2, str, node);
        return this.choice(p1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgChoice#startTagCloseDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof Tree
     * @returns {object} The newly created pattern.
     */
    startTagCloseDeriv(pattern, node) {
        var p1, p2;
        p1 = this.startTagCloseDeriv(pattern.pattern1, node);
        p2 = this.startTagCloseDeriv(pattern.pattern2, node);
        return this.choice(p1, p2);
    }
}
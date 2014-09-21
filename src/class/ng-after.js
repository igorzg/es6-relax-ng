import {ApplyFlip} from './apply-flip';
import {NgNotAllowed} from './ng-not-allowed';
import {handleError} from '../core';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAfter
 *
 * @constructor
 * @description
 * NgAfter is class which is used by NgPattern
 */
export class NgAfter extends NgClass {
    /**
     * @since 0.0.1
     * @method NgAfter#constructor
     *
     * @param {object} pattern1 instance of pattern class
     * @param {object} pattern2 instance of pattern class
     *
     */
    constructor(pattern1, pattern2) {
        super(NgAfter);
        this.pattern1 = pattern1;
        this.pattern2 = pattern2;
    }
    /**
     * @since 0.0.1
     * @method NgAfter#attDeriv
     *
     * @description
     * This is used by NgValidator, context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern instance of pattern class
     * @param {object} attributeNode is instanceof Tree
     * @returns {object} The newly created pattern.
     *
     */
    attDeriv(context, pattern, attributeNode) {
        var p1 = this.attDeriv(context, pattern.pattern1, attributeNode);
        return this.after(p1, pattern.pattern2);
    }
    /**
     * @since 0.0.1
     * @method NgAfter#startTagOpenDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern is instance of pattern class
     * @param {object} qName instance of NgQName class
     * @param {object} tree is instanceof Tree
     * @returns {object} The newly created pattern.
     */
    startTagOpenDeriv(pattern, qName, tree) {
        var p1, flip;
        p1 = this.startTagOpenDeriv(pattern.pattern1, qName, tree);
        flip = new ApplyFlip('after', pattern.pattern2, this);
        return this.applyAfter(flip, p1);
    }
    /**
     * @since 0.0.1
     * @method NgAfter#applyAfter
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} func is instance of ApplyAfter
     * @param {object} pattern instance of pattern class
     * @returns {object} The newly created pattern.
     */
    applyAfter(func, pattern) {
        var p2 = func.invoke(pattern.pattern2);
        return this.after(pattern.pattern1, p2);
    }
    /**
     * @since 0.0.1
     * @method NgAfter#textDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {array} context NgContext
     * @param {object} pattern is instance of pattern class
     * @param {string} str value of text
     * @param {object} tree is instanceof Tree
     * @returns {object} The newly created pattern.
     *
     */
    textDeriv(context, pattern, str, tree) {
        var p1 = this.textDeriv(context, pattern.pattern1, str, tree);
        return this.after(p1, pattern.pattern2);
    }
    /**
     * @since 0.0.1
     * @method NgAfter#endTagDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} tree is instanceof Tree
     * @returns {object} The newly created pattern.
     *
     */
    endTagDeriv(pattern, tree) {
        if (this.nullable(pattern.pattern1)) {
            return pattern.pattern2;
        } else {
            return new NgAfterError(tree, pattern);
        }
    }

    /**
     * @since 0.0.1
     * @method NgAfter#startTagCloseDeriv
     *
     * @description
     * This is used by NgValidator context of function is overridden
     * @param {object} pattern instance of pattern class
     * @param {object} tree is instanceof Tree
     * @returns {object} The newly created pattern.
     *
     */
    startTagCloseDeriv(pattern, tree) {
        var p1 = this.startTagCloseDeriv(pattern.pattern1, tree);
        return this.after(p1, pattern.pattern2);
    }
}


/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAfterError
 *
 * @constructor
 * @description
 * NgAfterError is class which is used by NgAfter
 *
 * @param {object} pattern instance of pattern class
 * @param {object} tree is instanceof Tree
 *
 * @example
 * new NgAfterError(tree, pattern);
 */
class NgAfterError extends NgNotAllowed {
    /**
     * NgAfterError constructor
     * @param tree
     * @param pattern
     */
    constructor(tree, pattern) {
        super(handleError("Missing content"), tree, pattern);
        this.instanceOf(NgAfterError);
        this.type = 'NgAfterError';
    }
}
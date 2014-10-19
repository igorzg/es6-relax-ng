import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgText
 *
 * @constructor
 * @description
 * NgText is class which is used by NgPattern
 * @example
 * new NgText();
 */
export class NgText extends NgClass {
    constructor() {
        super(NgText);
        this.className = 'NgText';
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @name NgText
     *
     * @constructor
     * @description
     * NgText is class which is used by NgPattern
     *
     * @param {object} context instance of NgContext
     * @param {object} pattern is instanceof pattern class
     * @param {object} string string value of text
     * @param {object} node  is instanceof NgDOM
     */
    textDeriv(context, pattern, string, node) {
        return pattern;
    }
}

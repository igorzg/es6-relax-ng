import {NgClass} from './ng-class';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgNotAllowed
 *
 * @constructor
 * @description
 *
 * NgNotAllowed is used by NgValidator internally
 *
 */
export class NgNotAllowed extends NgClass{
    /**
     * @since 0.0.1
     * @method NgNotAllowed#constructor
     *
     * @description
     * NgNotAllowed constructor method
     * @param {string} message
     * @param {object} node
     * @param {object} pattern
     *
     */
    constructor(message, node, pattern) {
        super(NgNotAllowed);
        this.message = message;
        this.node = node;
        this.pattern = pattern;
        this.className = 'NgNotAllowed';
    }
}


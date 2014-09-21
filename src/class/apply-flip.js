import {NgClass} from './ng-class';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name ApplyFlip
 *
 * @constructor
 * @description
 *
 * ApplyFlip is used by NgValidator internally
 *
 */
export class ApplyFlip extends NgClass {
    /**
     * @since 0.0.1
     * @method ApplyFlip#constructor
     *
     * @description
     * ApplyFlip constructor method
     * @param {string} func name of function to execute
     * @param {object} arg2 pattern argument to apply
     * @param {object} context context of function name where function will be executed
     * @param {boolean} reverse arguments will be executed in reversed order (fliped)
     *
     */
    constructor(func, arg2, context, reverse) {
        super(ApplyFlip);
        this.func = func;
        this.arg2 = arg2;
        this.context = context;
        this.reverse = !!reverse;
    }

    /**
     * @since 0.0.1
     * @method ApplyFlip#invoke
     *
     * @description
     * Invoke method on certain context with arguments
     * @param {object} arg1 pattern argument to apply
     * @returns {object} The newly created pattern.
     *
     */
    invoke(arg1) {
        if (this.reverse) {
            return this.context[this.func](this.arg2, arg1);
        } else {
            return this.context[this.func](arg1, this.arg2);
        }
    }
}

import {handleError} from '../core';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgError
 *
 * @constructor
 * @description
 *
 * NgError is main error class
 *
 */
export class NgError {
    /**
     * NgError constructor
     */
    constructor() {
        var args = Array.prototype.slice.call(arguments), message = args.shift();
        if (Array.isArray(args[0]) && args.length === 1) {
            args = args[0];
        }
        throw new Error(handleError(message, args));
    }
}
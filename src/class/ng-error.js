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
     * @param message
     */
    constructor(message) {
        throw new Error(message);
    }
}
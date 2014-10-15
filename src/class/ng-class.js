import {NgError} from './ng-error';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgClass
 *
 * @constructor
 * @description
 *
 * NgClass is main class
 *
 */

export class NgClass {

    constructor(Class) {
        this.instanceOf(Class);
    }
    /**
     * @since 0.0.1
     * @method NgClass#instanceOf
     *
     * @param {object} Class check class instance
     *
     */
    instanceOf(Class) {
        var message;
        if (!(this instanceof Class)) {
            message = Class.toString();
            throw new NgError(`Class ${message} is not instantiated`);
        }
    }
}
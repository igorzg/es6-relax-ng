import {NgError} from './ng-error';
import {handleError} from '../core';
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
    /**
     * @since 0.0.1
     * @method NgClass#instanceOf
     *
     * @param {object} Class check class instance
     *
     */
     constructor(Class) {
        if (!(this instanceof Class)) {
            throw new NgError(handleError('Class {0} is not instantiated'));
        }
     }
}
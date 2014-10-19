import {NgClass} from './ng-class';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAnyName
 *
 * @constructor
 * @description
 * NgAnyName is class which is used by NgPattern
 */
export class NgAnyName extends NgClass{
    /**
     * @since 0.0.1
     * @method NgAnyName#constructor
     *
     */
    constructor() {
        super(NgAnyName);
        this.className = 'NgAnyName';
    }
    /**
     * @since 0.0.1
     * @method NgAnyName#contains
     * @description
     * Contains pattern
     */
    contains() {
        return true;
    }
}
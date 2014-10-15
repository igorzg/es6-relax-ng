import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgEmpty
 *
 * @constructor
 * @description
 * NgEmpty is class which is used by NgPattern
 * @example
 * new NgEmpty();
 */
export class NgEmpty extends NgClass {
    /**
     * Empty instance
     */
    constructor() {
        super(NgEmpty);
    }
}

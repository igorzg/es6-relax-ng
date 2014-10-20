import {NgClass} from './ng-class';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgAnyNameExcept
 *
 * @constructor
 * @description
 * NgAnyNameExcept is class which is used by NgPattern
 */
export class NgAnyNameExcept extends NgClass{
    /**
     * @since 0.0.1
     * @method NgAnyNameExcept#constructor
     *
     */
    constructor(nameClass) {
        super(NgAnyNameExcept);
        this.className = 'NgAnyNameExcept';
        this.nameClass = nameClass;
    }
    /**
     * @since 0.0.1
     * @method NgAnyNameExcept#contains
     * @description
     * Contains pattern
     * @param nameClass
     * @param qName
     */
    contains(nameClass, qName) {
        return !this.contains(nameClass.nameClass, qName);
    }
}
import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgParam
 *
 * @constructor
 * @description
 * NgParam is class which is used by NgPattern
 * @param {string} localName name
 * @param {string} string namespace
 */
export class NgParam extends NgClass {
    constructor(localName, string) {
        super(NgParam);
        this.className = 'NgParam';
        this.localName = localName;
        this.string = string;
    }
}

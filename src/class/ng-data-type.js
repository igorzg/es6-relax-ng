import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgDataType
 *
 * @constructor
 * @description
 * NgDataType is class which is used by NgPattern
 * @param {string} uri namespace uri
 * @param {string} localName of datatype
 */
export class NgDataType extends NgClass {
    /**
     * @since 0.0.1
     * @method NgDataType#constructor
     * @param {string} uri namespace uri
     * @param {string} localName of datatype
     */
     constructor(uri, localName) {
        super(NgDataType);
        this.uri = uri;
        this.localName = localName;
     }
}

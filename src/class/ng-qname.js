import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgQName
 *
 * @constructor
 * @description
 * NgQName is class which is used by NgPattern
 *
 * @param {string} uri namespace
 * @param {string} localName name
 *
 */
export class NgQName extends NgClass{
    constructor(uri, localName) {
        super(NgQName);
        this.uri = uri;
        this.localName = localName;
        this.className = 'NgQName';
    }
}
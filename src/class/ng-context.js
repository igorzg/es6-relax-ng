import {NgClass} from './ng-class';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgContext
 *
 * @constructor
 * @description
 * NgContext is class which is used by NgPattern
 * @param {string} uri is namespace uri
 * @param {array} map is map of namespaces
 */
export class NgContext extends NgClass {
    /**
     * @since 0.0.1
     * @method NgContext#constructor
     *
     * @param {object} uri instance of pattern class
     * @param {object} map instance of pattern class
     *
     */
    constructor(uri = "", map = []) {
        super(NgContext);
        this.uri = uri;
        this.map = map;
    }

}

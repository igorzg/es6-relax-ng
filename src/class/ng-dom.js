import {NgClass} from './ng-class';
import {NgError} from './ng-error';
import {isNode, nextUid} from '../core';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgDOM
 *
 * @constructor
 * @description
 *
 * NgDOM is used for DOM query and manipulation
 *
 */
export class NgDOM extends NgClass{
    constructor(node) {
        super(NgDOM);
        if (!isNode(node)) {
            throw new NgError('NgDOM error node is not valid');
        }
        this.node = node;
        if (this.node.localName && this.node.prefix) {
            this.type = this.node.localName;
            this.typePrefix = this.node.prefix;
        } else {
            this.type = this.node.nodeName;
            this.typePrefix = null;
        }
        // used for debugging
        this.id = nextUid();
    }
}
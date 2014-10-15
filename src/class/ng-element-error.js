import {NgNotAllowed} from './ng-not-allowed';
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgDataError
 *
 * @constructor
 * @description
 * NgDataError is class which is used by NgData
 *
 */
export class NgElementError extends NgNotAllowed {
    /**
     * @param {object} pattern instance of pattern class
     * @param {object} node is instanceof Tree
     * @param {object} qName is instanceof NgQName
     */
     constructor(node, pattern, qName) {
        var message = `invalid tag name: '${qName.localName}' or uri: '${qName.uri}',
        expected tag name is: '${pattern.nameClass.localName}' and uri: '${pattern.nameClass.uri}'`;
        this.instanceOf(NgElementError);
        super(message, node, pattern);
        this.qName = qName;
        this.type = 'NgElementError';
     }
}
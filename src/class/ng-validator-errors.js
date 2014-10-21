import {NgClass} from './ng-class';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorContainsError
 * @constructor
 * @description
 * NgValidatorContainsError
 */
export class NgValidatorContainsError extends NgClass{
    constructor(nameClass, qName) {
        var message = `invalid pattern: -> schema pattern is not valid pattern in contains`;
        this.instanceOf(NgValidatorContainsError);
        super(message, nameClass, qName);
        this.className = 'NgValidatorContainsError';
    }
}
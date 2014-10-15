import {NgClass} from './ng-class';
import {NgError} from './ng-error';
import {NgContext} from './ng-context';
import {NgSchema} from './ng-schema';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgPattern
 *
 * @constructor
 * @description
 *
 * NgPattern class is creating pattern ot of schema for validation algorithm
 */
export class NgPattern extends NgClass{

    constructor(schema) {
        super(NgPattern);
        this.context = new NgContext();
        if (schema instanceof NgSchema) {
            this.schemaInstance = schema;
        } else {
            throw new NgError('schema object is not valid schema instance it must be NgSchema')
        }
    }
}
import {NgValidator} from '../src/class/ng-validator';
import {NgSchema} from '../src/class/ng-schema';
import {NgPattern} from '../src/class/ng-pattern';
import {getXML} from '../src/core';
describe('NgValidator', function() {

    var schemaInstance, patternInstance;
    beforeEach(function() {
        getXML('/base/test/xml/schema.rng', false).then((data) => {
            schemaInstance = new NgSchema(data);
            schemaInstance.simplify();
            patternInstance = new NgPattern(schemaInstance);

        });
    });
    it('Construct', function() {
        var validator = new NgValidator(patternInstance);
    });



});

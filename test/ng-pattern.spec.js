import {NgSchema} from '../src/class/ng-schema';
import {NgPattern} from '../src/class/ng-pattern';
import {getXML} from '../src/core';

describe('NgPattern', function () {
    var schemaInstance;
    beforeEach(function () {
        getXML('/base/test/xml/schema_1.rng', false).then((data) => {
            schemaInstance = new NgSchema(data);
            schemaInstance.simplify();
        });
    });

    it('construct', function() {
        //console.log(schemaInstance.toString(true));
        var pattern = new NgPattern(schemaInstance), message;
        expect(pattern.schemaInstance).toBe(schemaInstance);

        try {
            new NgPattern();
        } catch (e) {
            message = e.message;
        }
        expect(message).toBe('schema object is not valid schema instance it must be NgSchema');
    });

});



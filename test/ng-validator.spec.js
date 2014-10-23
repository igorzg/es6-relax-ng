import {NgValidator} from '../src/class/ng-validator';
import {NgSchema} from '../src/class/ng-schema';
import {NgPattern} from '../src/class/ng-pattern';
import {NgDOM} from '../src/class/ng-dom';
import {getXML} from '../src/core';
describe('NgValidator', function() {

    var schemaInstance, patternInstance, xml;
    beforeEach(function() {
        getXML('/base/test/xml/schema_4.rng', false).then((data) => {
            schemaInstance = new NgSchema(data);
            schemaInstance.simplify();
            patternInstance = new NgPattern(schemaInstance);

        });

        getXML('/base/test/xml/test.xml', false).then((data) => {
            xml = new NgDOM(data);
        });
    });
    it('Construct', function() {
        var validator = new NgValidator(patternInstance);
        //console.log('xml', xml);
        var validation = validator.validate(xml);
        //console.log(validation.errorClassName);
        //console.log(validation);
    });



});

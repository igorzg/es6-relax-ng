import {NgCollection} from '../src/class/ng-collection';
import {NgSchema} from '../src/class/ng-schema';
import {NgPattern} from '../src/class/ng-pattern';
import {NgDOM} from '../src/class/ng-dom';
import {getXML} from '../src/core';
describe('NgValidator', function () {

    var schemaInstance, patternInstance, xml;
    beforeEach(function () {
        getXML('/base/test/xml/schema_4.rng', false).then((data) => {
            schemaInstance = new NgSchema(data);
            schemaInstance.simplify();
            patternInstance = new NgPattern(schemaInstance);

        });

        getXML('/base/test/xml/test3.xml', false).then((data) => {
            xml = new NgDOM(data);
        });
    });


    it('Construct', function () {
        var collection = new NgCollection(patternInstance);
        collection.collect(xml);
        console.log('collection', collection.collection);
    });


});

import {NgDOM} from '../src/class/ng-dom';
import {getXML, isNode, isNumber} from '../src/core';

describe('NgDOM', function() {
  var xmlDoc;
  beforeEach(function(){
      getXML('/base/test/test.xml', function(data) {
          xmlDoc = data;
      }, false);
  });
  it('Should create an instance', function() {
       var dom = new NgDOM(xmlDoc);
       expect(dom instanceof NgDOM).toBe(true);
       expect(isNode(dom.node)).toBe(true);
       expect(dom.type).toBe('#document');
       expect(dom.typePrefix).toBe(null);
       expect(isNumber(dom.id)).toBe(true);
  });
});



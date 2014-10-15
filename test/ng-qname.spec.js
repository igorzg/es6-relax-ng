import {NgQName} from '../src/class/ng-qname';
describe('NgQName', function() {

    it('Construct', function() {
      var obj = new NgQName(1, 2);
      expect(obj instanceof NgQName).toBe(true);
      expect(obj.uri).toBe(1);
      expect(obj.localName).toBe(2);
    });


});



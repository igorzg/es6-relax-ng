import {NgDataType} from '../src/class/ng-data-type';

describe('NgDataType', function() {

  it('Construct', function() {
      var ob = new NgDataType(1, 2);
      expect(ob instanceof NgDataType).toBe(true);
      expect(ob.uri).toBe(1);
      expect(ob.localName).toBe(2);
      expect(ob.className).toBe('NgDataType');
  });
});



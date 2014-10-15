import {NgContext} from '../src/class/ng-context';

describe('NgContext', function() {

  it('Construct', function() {
      var str = "ab";
      var map = [];
      var ob = new NgContext(str, map);
      expect(ob instanceof NgContext).toBe(true);
      expect(ob.uri).toBe(str);
      expect(ob.map).toBe(map);
  });
});



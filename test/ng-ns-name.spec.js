import {NgNsName} from '../src/class/ng-ns-name';

describe('NgNsName', function() {

  it('Construct, contains', function() {
      var ob = new NgNsName(1);
      expect(ob instanceof NgNsName).toBe(true);
      expect(ob.contains(ob, new NgNsName(1))).toBe(true);
      expect(ob.contains(ob, new NgNsName(2))).toBe(false);
      expect(ob.className).toBe('NgNsName');
  });
});



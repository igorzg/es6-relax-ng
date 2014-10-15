import {NgNsNameExcept} from '../src/class/ng-ns-name-except';

describe('NgNsNameExcept', function() {

  it('Construct, contains', function() {
      var ob = new NgNsNameExcept(1, 2);
      expect(ob instanceof NgNsNameExcept).toBe(true);
      expect(ob.contains(ob, new NgNsNameExcept(1,2))).toBe(true);
      expect(ob.contains(ob, new NgNsNameExcept(2, 1))).toBe(false);
  });
});



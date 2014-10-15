import {NgName} from '../src/class/ng-name';

describe('NgName', function() {

  it('Construct, contains', function() {
      var qName = new NgName(1, 2);
      var ob = new NgName(1, 2);
      expect(ob instanceof NgName).toBe(true);
      expect(ob.contains(ob, qName)).toBe(true);
      qName = new NgName(2, 1);
      expect(ob.contains(ob, qName)).toBe(false);
  });
});



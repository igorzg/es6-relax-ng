import {NgAnyName} from '../src/class/ng-any-name';
describe('NgAnyName', function() {

    it('Construct', function() {
      var o = new NgAnyName();
      expect(o instanceof NgAnyName).toBe(true);
      expect(o.contains()).toBe(true);
      expect(o.className).toBe('NgAnyName');
    });
});



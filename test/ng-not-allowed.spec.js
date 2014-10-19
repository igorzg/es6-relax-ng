import {NgNotAllowed} from '../src/class/ng-not-allowed';

describe('NgNotAllowed', function() {

  it('Construct', function() {
      var ob = new NgNotAllowed(1, 2, 3);
      expect(ob instanceof NgNotAllowed).toBe(true);
      expect(ob.message).toBe(1);
      expect(ob.node).toBe(2);
      expect(ob.pattern).toBe(3);
      expect(ob.className).toBe('NgNotAllowed');
  });
});



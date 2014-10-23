import {NgAfterError} from '../src/class/ng-after-error';
describe('NgAfterError', function() {

    it('Construct', function() {
      var pattern = {};
      var node = {
          toXML(){return 1;}
      };
      var o = new NgAfterError(node, pattern);
      expect(o instanceof NgAfterError).toBe(true);
      expect(o.message).toBe('Missing content at node: 1');
      expect(o.pattern).toBe(pattern);
      expect(o.node).toBe(node);
      expect(o.errorClassName).toBe('NgAfterError');
      expect(o.className).toBe('NgNotAllowed');

    });
});



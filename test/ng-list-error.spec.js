import {NgListError} from '../src/class/ng-list-error';
describe('NgListError', function() {

    it('Construct', function() {
      var pattern = {};
      var node = {node: 'node', toXML() { return 'node'}};
      var str = 'a';
      var o = new NgListError(node, pattern, str);
      expect(o instanceof NgListError).toBe(true);
      expect(o.message).toBe('list invalid, "a" found  on "node"');
      expect(o.pattern).toBe(pattern);
      expect(o.node).toBe(node);
      expect(o.errorClassName).toBe('NgListError');
      expect(o.className).toBe('NgNotAllowed');
    });
});



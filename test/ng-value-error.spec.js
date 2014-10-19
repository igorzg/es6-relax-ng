import {NgValueError} from '../src/class/ng-value-error';
import {NgDataType} from '../src/class/ng-data-type';
describe('NgValueError', function() {

    it('Construct', function() {
      var pattern = {};
      var node = 'node';
      var dtType = new NgDataType(1, 2);
      var ngNotAllowed = {
          node: dtType,
          pattern: pattern,
          message: 'Helloworld'
      };
      var o = new NgValueError(node, pattern, ngNotAllowed);
      expect(o instanceof NgValueError).toBe(true);
      expect(o.message).toBe('Helloworld');
      expect(o.pattern).toBe(pattern);
      expect(o.node).toBe(node);
      expect(o.className).toBe('NgValueError');
      expect(o.dataType).toBe(dtType);
      expect(o.dataTypePattern).toBe(pattern);
    });
});



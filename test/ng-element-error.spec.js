import {NgElementError} from '../src/class/ng-element-error';
describe('NgElementError', function() {

    it('Construct', function() {

      var node = 'node';
      var qName = {
          localName: 1,
          uri:2
      };
      var pattern = {nameClass: qName};
      var o = new NgElementError(node, pattern, qName);
      expect(o instanceof NgElementError).toBe(true);
        var message = `invalid tag name: '1' or uri: '2',
        expected tag name is: '1' and uri: '2'`;
      expect(o.message).toBe(message);
      expect(o.pattern).toBe(pattern);
      expect(o.node).toBe(node);
      expect(o.type).toBe('NgElementError');
      expect(o.qName).toBe(qName);
    });
});



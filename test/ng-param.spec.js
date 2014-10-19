import {NgParam} from '../src/class/ng-param';
describe('NgParam', function() {

    it('Construct', function() {
      var obj = new NgParam(1, 2);
      expect(obj instanceof NgParam).toBe(true);
      expect(obj.localName).toBe(1);
      expect(obj.string).toBe(2);
      expect(obj.className).toBe('NgParam');
    });


});



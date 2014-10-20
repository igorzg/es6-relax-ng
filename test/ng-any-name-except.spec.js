import {NgAnyNameExcept} from '../src/class/ng-any-name-except';
describe('NgAnyNameExcept', function() {

    it('Construct', function() {
      var className = {};
      var o = new NgAnyNameExcept(className);
      expect(o instanceof NgAnyNameExcept).toBe(true);
      var ctx = {
          contains: function(a, b) {
              expect(a).toBe(1);
              expect(b).toBe('name');
              return true;
          }
      };
      spyOn(ctx, 'contains');
      expect(o.contains.call(ctx, {nameClass: 1}, 'name')).toBe(true);
      expect(ctx.contains).toHaveBeenCalled();
      expect(o.nameClass).toBe(className);
      expect(o.className).toBe('NgAnyNameExcept');
    });
});



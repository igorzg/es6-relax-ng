import {NgNameClassChoice} from '../src/class/ng-name-class-choice';

describe('NgNameClassChoice', function() {

  it('Construct, contains', function() {
      var ob = new NgNameClassChoice(1, 2);
      var qName = {};
      expect(ob instanceof NgNameClassChoice).toBe(true);
      var ctx = {
          contains: function(a, b) {
              return true;
          }
      };
      spyOn(ctx, 'contains').andCallThrough();
      expect(ob.contains.call(ctx, ob, qName)).toBe(true);
      expect(ctx.contains).toHaveBeenCalled();
      expect(ob.className).toBe('NgNameClassChoice');
  });
});



import {ApplyFlip} from '../src/class/apply-flip';

describe('ApplyFlip', function() {

  it('Construct, invoke, reverse', function() {
      var ctx = {
          noop: noop,
          noopr: noopReverse
      };
      function noop(a, b) {
          expect(a).toBe(1);
          expect(b).toBe(2);
      }
      function noopReverse(a, b) {
          expect(a).toBe(2);
          expect(b).toBe(1);
      }
      var ob = new ApplyFlip('noop', 2, ctx, false);
      expect(ob instanceof ApplyFlip).toBe(true);
      ob.invoke(1);
      expect(ob.className).toBe('ApplyFlip');
      var ob2 = new ApplyFlip('noopr', 2, ctx, true);
      expect(ob2 instanceof ApplyFlip).toBe(true);
      ob2.invoke(1);

      expect(ob2.className).toBe('ApplyFlip');
  });
});



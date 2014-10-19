import {NgReference} from '../src/class/ng-reference';
describe('NgReference', function() {
    var obj, noop = () => {return 1;};
    beforeEach(function() {
        obj = new NgReference('node', noop);
    });

    it('Construct', function() {
      expect(obj instanceof NgReference).toBe(true);
      expect(obj.name).toBe('node');
      expect(obj.func).toBe(noop);
      expect(obj.className).toBe('NgReference');
    });

    it('textDeriv', function() {
        var context = [];
        var str = 'a';
        var node = 'node';
        var ctx = {
            textDeriv(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(1);
                expect(c).toBe(str);
                expect(d).toBe(node);
                return b;
            }
        };
        spyOn(ctx, 'textDeriv').andCallThrough();
        expect(obj.textDeriv.call(ctx, context, obj, str, node)).toBe(1);
        expect(ctx.textDeriv).toHaveBeenCalled();
    });


    it('attDeriv', function() {
        var context = [];
        var node = 'node';
        var ctx = {
            attDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(1);
                expect(c).toBe(node);
                return b;
            }
        };
        spyOn(ctx, 'attDeriv').andCallThrough();
        expect(obj.attDeriv.call(ctx, context, obj,  node)).toBe(1);
        expect(ctx.attDeriv).toHaveBeenCalled();
    });

    it('startTagCloseDeriv', function() {
        var node = 'node';
        var ctx = {
            startTagCloseDeriv(b, c) {
                expect(b).toBe(1);
                expect(c).toBe(node);
                return b;
            }
        };
        spyOn(ctx, 'startTagCloseDeriv').andCallThrough();
        expect(obj.startTagCloseDeriv.call(ctx, obj,  node)).toBe(1);
        expect(ctx.startTagCloseDeriv).toHaveBeenCalled();
    });


    it('startTagOpenDeriv', function() {
        var node = 'node';
        var qNode = {};
        var ctx = {
            startTagOpenDeriv(a, b, c) {
                expect(a).toBe(1);
                expect(b).toBe(qNode);
                expect(c).toBe(node);
                return a;
            }
        };
        spyOn(ctx, 'startTagOpenDeriv').andCallThrough();
        expect(obj.startTagOpenDeriv.call(ctx, obj, qNode,  node)).toBe(1);
        expect(ctx.startTagOpenDeriv).toHaveBeenCalled();
    });
});



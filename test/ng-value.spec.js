import {NgValue} from '../src/class/ng-value';
import {NgValueError} from '../src/class/ng-value-error';
import {NgNotAllowed} from '../src/class/ng-not-allowed';
describe('NgValue', function() {

    it('Construct', function() {
        var ob = new NgValue(1, 2, 3);
        expect(ob instanceof NgValue).toBe(true);
        expect(ob.datatype).toBe(1);
        expect(ob.string).toBe(2);
        expect(ob.context).toBe(3);
    });

    it('textDeriv', function() {
        var str = 'name';
        var node = 'node';
        var context = [];
        var ctx = {
            datatypeEqual: function(a, b, c, d, e) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                expect(c).toBe(3);
                expect(d).toBe(str);
                expect(e).toBe(context);
                return 'datatypeEqual';
            }
        };
        var ob = new NgValue(1, 2, 3);

        spyOn(ctx, 'datatypeEqual').andCallThrough();
        var r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r).toBe('datatypeEqual');
        expect(ctx.datatypeEqual).toHaveBeenCalled();
    });

    it('textDeriv notAllowed', function() {
        var str = 'name';
        var node = 'node';
        var context = [];

        var ctx = {
            datatypeEqual: function(a, b, c, d, e) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                expect(c).toBe(3);
                expect(d).toBe(str);
                expect(e).toBe(context);
                return new NgNotAllowed;
            }
        };
        var ob =new NgValue(1, 2, 3);

        spyOn(ctx, 'datatypeEqual').andCallThrough();
        var r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r instanceof NgValueError).toBe(true);
        expect(ctx.datatypeEqual).toHaveBeenCalled();
    });
});



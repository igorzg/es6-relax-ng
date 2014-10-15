import {NgData} from '../src/class/ng-data';
import {NgDataError} from '../src/class/ng-data-error';
import {NgNotAllowed} from '../src/class/ng-not-allowed';
describe('NgData', function() {

    it('Construct', function() {
        var ob = new NgData(1, 2);
        expect(ob instanceof NgData).toBe(true);
        expect(ob.datatype).toBe(1);
        expect(ob.paramList).toBe(2);
    });

    it('textDeriv', function() {
        var str = 'name';
        var node = 'node';
        var context = [];
        var ctx = {
            datatypeAllows: function(a, b, c, d) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                expect(c).toBe(str);
                expect(d).toBe(context);
                return 'datatypeAllows';
            }
        };
        var ob = new NgData(1, 2);

        spyOn(ctx, 'datatypeAllows').andCallThrough();
        var r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r).toBe('datatypeAllows');
        expect(ctx.datatypeAllows).toHaveBeenCalled();
    });

    it('textDeriv notAllowed', function() {
        var str = 'name';
        var node = 'node';
        var context = [];

        var ctx = {
            datatypeAllows: function(a, b, c, d) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                expect(c).toBe(str);
                expect(d).toBe(context);
                return new NgNotAllowed;
            }
        };
        var ob = new NgData(1, 2);

        spyOn(ctx, 'datatypeAllows').andCallThrough();
        var r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r instanceof NgDataError).toBe(true);
        expect(ctx.datatypeAllows).toHaveBeenCalled();
    });
});



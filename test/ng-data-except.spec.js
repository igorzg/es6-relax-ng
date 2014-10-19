import {NgDataExcept} from '../src/class/ng-data-except';
import {NgDataExceptError} from '../src/class/ng-data-except-error';
import {NgNotAllowed} from '../src/class/ng-not-allowed';
import {NgEmpty} from '../src/class/ng-empty';
describe('NgDataExcept', function() {

    it('Construct', function() {
        var ob = new NgDataExcept(1, 2, 3);
        expect(ob instanceof NgDataExcept).toBe(true);
        expect(ob.datatype).toBe(1);
        expect(ob.paramList).toBe(2);
        expect(ob.pattern).toBe(3);
        expect(ob.className).toBe('NgDataExcept');
    });

    it('textDeriv NgEmpty', function() {
        var str = 'name';
        var node = 'node';
        var context = [];
        var ctx = {
            datatypeAllows: function(a, b, c, d) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                expect(c).toBe(str);
                expect(d).toBe(context);
                return new NgEmpty;
            },
            textDeriv: function(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(3);
                expect(c).toBe(str);
                expect(d).toBe(node);
                return 'textDeriv';
            },
            nullable: function(a) {
                expect(a).toBe('textDeriv');
                return false;
            }
        };
        var ob = new NgDataExcept(1, 2, 3);
        spyOn(ctx, 'datatypeAllows').andCallThrough();
        spyOn(ctx, 'textDeriv').andCallThrough();
        spyOn(ctx, 'nullable').andCallThrough();
        var r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r instanceof NgEmpty).toBe(true);
        expect(ctx.datatypeAllows).toHaveBeenCalled();
        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(ctx.nullable).toHaveBeenCalled();
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
                return new NgNotAllowed('message');
            },
            textDeriv: function(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(3);
                expect(c).toBe(str);
                expect(d).toBe(node);
                return 'textDeriv';
            },
            nullable: function(a) {
                expect(a).toBe('textDeriv');
                return false;
            }
        };
        var ob = new NgDataExcept(1, 2, 3);
        spyOn(ctx, 'datatypeAllows').andCallThrough();
        spyOn(ctx, 'textDeriv').andCallThrough();
        spyOn(ctx, 'nullable').andCallThrough();
        var r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r instanceof NgDataExceptError).toBe(true);
        expect(r.message).toBe('message');
        expect(ctx.datatypeAllows).toHaveBeenCalled();
        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(ctx.nullable).toHaveBeenCalled();
    });


    it('textDeriv notAllowed', function() {
        var str = 'name';
        var node = {type: 'node'};
        var context = [];
        var ctx = {
            datatypeAllows: function(a, b, c, d) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                expect(c).toBe(str);
                expect(d).toBe(context);
                return 1;
            },
            textDeriv: function(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(3);
                expect(c).toBe(str);
                expect(d).toBe(node);
                return 'textDeriv';
            },
            nullable: function(a) {
                expect(a).toBe('textDeriv');
                return false;
            }
        };
        var ob = new NgDataExcept(1, 2, 3);
        spyOn(ctx, 'datatypeAllows').andCallThrough();
        spyOn(ctx, 'textDeriv').andCallThrough();
        spyOn(ctx, 'nullable').andCallThrough();
        var r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r instanceof NgDataExceptError).toBe(true);
        expect(r.message).toBe('data invalid, attribute value "name" found on node "node"');
        expect(ctx.datatypeAllows).toHaveBeenCalled();
        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(ctx.nullable).toHaveBeenCalled();
    });
});



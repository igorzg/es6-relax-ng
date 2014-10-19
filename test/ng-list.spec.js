import {NgList} from '../src/class/ng-list';
import {NgListError} from '../src/class/ng-list-error';
import {NgEmpty} from '../src/class/ng-empty';
describe('NgList', function() {


    it('Construct', function() {
        var ob = new NgList(1);
        expect(ob instanceof NgList).toBe(true);
        expect(ob.pattern).toBe(1);
        expect(ob.className).toBe('NgList');
    });

    it('textDeriv', function() {
        var str = 'name a';
        var node = {node: 'node', toXML() { return 'node'}};
        var context = [];
        var nullable = true;
        var ctx = {
            listDeriv: function(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(1);
                expect(c[0]).toBe( 'a');
                expect(c[1]).toBe( 'name');
                expect(d).toBe(node);
                return 'listDeriv';
            },
            nullable: function() {
                return nullable;
            }
        };
        var ob = new NgList(1);

        spyOn(ctx, 'listDeriv').andCallThrough();
        spyOn(ctx, 'nullable').andCallThrough();
        var r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r instanceof NgEmpty).toBe(true);
        expect(ctx.listDeriv).toHaveBeenCalled();
        expect(ctx.nullable).toHaveBeenCalled();
        nullable = false;
        r = ob.textDeriv.call(ctx, context, ob, str, node);
        expect(r instanceof NgListError).toBe(true);
    });

});



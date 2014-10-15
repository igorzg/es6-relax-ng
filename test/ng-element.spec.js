import {NgElement} from '../src/class/ng-element';
import {NgEmpty} from '../src/class/ng-empty';
import {NgElementError} from '../src/class/ng-element-error';
describe('NgElement', function() {

    it('Construct', function() {
        var ob = new NgElement(1, 2);
        expect(ob instanceof NgElement).toBe(true);
        expect(ob.nameClass).toBe(1);
        expect(ob.pattern).toBe(2);
    });

    it('startTagOpenDeriv', function() {
        var node = 'node';
        var qName = {};
        var ctx = {
            contains: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(qName);
                return 'contains';
            },
            after: function(a, b) {
                expect(a).toBe(2);
                expect(b instanceof NgEmpty).toBe(true);
                return 'after';
            }
        };
        var ob = new NgElement(1, 2);

        spyOn(ctx, 'after').andCallThrough();
        spyOn(ctx, 'contains').andCallThrough();
        var r = ob.startTagOpenDeriv.call(ctx, ob, qName, node);
        expect(r).toBe('after');
        expect(ctx.after).toHaveBeenCalled();
        expect(ctx.contains).toHaveBeenCalled();
    });

    it('startTagOpenDeriv error', function() {
        var node = 'node';
        var qName = {
            localName: 1,
            uri:2
        };
        var ctx = {
            contains: function(a, b) {
                expect(a).toBe(qName);
                expect(b).toBe(qName);
                return false;
            }
        };
        var ob = new NgElement(qName, 2);

        spyOn(ctx, 'contains').andCallThrough();
        var r = ob.startTagOpenDeriv.call(ctx, ob, qName, node);
        expect(r instanceof NgElementError).toBe(true);
        expect(ctx.contains).toHaveBeenCalled();
        expect(r.qName).toBe(qName);
        expect(r.type).toBe('NgElementError');
        var message = `invalid tag name: '1' or uri: '2',
        expected tag name is: '1' and uri: '2'`;
        expect(r.message).toBe(message);
    });
});



import {NgOneOrMore} from '../src/class/ng-one-or-more';
import {NgEmpty} from '../src/class/ng-empty';
import {ApplyFlip} from '../src/class/apply-flip';
describe('NgOneOrMore', function() {

    it('Construct', function() {
      var ob = new NgOneOrMore(1);
      expect(ob instanceof NgOneOrMore).toBe(true);
      expect(ob.pattern).toBe(1);
    });


    it('attDeriv', function() {
        var ob = new NgOneOrMore(1);
        var node = 'node';
        var context = [];
        var ctx = {
            attDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(1);
                expect(c).toBe(node);
                return 'attDeriv';
            },
            choice(a, b) {
                expect(a).toBe(ob);
                expect(b instanceof NgEmpty).toBe(true);
                return 'choice';
            },
            group(a, b) {
                expect(a).toBe('attDeriv');
                expect(b).toBe('choice');
                return 'group';
            }
        };

        spyOn(ctx, 'attDeriv').andCallThrough();
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'group').andCallThrough();

        expect(ob.attDeriv.call(ctx, context, ob, node)).toBe('group');
        expect(ctx.attDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.group).toHaveBeenCalled();
    });


    it('textDeriv', function() {
        var ob = new NgOneOrMore(1);
        var node = 'node';
        var context = [];
        var ctx = {
            textDeriv(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(1);
                expect(c).toBe(node);
                return 'textDeriv';
            },
            choice(a, b) {
                expect(a).toBe(ob);
                expect(b instanceof NgEmpty).toBe(true);
                return 'choice';
            },
            group(a, b) {
                expect(a).toBe('textDeriv');
                expect(b).toBe('choice');
                return 'group';
            }
        };

        spyOn(ctx, 'textDeriv').andCallThrough();
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'group').andCallThrough();

        expect(ob.textDeriv.call(ctx, context, ob, node)).toBe('group');
        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.group).toHaveBeenCalled();
    });


    it('startTagOpenDeriv', function() {
        var ob = new NgOneOrMore(1);
        var qName = {};
        var node = 'node';

        var ctx = {
            startTagOpenDeriv: function(a, b, c) {
                expect(a).toBe(1);
                expect(b).toBe(qName);
                expect(c).toBe(node);
                return a;
            },
            choice: function(a, b) {
                expect(a).toBe(ob);
                expect(b instanceof NgEmpty).toBe(true);
                return 'choice';
            },
            applyAfter: function(a, b) {
                expect(a instanceof ApplyFlip).toBe(true);
                expect(b).toBe(1);
                return 'applyAfter';
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'applyAfter').andCallThrough();
        spyOn(ctx, 'startTagOpenDeriv').andCallThrough();
        var r = ob.startTagOpenDeriv.call(ctx, ob, qName, node);
        expect(r).toBe('applyAfter');
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.applyAfter).toHaveBeenCalled();
        expect(ctx.startTagOpenDeriv).toHaveBeenCalled();
    });

    it('startTagCloseDeriv', function() {
        var ob = new NgOneOrMore(1);
        var node = 'node';
        var ctx = {
            startTagCloseDeriv(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(node);
                return 'startTagCloseDeriv';
            },
            oneOrMore(a) {
                return a;
            }
        };

        spyOn(ctx, 'oneOrMore').andCallThrough();
        spyOn(ctx, 'startTagCloseDeriv').andCallThrough();

        expect(ob.startTagCloseDeriv.call(ctx, ob, node)).toBe('startTagCloseDeriv');
        expect(ctx.startTagCloseDeriv).toHaveBeenCalled();
        expect(ctx.oneOrMore).toHaveBeenCalled();
    });

});



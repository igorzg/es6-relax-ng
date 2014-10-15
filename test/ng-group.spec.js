import {NgGroup} from '../src/class/ng-group';
import {ApplyFlip} from '../src/class/apply-flip';
describe('NgGroup', function() {
    var o;
    beforeEach(function() {
      o = new NgGroup(1, 2);
    });

    it('Construct', function() {
      expect(o instanceof NgGroup).toBe(true);
      expect(o.pattern1).toBe(1);
      expect(o.pattern2).toBe(2);
    });

    it('attDeriv', function() {
        var context = [], results = [1, 2];
        var node = 'node';
        var call = 0;
        var ctx = {
            attDeriv: function(a, b, c) {
                expect(a).toBe(context);
                expect(results.indexOf(b) > -1).toBe(true);
                expect(c).toBe(node);
                return b;
            },
            choice: function(a, b) {
                expect(results.indexOf(a) > -1).toBe(true);
                expect(results.indexOf(b) > -1).toBe(true);
                expect(a === b).toBe(false);
                return 'choice';
            },
            group: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                ++call;
                if (call > 1) {
                    return b;
                }
                return a;
            }
        };
        spyOn(ctx, 'group').andCallThrough();
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'attDeriv').andCallThrough();
        var r = o.attDeriv.call(ctx, context, o, node);
        expect(r).toBe('choice');
        expect(ctx.attDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.group).toHaveBeenCalled();
    });

    it('startTagOpenDeriv', function() {
        var results = [1, 2];
        var qName = {};
        var node = 'node';
        var nullable = true;
        var ctx = {
            startTagOpenDeriv: function(a, b, c) {
                expect(results.indexOf(a) > -1).toBe(true);
                expect(b).toBe(qName);
                expect(c).toBe(node);
                return a;
            },
            choice: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                return 'choice';
            },
            nullable: function() {
                return nullable;
            },
            applyAfter: function(a, b) {
                expect(a instanceof ApplyFlip).toBe(true);

                return 1;
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'nullable').andCallThrough();
        spyOn(ctx, 'applyAfter').andCallThrough();
        spyOn(ctx, 'startTagOpenDeriv').andCallThrough();
        var r = o.startTagOpenDeriv.call(ctx, o, qName, node);
        expect(r).toBe('choice');
        expect(ctx.startTagOpenDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.applyAfter).toHaveBeenCalled();
        expect(ctx.startTagOpenDeriv).toHaveBeenCalled();
        nullable = false;
        r = o.startTagOpenDeriv.call(ctx, o, qName, node);
        expect(r).toBe(1);
    });


    it('startTagCloseDeriv', function() {
        var results = [1, 2];
        var node = 'node';
        var ctx = {
            startTagCloseDeriv: function(a, b) {
                expect(results.indexOf(a) > -1).toBe(true);
                expect(b).toBe(node);
                return a;
            },
            group: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                return 'group';
            }
        };
        spyOn(ctx, 'group').andCallThrough();
        spyOn(ctx, 'startTagCloseDeriv').andCallThrough();
        var r = o.startTagCloseDeriv.call(ctx, o, node);
        expect(r).toBe('group');
        expect(ctx.startTagCloseDeriv).toHaveBeenCalled();
        expect(ctx.group).toHaveBeenCalled();
    });


    it('textDeriv', function() {
        var context = [];
        var results = [1, 2];
        var node = 'node';
        var nullable = true;
        var ctx = {
            textDeriv: function(a, b, c, d) {
                expect(a).toBe(context);
                expect(results.indexOf(b) > -1).toBe(true);
                expect(c).toBe(node);
                expect(d).toBe(node);
                return b;
            },
            choice: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(1);
                return 'choice';
            },
            nullable: function() {
                return nullable;
            },
            group: function(a, b) {
                return 1;
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'textDeriv').andCallThrough();
        spyOn(ctx, 'nullable').andCallThrough();
        spyOn(ctx, 'group').andCallThrough();

        var r = o.textDeriv.call(ctx, context, o, node, node);
        expect(r).toBe('choice');
        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.nullable).toHaveBeenCalled();
        expect(ctx.group).toHaveBeenCalled();
    });
});



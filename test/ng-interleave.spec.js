import {NgInterLeave} from '../src/class/ng-interleave';
import {ApplyFlip} from '../src/class/apply-flip';
describe('NgGroup', function() {
    var o;
    beforeEach(function() {
      o = new NgInterLeave(1, 2);
    });

    it('Construct', function() {
      expect(o instanceof NgInterLeave).toBe(true);
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
                return 'interleave';
            },
            interleave: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                ++call;
                if (call > 1) {
                    return b;
                }
                return a;
            }
        };
        spyOn(ctx, 'interleave').andCallThrough();
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'attDeriv').andCallThrough();
        var r = o.attDeriv.call(ctx, context, o, node);
        expect(r).toBe('interleave');
        expect(ctx.attDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.interleave).toHaveBeenCalled();
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
            interleave: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                return 'interleave';
            }
        };
        spyOn(ctx, 'interleave').andCallThrough();
        spyOn(ctx, 'startTagCloseDeriv').andCallThrough();
        var r = o.startTagCloseDeriv.call(ctx, o, node);
        expect(r).toBe('interleave');
        expect(ctx.startTagCloseDeriv).toHaveBeenCalled();
        expect(ctx.interleave).toHaveBeenCalled();
    });


    it('textDeriv', function() {
        var context = [], results = [1, 2];
        var node = 'node';
        var call = 0;
        var ctx = {
            textDeriv: function(a, b, c) {
                expect(a).toBe(context);
                expect(results.indexOf(b) > -1).toBe(true);
                expect(c).toBe(node);
                return b;
            },
            choice: function(a, b) {
                expect(results.indexOf(a) > -1).toBe(true);
                expect(results.indexOf(b) > -1).toBe(true);
                expect(a === b).toBe(false);
                return 'interleave';
            },
            interleave: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                ++call;
                if (call > 1) {
                    return b;
                }
                return a;
            }
        };
        spyOn(ctx, 'interleave').andCallThrough();
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'textDeriv').andCallThrough();
        var r = o.textDeriv.call(ctx, context, o, node);
        expect(r).toBe('interleave');
        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.interleave).toHaveBeenCalled();
    });


    it('startTagOpenDeriv', function() {
        var results = [1, 2];
        var qName = {};
        var node = 'node';

        var ctx = {
            startTagOpenDeriv: function(a, b, c) {
                expect(results.indexOf(a) > -1).toBe(true);
                expect(b).toBe(qName);
                expect(c).toBe(node);
                return a;
            },
            choice: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(1);
                return 'choice';
            },
            applyAfter: function(a, b) {
                expect(a instanceof ApplyFlip).toBe(true);
                expect(a.func).toBe('interleave');
                return 1;
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'applyAfter').andCallThrough();
        spyOn(ctx, 'startTagOpenDeriv').andCallThrough();
        var r = o.startTagOpenDeriv.call(ctx, o, qName, node);
        expect(r).toBe('choice');
        expect(ctx.startTagOpenDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
        expect(ctx.applyAfter).toHaveBeenCalled();
    });

});



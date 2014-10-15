import {NgAfter} from '../src/class/ng-after';
import {ApplyFlip} from '../src/class/apply-flip';
import {NgAfterError} from '../src/class/ng-after-error';
describe('NgAfter', function() {
    var o;
    beforeEach(function() {
      o = new NgAfter(1, 2);
    });

    it('Construct', function() {
      expect(o instanceof NgAfter).toBe(true);
      expect(o.pattern1).toBe(1);
      expect(o.pattern2).toBe(2);
    });

    it('attDeriv', function() {
        var context = [];
        var node = 'node';
        var ctx = {
            attDeriv: function(a, b, c) {
                expect(a).toBe(context);
                expect(b).toBe(1);
                expect(c).toBe(node);
                return 'attDeriv';
            },
            after: function(a, b) {
                expect(a).toBe('attDeriv');
                expect(b).toBe(2);
                return 'after';
            }
        };
        spyOn(ctx, 'attDeriv');
        spyOn(ctx, 'after');
        o.attDeriv.call(ctx, context, o, node);
        expect(ctx.attDeriv).toHaveBeenCalled();
        expect(ctx.after).toHaveBeenCalled();
    });


    it('startTagOpenDeriv', function() {
        var node = 'node';
        var ctx = {
            startTagOpenDeriv: function(a, b, c) {
                expect(a).toBe(1);
                expect(b).toBe('node');
                expect(c).toBe('node');
                return 'startTagOpenDeriv';
            },
            applyAfter: function(a, b) {
                expect(a instanceof ApplyFlip).toBe(true);
                expect(a.func).toBe('after');
                expect(b).toBe('startTagOpenDeriv');
                return 'applyAfter';
            }
        };

        spyOn(ctx, 'startTagOpenDeriv');
        spyOn(ctx, 'applyAfter');

        o.startTagOpenDeriv.call(ctx, o, node, node);
        expect(ctx.startTagOpenDeriv).toHaveBeenCalled();
        expect(ctx.applyAfter).toHaveBeenCalled();
    });

    it('applyAfter', function() {
        var node = 'node';
        var ctx = {
            after: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                return 'after';
            }
        };
        spyOn(ctx, 'after');
        o.applyAfter.call(ctx, {invoke: item => item}, o);
        expect(ctx.after).toHaveBeenCalled();
    });

    it('textDeriv', function() {
        var context = [];
        var node = 'node';

        var ctx = {
            after: function(a, b) {
                expect(a).toBe('textDeriv');
                expect(b).toBe(2);
                return 'after';
            },
            textDeriv: function(a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe(1);
                expect(c).toBe(node);
                expect(d).toBe(node);
                return 'textDeriv';
            }
        };
        spyOn(ctx, 'after');
        spyOn(ctx, 'textDeriv');
        o.textDeriv.call(ctx, context, o, node, node);
        expect(ctx.after).toHaveBeenCalled();
        expect(ctx.textDeriv).toHaveBeenCalled();
    });

    it('endTagDeriv', function() {

        var node = 'node';

        var ctx = {
            nullable: function(a) {
                expect(a).toBe(1);
                return true;
            }
        };
        var ctx2 = {
            nullable: function(a) {
                expect(a).toBe(1);
                return false;
            }
        };
        spyOn(ctx, 'nullable');
        spyOn(ctx2, 'nullable');
        o.endTagDeriv.call(ctx, o, node);
        var r = o.endTagDeriv.call(ctx2, o, node);
        expect(ctx.nullable).toHaveBeenCalled();
        expect(ctx2.nullable).toHaveBeenCalled();
        expect(r instanceof NgAfterError).toBe(true);
    });

    it('startTagCloseDeriv', function() {

        var node = 'node';

        var ctx = {
            after: function(a, b) {
                expect(a).toBe('startTagCloseDeriv');
                expect(b).toBe(2);
                return 'after';
            },
            startTagCloseDeriv: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(node);
                return 'startTagCloseDeriv';
            }
        };
        spyOn(ctx, 'after');
        spyOn(ctx, 'startTagCloseDeriv');
        o.startTagCloseDeriv.call(ctx, o, node);
        expect(ctx.after).toHaveBeenCalled();
        expect(ctx.startTagCloseDeriv).toHaveBeenCalled();
    });
});



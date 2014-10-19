import {NgChoice} from '../src/class/ng-choice';
describe('NgChoice', function() {
    var o;
    beforeEach(function() {
      o = new NgChoice(1, 2);
    });

    it('Construct', function() {
      expect(o instanceof NgChoice).toBe(true);
      expect(o.pattern1).toBe(1);
      expect(o.pattern2).toBe(2);
      expect(o.className).toBe('NgChoice');
    });

    it('attDeriv', function() {
        var context = [], results = [1, 2];
        var node = 'node';
        var ctx = {
            attDeriv: function(a, b, c) {
                expect(a).toBe(context);
                expect(results.indexOf(b) > -1).toBe(true);
                expect(c).toBe(node);
                return b;
            },
            choice: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                return 'choice';
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'attDeriv').andCallThrough();
        var r = o.attDeriv.call(ctx, context, o, node);
        expect(r).toBe('choice');
        expect(ctx.attDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
    });


    it('endTagDeriv', function() {
        var results = [1, 2];
        var node = 'node';
        var ctx = {
            endTagDeriv: function(a, b) {
                expect(results.indexOf(a) > -1).toBe(true);
                expect(b).toBe(node);
                return a;
            },
            choice: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                return 'choice';
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'endTagDeriv').andCallThrough();
        var r = o.endTagDeriv.call(ctx, o, node);
        expect(r).toBe('choice');
        expect(ctx.endTagDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
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
            choice: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                return 'choice';
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'startTagCloseDeriv').andCallThrough();
        var r = o.startTagCloseDeriv.call(ctx, o, node);
        expect(r).toBe('choice');
        expect(ctx.startTagCloseDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
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
                expect(b).toBe(2);
                return 'choice';
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'startTagOpenDeriv').andCallThrough();
        var r = o.startTagOpenDeriv.call(ctx, o, qName, node);
        expect(r).toBe('choice');
        expect(ctx.startTagOpenDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
    });


    it('textDeriv', function() {
        var context = [];
        var results = [1, 2];
        var node = 'node';
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
                expect(b).toBe(2);
                return 'choice';
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'textDeriv').andCallThrough();
        var r = o.textDeriv.call(ctx, context, o, node, node);
        expect(r).toBe('choice');
        expect(ctx.textDeriv).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
    });



    it('applyAfter', function() {
        var results = [1, 2];
        var noop = function() {};
        var ctx = {
            applyAfter: function(a, b) {
                expect(a).toBe(noop);
                expect(results.indexOf(b) > -1).toBe(true);
                return b;
            },
            choice: function(a, b) {
                expect(a).toBe(1);
                expect(b).toBe(2);
                return 'choice';
            }
        };
        spyOn(ctx, 'choice').andCallThrough();
        spyOn(ctx, 'applyAfter').andCallThrough();
        var r = o.applyAfter.call(ctx, noop, o);
        expect(r).toBe('choice');
        expect(ctx.applyAfter).toHaveBeenCalled();
        expect(ctx.choice).toHaveBeenCalled();
    });

});



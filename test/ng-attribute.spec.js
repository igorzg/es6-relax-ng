import {NgAttribute} from '../src/class/ng-attribute';
import {NgAttributeError} from '../src/class/ng-attribute-error';
describe('NgAttribute', function() {
    var obj;
    beforeEach(function() {
        obj = new NgAttribute('name', 'pattern');
    });
    it('Construct', function() {
      expect(obj instanceof NgAttribute).toBe(true);
      expect(obj.nameClass).toBe('name');
      expect(obj.pattern).toBe('pattern');
    });

    it('attDeriv', function() {
        var context = [];
        var attrNode = {
            qName: {
                localName: 'item',
                uri: ""
            },
            string: 'STR',
            node: {
                type: 1
            }
        };
        var ctx = {
            contains: function(a, b) {
                expect(a).toBe('name');
                expect(b).toBe(attrNode.qName);
                return 'value';
            },
            valueMatch: function (a, b, c, d) {
                expect(a).toBe(context);
                expect(b).toBe('pattern');
                expect(c).toBe(attrNode.string);
                expect(d).toBe(attrNode);
                return 'valueMatch';
            }
        };

        spyOn(ctx, 'contains').andCallThrough();
        spyOn(ctx, 'valueMatch').andCallThrough();
        var r = obj.attDeriv.call(ctx, context, obj, attrNode);
        expect(ctx.contains).toHaveBeenCalledWith(obj.nameClass, attrNode.qName);
        expect(ctx.contains).toHaveBeenCalled();
        expect(ctx.valueMatch).toHaveBeenCalled();
        expect(r).toBe('valueMatch');


        r = obj.attDeriv.call({contains(){return false;}}, context, obj, attrNode);
        expect(r instanceof NgAttributeError).toBe(true);
    });
});



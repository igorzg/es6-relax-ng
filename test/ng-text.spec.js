import {NgText} from '../src/class/ng-text';
describe('NgText', function() {

    it('Construct', function() {
        var ob = new NgText();
        expect(ob instanceof NgText).toBe(true);
        expect(ob.className).toBe('NgText');
    });

    it('textDeriv', function() {
        var ob = new NgText();
        expect(ob.textDeriv({}, ob)).toBe(ob);
    });

});



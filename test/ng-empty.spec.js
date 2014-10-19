import {NgEmpty} from '../src/class/ng-empty';

describe('NgEmpty', function () {

    it('Construct', function () {
        var ob = new NgEmpty();
        expect(ob instanceof NgEmpty).toBe(true);
        expect(ob.className).toBe('NgEmpty');
    });


});



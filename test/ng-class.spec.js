import {NgClass} from '../src/class/ng-class';

describe('NgClass', function () {

    it('Construct', function () {
        var ob = new NgClass(NgClass);
        expect(ob instanceof NgClass).toBe(true);
    });

    it('Construct fail', function () {
        var message;
        try {
            new NgClass();
        } catch (e) {
            message = e.message;
        }
        expect(message).toBe('Expecting a function in instanceof check, but got undefined');

        function A(){}
        try {
            new NgClass(A);
        } catch (e) {
            message = e.message;
        }

        expect(message).toBe('Class function A() {} is not instantiated');
    });
});



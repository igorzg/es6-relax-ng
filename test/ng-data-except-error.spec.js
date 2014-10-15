import {NgDataExceptError} from '../src/class/ng-data-except-error';
import {NgDataType} from '../src/class/ng-data-type';
describe('NgDataError', function () {

    it('Construct', function () {
        var pattern = {};
        var node = 'node';
        var dtType = new NgDataType(1, 2);
        var ngNotAllowed = {
            node: dtType,
            pattern: pattern,
            message: 'Helloworld'
        };
        var o = new NgDataExceptError(node, pattern, ngNotAllowed, true);
        expect(o instanceof NgDataExceptError).toBe(true);
        expect(o.message).toBe('Helloworld');
        expect(o.pattern).toBe(pattern);
        expect(o.node).toBe(node);
        expect(o.type).toBe('NgDataExceptError');
        expect(o.dataType).toBe(dtType);
        expect(o.dataTypePattern).toBe(pattern);
        expect(o.expected).toBe(true);

        o = new NgDataExceptError(node, pattern, ngNotAllowed);
        expect(o instanceof NgDataExceptError).toBe(true);
        expect(o.message).toBe('Helloworld');
        expect(o.pattern).toBe(pattern);
        expect(o.node).toBe(node);
        expect(o.type).toBe('NgDataExceptError');
        expect(o.dataType).toBe(dtType);
        expect(o.dataTypePattern).toBe(pattern);
        expect(o.expected).toBe(false);
    });
});



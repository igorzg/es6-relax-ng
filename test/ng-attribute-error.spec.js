import {NgAttributeError} from '../src/class/ng-attribute-error';

describe('NgAttributeError', function() {
    it('Should create an instance', function() {
        var node = {
            node: {
                type: 'div'
            },
            qName: {
                localName: 'value',
                uri: 'http:://www.igorivanovic.info'
            }
        };
        function NgEmpty(){}
        var ob = new NgAttributeError(node, new NgEmpty);
        var message =  `invalid attribute on node: "div",
        attribute: "value", ns "http:://www.igorivanovic.info",
        is not allowed on this element`;
        expect(ob.pattern  instanceof NgEmpty).toBe(true);
        expect(ob.message).toBe(message);
        expect(ob.errorClassName).toBe('NgAttributeError');
        expect(ob.className).toBe('NgNotAllowed');
    });
});



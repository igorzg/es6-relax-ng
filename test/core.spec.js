import {copy} from '../src/core';
import {NgEmpty} from '../src/class/ng-empty';
import {NgText} from '../src/class/ng-text';

describe('core', function() {

    it('copy', function() {
        var p1 = {
            a: 1,
            b: 2,
            c: [1, 2, 3],
            d: [
                {
                    a: new NgEmpty
                },
                1,
                {
                    b: new NgText
                }
            ]
        };
        var p2 = copy(p1);

        expect(p1 === p2).toBe(false);
        expect(p1.a === p2.a).toBe(true);
        expect(p1.b === p2.b).toBe(true);
        expect(p1.c === p2.c).toBe(false);
        expect(p1.c[0] === p2.c[0]).toBe(true);
        expect(p1.c[1] === p2.c[1]).toBe(true);
        expect(p1.c[2] === p2.c[2]).toBe(true);
        expect(p1.d === p2.d).toBe(false);
        expect(p1.d[0] === p2.d[0]).toBe(false);
        expect(p1.d[1] === p2.d[1]).toBe(true);
        expect(p1.d[2] === p2.d[2]).toBe(false);

        expect(p1.d[0].a === p2.d[0].a).toBe(false);
        expect(p1.d[0].a instanceof NgEmpty).toBe(true);
        expect(p2.d[0].a instanceof NgEmpty).toBe(true);

        expect(p1.d[2].b === p2.d[2].b).toBe(false);
        expect(p1.d[2].b instanceof NgText).toBe(true);
        expect(p2.d[2].b instanceof NgText).toBe(true);

        var a = [1, 2, 3];
        var b = a;
        var c = copy(b);
        expect(a === b).toBe(true);
        expect(c === b).toBe(false);
        expect(a === c).toBe(false);
        a.forEach(function(item, index) {
            expect(a[index]).toBe(c[index]);
        });

        var date = new Date(2013, 5, 20);
        var date2 = date;
        var date3 = copy(date2);
        expect(date === date2).toBe(true);
        expect(date === date3).toBe(false);
        expect(date3 === date2).toBe(false);

        expect(date.getTime() === date2.getTime()).toBe(true);
        expect(date.getTime() === date3.getTime()).toBe(true);
        expect(date3.getTime() === date2.getTime()).toBe(true);

        expect(copy(5)).toBe(5);
        expect(copy(true)).toBe(true);
        expect(copy(false)).toBe(false);
        expect(copy(null)).toBe(null);
        expect(copy("a")).toBe("a");
        expect(copy(undefined)).toBe(undefined);
    });
});



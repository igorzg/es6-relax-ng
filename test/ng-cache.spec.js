import {NgCache} from '../src/class/ng-cache';

describe('NgCache', function () {
    var ob, ob1 = {a: 1}, ob2 = {a: 2}, ob3;
    beforeEach(function () {
        ob = new NgCache();
        ob3 = new NgCache();
    });
    it('Should create an instance', function () {
        expect(ob instanceof NgCache).toBe(true);
    });
    it('Should create add obj to cache', function () {
        ob.add(ob1);
        expect(ob.indexOf(ob1)).toBe(0);
        ob.add(ob2);
        expect(ob.indexOf(ob2)).toBe(1);
    });

    it('Should create remove obj from cache', function () {
        ob.add(ob1);
        expect(ob.indexOf(ob1)).toBe(0);
        ob.add(ob2);
        expect(ob.indexOf(ob2)).toBe(1);
        expect(ob.size()).toBe(2);
        ob.remove(ob1);
        expect(ob.size()).toBe(1);
        expect(ob.indexOf(ob2)).toBe(0);
        expect(ob.indexOf(ob1)).toBe(-1);
        ob.remove(ob2);
        expect(ob.size()).toBe(0);
        expect(ob.indexOf(ob2)).toBe(-1);
        expect(ob.indexOf(ob1)).toBe(-1);
    });

    it('Check if object is cached and size of cache', function () {
        ob.add(ob1);
        expect(ob.indexOf(ob1)).toBe(0);
        ob.add(ob2);
        expect(ob.indexOf(ob2)).toBe(1);
        expect(ob.size()).toBe(2);
        expect(ob.isCached(ob1)).toBe(true);
        expect(ob.isCached(ob2)).toBe(true);
        expect(ob.isCached({})).toBe(false);
    });

    it('Object must be copy', function () {
        expect(ob === ob3).toBe(false);
        expect(ob.getCache() === ob3.getCache()).toBe(false);
    });
});



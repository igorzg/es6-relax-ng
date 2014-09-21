import {NgClass} from './ng-class';

/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgCache
 *
 * @constructor
 * @description
 *
 * NgCache is used for object caching
 *
 */
export class NgCache extends NgClass {
    constructor() {
        super(NgCache);
        var cache = [];
        /**
         * @since 0.0.1
         * @method NgCache#getCache
         * @description
         * Get cached array
         * @return array of cached data
         */
        this.getCache = function getCache() {
            return cache;
        };
        /**
         * @since 0.0.1
         * @method NgCache#destroy
         * @description
         * Destroy an cache
         */
        this.destroy = function destroy() {
            cache = null;
        };
    }
    /**
     * @since 0.0.1
     * @method NgCache#size
     * @description
     * Get an cache size
     * return number
     */
    size() {
        return this.getCache().length;
    }
    /**
     * @since 0.0.1
     * @method NgCache#get
     * @description
     * Get an object by filter
     * @param {function} filter
     * return object which is filtered
     */
    filter(filter) {
        return this.getCache().filter(filter).pop();
    }
    /**
     * @since 0.0.1
     * @method NgCache#isCached
     * @description
     * Get information if object is cached
     * return boolean
     */
    isCached(obj) {
        return this.indexOf(obj) > -1;
    }
    /**
     * @since 0.0.1
     * @method NgCache#indexOf
     * @description
     * Get index of cached object
     */
    indexOf(obj) {
        return this.getCache().indexOf(obj);
    }
    /**
     * @since 0.0.1
     * @method NgCache#remove
     * @description
     * Remove object from cache
     */
    remove(obj) {
        if (this.isCached(obj)) {
            this.getCache().splice(this.indexOf(obj), 1);
            return true;
        }
        return false;
    }
    /**
     * @since 0.0.1
     * @method NgCache#add
     * @description
     * Add object to cache
     */
    add(obj) {
        if (!this.isCached(obj)) {
            this.getCache().push(obj);
            return true;
        }
        return false;
    }
}
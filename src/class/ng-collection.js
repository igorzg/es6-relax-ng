import {NgValidator} from './ng-validator';
import {NgDOM} from './ng-dom';
import {NgError} from './ng-error';
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgCollection
 *
 * @constructor
 * @description
 * NgCollection
 */
export class NgCollection extends NgValidator{
    constructor(pattern, datatypeLibrary = null, ttl = 20) {
        super(pattern, datatypeLibrary);
        this.instanceOf(NgCollection);
        this.collection = [];
        this.ttl = ttl;
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgCollection#collect
     *
     * @description
     * Return node pattern
     */
    getNodePattern(node) {
        var cache = [];
        return detect(this.patternInstance.getPattern());
        /**
         * Detect pattern
         * @param pattern
         */
        function detect(pattern) {
            var p1, p2;
            switch (pattern.className) {
                case 'NgAfter':
                case 'NgChoice':
                case 'NgGroup':
                case 'NgInterLeave':
                    p1 = detect(pattern.pattern1);
                    if (isElement(p1)) {
                        return p1;
                    }
                    p2 = detect(pattern.pattern2);
                    if (isElement(p2)) {
                        return p2;
                    }
                    break;
                case 'NgOneOrMore':
                    p1 = detect(pattern.pattern);
                    if (isElement(p1)) {
                        return p1;
                    }
                    break;
                case 'NgReference':
                    p1 = pattern.func();
                    if (isElement(p1)) {
                        return p1;
                    } else if (cache.indexOf(pattern) === -1) {
                        cache.push(pattern);
                        return detect(pattern.pattern);
                    }
                    break;
                case 'NgElement':
                    if (isElement(pattern)) {
                        return pattern;
                    } else if (cache.indexOf(pattern) === -1) {
                        cache.push(pattern);
                        return detect(pattern.pattern);
                    }
            }


            return false;
        }
        /**
         * Check if element is valid one
         * @param pattern
         * @returns {boolean}
         */
        function isElement(pattern) {
            if (pattern.className === 'NgElement' && node && node.type) {
                if (pattern.nameClass.localName === node.type) {
                    return true;
                }
            }
            return false;
        }
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgCollection#getAttributeValues
     *
     * @description
     * Return values of attribute
     *
     */
    getAttributeValues(pattern) {
        var context = [];
        if (pattern.pattern1.className === 'NgValue') {
            context.push(pattern.pattern1.string);
        }
        if (pattern.pattern2.className === 'NgValue') {
            context.push(pattern.pattern2.string);
        }
        if (pattern.pattern1.className === 'NgChoice') {
            context = context.concat(this.getAttributeValues(pattern.pattern1));
        }
        if (pattern.pattern2.className === 'NgChoice') {
            context = context.concat(this.getAttributeValues(pattern.pattern2));
        }
        return context;
    };
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgCollection#process
     *
     * @description
     * Process collection
     *
     */
    process(node, oNode) {
        var validation, selector, parent, attributeValues;
        if (node.isDocumentNode()) {
            node = node.firstElementChild();
        }

        validation = this.validate(node, this.getNodePattern(node));

        if (this.collection.indexOf(validation) > -1) {
            this.ttl -= 1;
            if (this.ttl < 0) {
                throw new NgError('To many itterations on collection process', validation);
            }
        }

        if (validation.className === 'NgNotAllowed') {
            this.collection.push(validation);
            switch (validation.errorClassName) {
                case 'NgValidatorStartTagOpenDerivError':
                case 'NgElementError':
                    parent = validation.node.parentNode();
                    selector = getSelector(validation.node);
                    if (selector) {
                        validation.node = oNode.querySelectorAll(selector);
                        parent.querySelectorAll(selector).forEach(cNode => cNode.remove());
                        return this.process(node, oNode);
                    } else {
                        throw new NgError(`No valid selector provided ${selector}`);
                    }
                    break;
                case 'NgDataTypeEqualityError':
                    if (validation.match) {
                        if (validation.node.qName.uri) {
                            validation.node.node.setAttributeNS(validation.node.qName.uri, validation.node.qName.localName, validation.match);
                        } else {
                            validation.node.node.setAttribute(validation.node.qName.localName, validation.match);
                        }
                        return this.process(node, oNode);
                    }
                    break;
                case 'NgAttributeError':
                case 'NgValidatorAttDerivError':
                    if (validation.node.qName.uri) {
                        validation.node.node.removeAttributeNS(validation.node.qName.uri, validation.node.qName.localName);
                    } else {
                        validation.node.node.removeAttribute(validation.node.qName.localName);
                    }
                    return this.process(node, oNode);
                    break;
                case 'NgAttributeMissingValueError':
                    if (validation.pattern.pattern.className === 'NgText') {
                        if (validation.pattern.nameClass.uri) {
                            validation.node.node.setAttributeNS(validation.pattern.nameClass.uri, validation.pattern.nameClass.localName, 'RELAX_MISSING_NG_VALUE');
                        } else {
                            validation.node.node.setAttribute(validation.pattern.nameClass.localName, 'RELAX_MISSING_NG_VALUE');
                        }
                    } else {
                        attributeValues = this.getAttributeValues(validation.pattern.pattern);
                        if (attributeValues.length) {
                            if (validation.pattern.nameClass.uri) {
                                validation.node.node.setAttributeNS(validation.pattern.nameClass.uri, validation.pattern.nameClass.localName, attributeValues.shift());
                            } else {
                                validation.node.node.setAttribute(validation.pattern.nameClass.localName, attributeValues.shift());
                            }
                        } else {
                            throw new NgError('Invalid pattern', validation.pattern);
                        }
                    }
                    return this.process(node, oNode);
                    break;
            }
        }

        /**
         * Calculate selector from node
         * @param cNode
         * @returns {string}
         */
        function getSelector(cNode) {
            var selectors = [];
            while (cNode) {
                if (cNode.isElementNode()) {
                    selectors.push(cNode.type);
                }
                cNode = cNode.parentNode();
            }
            return selectors.reverse().join(' > ');
        }
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgCollection#isValid
     *
     * @description
     * Is xml valid
     */
    isValid() {
        return this.collection.length === 0;
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgCollection#collect
     *
     * @description
     * Collect all schema errors
     */
    collect(node) {
        if (!(node instanceof NgDOM)) {
            throw new NgError('node must be valid NgDOM instance');
        }
        this.process(node.clone(), node);
    }
}
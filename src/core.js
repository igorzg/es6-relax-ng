/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NODES
 * @global
 * @description
 * Global vars
 */
var NODES = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11,
        NOTATION_NODE: 12
    },
    /**
     * to String
     * @type {Function}
     */
    toString = Object.prototype.toString,
    /**
     * Used by next uid
     * @type {string[]}
     */
    uid = 0;

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name nextUid
 * @global
 * @function nextUid
 * @return {string} unique id
 * @description
 * Creates uniqe id
 * @example
 * nextUid(); // random -> "ABC"
 */
export function nextUid() {
    if (uid > Number.POSITIVE_INFINITY) {
        uid = 0;
    }
    return ++uid;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name trim
 * @global
 * @function trim
 * @param {string} value string to be trimed
 * @return {string} trimmed string
 * @description
 * Trims string
 * @example
 * trim(" string "); // "string"
 */
export function trim(value) {
    return isString(value) ? value.trim() : value;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isBoolean
 * @global
 * @function isBoolean
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is boolean
 * @example
 * isBoolean(""); // true
 */
export function isBoolean(value) {
    return typeof value === 'boolean';
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isUndefined
 * @global
 * @function isUndefined
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is undefined
 * @example
 * isUndefined(""); // true
 */
export function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isDefined
 * @global
 * @function isDefined
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is defined
 * @example
 * isDefined("yes"); // true
 */
export function isDefined(value) {
    return typeof value !== 'undefined';
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isObject
 * @global
 * @function isObject
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is object
 * @example
 * isObject({}); // true
 */
export function isObject(value) {
    return value != null && typeof value === 'object';
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isString
 * @global
 * @function isString
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is string
 * @example
 * isString("1"); // true
 */
export function isString(value) {
    return typeof value === 'string';
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isNumber
 * @global
 * @function isNumber
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is number
 * @example
 * isNumber(1); // true
 */
export function isNumber(value) {
    return typeof value === 'number';
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isDate
 * @global
 * @function isDate
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is date
 * @example
 * isDate(new Date); // true
 */
export function isDate(value) {
    return toString.call(value) === '[object Date]';
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isArray
 * @global
 * @function isArray
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is array
 * @example
 * isArray([]); // true
 */
export function isArray(value) {
    return Array.isArray(value);
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isFunction
 * @global
 * @function isFunction
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is function
 * @example
 * isFunction(function(){}); // true
 */
export function isFunction(value) {
    return typeof value === 'function';
}


/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isRegExp
 * @global
 * @function isRegExp
 * @param {object} value object to be checked
 * @return {boolean}
 * @description
 * Check if value is regex
 * @example
 * isRegExp(/abc/g); // true
 */
export function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
}


/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isWindow
 * @global
 * @function isWindow
 * @param {object} obj object to be checked
 * @return {boolean}
 * @description
 * Check if value is window object
 * @example
 * isWindow(window); // true
 */
export function isWindow(obj) {
    if (obj && isObject(obj) && obj.document && obj.location && obj.alert && obj.setInterval) {
        return true;
    }
    return false;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name camelCase
 * @global
 * @function camelCase
 * @param {string} value to be camel cased
 * @return {string} camelcased value
 * @example
 * camelCase("camel-case"); // camel-Case
 */
export function camelCase(value) {
    return value.
        replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        }).
        replace(/^moz([A-Z])/, 'Moz$1');
}


/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isWindow
 * @global
 * @function isWindow
 * @param {object} element Node to apply rule
 * @param {object} name name of style
 * @param {object} value value of style
 * @return {boolean}
 * @description
 * Check if value is window object
 * @example
 * css(node, "overflow", "hidden"); // true
 */
export function css(element, name, value) {
    name = camelCase(name);
    if (isDefined(value)) {
        try {
            element.style[name] = value;
            return true;
        } catch (e) {
            new NgError(handleError('style {1} is not valid style property', [name]));
        }
    }
    return false;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isPlainObject
 * @global
 * @function isPlainObject
 * @param {object} obj object to be checked
 * @return {boolean}
 * @description
 * Check if obj is plain object
 * @example
 * isPlainObject({a:1}); // true
 */
export function isPlainObject(obj) {
    /**
     * Is object
     */
    if (!isObject(obj) || obj.nodeType || isWindow(obj)) {
        return false;
    }
    /**
     * Constructor
     */
    if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
    }

    return true;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name extend
 * @global
 * @function extend
 * @param {object} extend object
 * @return {object}
 * @description
 * Extend object from a to b
 * @example
 * extend({a:1}, {a:2, b:1}); // -> {a:1, b:1}
 */
export function extend(obj) {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    // Handle a deep copy situation
    if (isBoolean(target)) {
        deep = target;
        target = arguments[i] || {};
        i += 1;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (!isObject(target) && !isFunction(target)) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i -= 1;
    }

    for (; i < length; i += 1) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];
                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (
                    deep &&
                    copy &&
                    (
                        isPlainObject(copy) ||
                        (copyIsArray = isArray(copy))
                        )
                    ) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[name] = extend(deep, clone, copy);
                } else if (isDefined(copy)) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name copy
 * @global
 * @function copy
 * @param {object} source object
 * @param {object} destination object
 * @return {object} destination object
 * @description
 * Extend object from a to b
 * @example
 * copy({a:1}); // -> {a:1}
 */
export function copy(source, destination) {
    if (isWindow(source)) {
        throw new NgError("Can't copy! Making copies of Window  instances is not supported.");
    }
    if (!destination) {
        destination = source;
        if (source) {
            if (isArray(source)) {
                destination = copy(source, []);
            } else if (isDate(source)) {
                destination = new Date(source.getTime());
            } else if (isRegExp(source)) {
                destination = new RegExp(source.source);
            } else if (isObject(source)) {
                destination = copy(source, {});
            }
        }
    } else {
        if (source === destination) {
            throw new NgError("Can't copy! Source and destination are identical.");
        }
        if (isArray(source)) {
            destination.length = 0;
            for (var i = 0; i < source.length; i++) {
                destination.push(copy(source[i]));
            }
        } else {
            forEach(destination, function (value, key) {
                delete destination[key];
            });
            for (var key in source) {
                destination[key] = copy(source[key]);
            }
        }
    }
    return destination;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isArrayLike
 * @global
 * @function isArrayLike
 * @param {object} obj object
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments, String ...)
 * @description
 * Check if object is arraylike type
 * @example
 * isArrayLike({a:1, b:2}); // true;
 */
export function isArrayLike(obj) {
    if (obj == null || isWindow(obj)) {
        return false;
    }

    var length = obj.length;

    if (obj.nodeType === 1 && length) {
        return true;
    }

    return isString(obj) || isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name forEach
 * @global
 * @function forEach
 * @param {object} obj object
 * @param {function} iterator callback to execute on each iteration
 * @param {object} context callback context will be overridden with provided context
 * @return {object}
 * @description
 * Loop over array or object and apply callback
 * @example
 * forEach({a:1, b:2}, function(value, key){
 *      console.log(value, key); // 1 , a
 * });;
 */
export function forEach(obj, iterator, context) {
    var key;
    if (obj) {
        if (isFunction(obj)) {
            for (key in obj) {
                if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                    iterator.call(context, obj[key], key);
                }
            }
        } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context);
        } else if (isArrayLike(obj)) {
            for (key = 0; key < obj.length; key++) {
                iterator.call(context, obj[key], key);
            }
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        }
    }
    return obj;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name instanceOf
 * @global
 * @function instanceOf
 * @param {object} type object to check
 * @param {object} Class constructor
 * @return {boolean}
 * @description
 * Check if object is valid constructor
 * @example
 * var object = new NgAttribute();
 * instanceOf(object, NgAttribute); // true
 */
export function instanceOf(type, Class) {

    if (isFunction(Class)) {
        return type instanceof Class;
    }
    return false;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isNode
 * @global
 * @function isNode
 * @param {object} node instance of Node
 * @param {integer} type node type
 * @return {boolean}
 * @description
 * Check if object is valid node
 * @example
 * isNode(node, NODES.TEXT_NODE);
 */
export function isNode(node, type) {
    if (node && node.nodeType) {
        if (type) {
            return node.nodeType === type;
        }
        return true;
    }
    return false;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isTextNode
 * @global
 * @function isTextNode
 * @param {object} node instance of Node
 * @return {boolean}
 * @description
 * Check if object is valid text node node
 * @example
 * isTextNode(node); // true
 */
export function isTextNode(node) {
    return isNode(node, NODES.TEXT_NODE);
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isDocumentNode
 * @global
 * @function isDocumentNode
 * @param {object} node instance of Node
 * @return {boolean}
 * @description
 * Check if object is valid document node node
 * @example
 * isTextNode(document); // true
 */
export function isDocumentNode(node) {
    return isNode(node, NODES.DOCUMENT_NODE);
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isElementNode
 * @global
 * @function isElementNode
 * @param {object} node instance of Node
 * @return {boolean}
 * @description
 * Check if object is valid element node node
 * @example
 * isElementNode(node); // true
 */
export function isElementNode(node) {
    return isNode(node, NODES.ELEMENT_NODE);
}


/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name textContent
 * @global
 * @function textContent
 * @param {object} node instance of Node
 * @return {string}
 * @description
 * Get all content from nodes
 * @example
 * textContent(node); // true
 */
export function textContent(node) {
    var result = "";

    if (isNode(node) && !isWindow(node) && !isDocumentNode(node)) {
        if (node.textContent) {
            return node.textContent;
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            switch (node.childNodes[i].nodeType) {
                case 1:
                case 5:
                    result += textContent(node.childNodes[i]);
                    break;
                case 2:
                case 3:
                case 4:
                    result += node.childNodes[i].nodeValue;
                    break;
                default:
                    break;
            }
        }
    }

    return result;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getPrevElementSibling
 * @global
 * @function getPrevElementSibling
 * @param {object} node instance of Node
 * @param {string} tagName some tag name
 * @param {boolean} regExp tagName needs to be regexed
 * @return node
 * @description
 * Return prev element sibling
 * @example
 * getPrevElementSibling(node, /b/g, true); // node
 *  getPrevElementSibling(node); // prev
 */
export function getPrevElementSibling(node, tagName, regExp) {
    var re;
    if (isDocumentNode(node) || !isElementNode(node)) {
        return false;
    }
    node = node.previousSibling;
    if (regExp) {
        re = new RegExp(tagName, 'ig');
    }
    while (node && !isElementNode(node)) {
        node = node.previousSibling;
    }
    if (regExp) {
        if (node && node.tagName && !node.tagName.match(re)) {
            return getPrevElementSibling(node, tagName, regExp);
        }
    } else if (tagName && isElementNode(node) && node.tagName.toLowerCase() != tagName.toLowerCase()) {
        return getPrevElementSibling(node, tagName);
    }
    return node;
}


/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getNextElementSibling
 * @global
 * @function getNextElementSibling
 * @param {object} node instance of Node
 * @param {string} tagName some tag name
 * @param {boolean} regExp tagName needs to be regexed
 * @return node
 * @description
 * Return prev element sibling
 * @example
 * getNextElementSibling(node, /b/g, true); // node
 * getNextElementSibling(node); // next
 */
export function getNextElementSibling(node, tagName, regExp) {
    var re;
    if (isDocumentNode(node) || !isElementNode(node)) {
        return false;
    }
    node = node.nextSibling;
    if (regExp) {
        re = new RegExp(tagName, 'ig');
    }
    while (node && !isElementNode(node)) {
        node = node.nextSibling;
    }
    if (regExp) {
        if (node && node.tagName && !node.tagName.match(re)) {
            return getNextElementSibling(node, tagName, regExp);
        }
    } else if (tagName && isElementNode(node) && node.tagName.toLowerCase() != tagName.toLowerCase()) {
        return getNextElementSibling(node, tagName);
    }
    return node;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getAllChildren
 * @global
 * @function getAllChildren
 * @param {object} parentNode instance of Node
 * @param {string} tagName some tag name
 * @param {boolean} regExp tagName needs to be regexed
 * @return {array} of nodes
 * @description
 * Return prev element sibling
 * @example
 * getAllChildren(node, /b/g, true); // node
 * getAllChildren(node); // all
 */
export function getAllChildren(parentNode, tagName, regExp) {
    var nodes = [], re;
    if (regExp) {
        re = new RegExp(tagName, 'ig');
    }
    if (isNode(parentNode)) {
        forEach(parentNode.childNodes, function (node) {
            if (tagName) {
                if (regExp) {
                    if (node.tagName.match(re)) {
                        nodes.push(node);
                    }
                } else {
                    if (node.tagName.toLowerCase() === tagName) {
                        nodes.push(node);
                    }
                }
            } else {
                nodes.push(node);
            }
        });
    }
    return nodes;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getChildElements
 * @global
 * @function getChildElements
 * @param {object} parentNode instance of Node
 * @param {string} tagName some tag name
 * @param {boolean} regExp tagName needs to be regexed
 * @return {array} of nodes
 * @description
 * Return all child element
 * @example
 * getChildElements(node, /b/g, true); // node
 * getChildElements(node); // all
 */
export function getChildElements(parentNode, tagName, regExp) {
    var nodes = [], re;
    if (regExp) {
        re = new RegExp(tagName, 'ig');
    }
    if (isElementNode(parentNode)) {
        forEach(parentNode.childNodes, function (node) {
            if (isElementNode(node)) {
                if (tagName) {
                    if (regExp) {
                        if (node.tagName.match(re)) {
                            nodes.push(node);
                        }
                    } else {
                        if (node.tagName.toLowerCase() === tagName) {
                            nodes.push(node);
                        }
                    }
                } else {
                    nodes.push(node);
                }
            }
        });
    }
    return nodes;
};
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getFirstElementChild
 * @global
 * @function getFirstElementChild
 * @param {object} parentNode instance of Node
 * @param {string} tagName some tag name
 * @param {boolean} regExp tagName needs to be regexed
 * @return {array} of nodes
 * @description
 * Return all child element
 * @example
 * getFirstElementChild(node, /b/g, true); // node
 * getFirstElementChild(node);
 */
export function getFirstElementChild(parentNode, tagName, regExp) {
    var node, re;
    if (regExp) {
        re = new RegExp(tagName, 'ig');
    }
    if (isElementNode(parentNode) || isDocumentNode(parentNode)) {
        node = parentNode.firstChild;
    } else {
        return false;
    }
    while (node && !isElementNode(node)) {
        node = node.nextSibling;
    }

    if (isElementNode(node)) {
        if (regExp) {
            if (!node.tagName.match(re)) {
                node = getNextElementSibling(node, tagName, regExp);
            }
        } else if (isDefined(tagName) && node.tagName.toLowerCase() != tagName.toLowerCase()) {
            node = getNextElementSibling(node, tagName);
        }
    }
    return node;
};

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name removeChildren
 * @global
 * @function removeChildren
 * @param {object} node instance of Node
 * @return {object} instance of Node
 * @description
 * Remove all child nodes
 * @example
 * removeChildren(node);
 */
export function removeChildren(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
    return node;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getElementTagName
 * @global
 * @function getElementTagName
 * @param {object} node instance of Node
 * @return {string} tag name
 * @description
 * Get element tag name
 * @example
 * getElementTagName(node);
 */
export function getElementTagName(node) {
    return isElementNode(node) ? node.tagName.toLowerCase() : null;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name removeWhiteSpace
 * @global
 * @function removeWhiteSpace
 * @param {string} str provide string to be cleaned
 * @return {string} cleaned string
 * @description
 * Remove white spaces from string
 * @example
 * removeWhiteSpace(node);
 */
export function removeWhiteSpace(str) {
    if (!isString(str)) {
        return str;
    }
    return trim(str.replace(/[\t\n\r]+/g, ''));
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name handleError
 * @global
 * @function handleError
 * @param {string} message is message with pattern
 * @param {array} attrs array of patterns which needs to be exchanged
 * @return {string} serialized message
 * @description
 * Return nice message
 * @example
 * handleError('one {1}', ['abc']);
 */
export function handleError(message, attrs) {
    if (isArray(attrs)) {
        forEach(attrs, function (value, index) {
            if (isString(value)) {
                message = message.replace('{' + index + '}', value);
            } else {
                try {
                    message = message.replace('{' + index + '}', JSON.stringify(value));
                } catch (e) {

                }
            }
        });
    }
    return message;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name removeClass
 * @global
 * @function removeClass
 * @param {object} node instance of Node
 * @param {object} cssClasses string of classes
 * @param {object} attr special can be applyd for instead class attr
 * @description
 * Remove provided classes
 * @example
 * removeClass(node, 'one two three');
 */
export function removeClass(node, cssClasses, attr) {
    var key = attr || 'class';
    if (cssClasses && node.setAttribute) {
        forEach(cssClasses.split(' '), function (cssClass) {
            node.setAttribute(key, trim(
                    (" " + (node.getAttribute(key) || '') + " ")
                        .replace(/[\n\t]/g, " ")
                        .replace(" " + trim(cssClass) + " ", " "))
            );
        });
    }
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name addClass
 * @global
 * @function addClass
 * @param {object} node instance of Node
 * @param {object} cssClasses string of classes
 * @param {object} attr special can be applyd for instead class attr
 * @description
 * Add provided classes
 * @example
 * addClass(node, 'one two three'); // <div class="one two three" />
 */
export function addClass(node, cssClasses, attr) {
    if (cssClasses && node.setAttribute) {
        var existingClasses = (' ' + (node.getAttribute('class') || '') + ' ')
            .replace(/[\n\t]/g, " ");

        forEach(cssClasses.split(' '), function (cssClass) {
            cssClass = trim(cssClass);
            if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                existingClasses += cssClass + ' ';
            }
        });
        node.setAttribute(attr || 'class', trim(existingClasses));
    }
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getXML
 * @global
 * @function getXML
 * @param {string} url to download
 * @param {function} callback after download
 * @param {boolean} async calls should always be async but sometimes we want to download it synchronously
 * @param {object} ctx special can be applyd for instead class attr
 * @description
 * Download resource content
 * @example
 * getXML('myxmlfile.xml', function(file) {
 *      console.log(file) //
 * }); //
 */
export function getXML(url, callback, async, ctx) {
    var xhr = new XMLHttpRequest(),
        async = isDefined(async) && isBoolean(async) ? async : true,
        context;
    if (isFunction(xhr.overrideMimeType)){
        xhr.overrideMimeType('text/xml');
    }
    xhr.open('GET', url, async);
    // pass the context to callback
    if (!ctx) {
        context = {};
    } else {
        context = ctx;
    }

    if (async) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (isFunction(callback)) {
                        callback.call(context, xhr.responseXML, false, xhr.status);
                    }
                } else {
                    if (isFunction(callback)) {
                        callback.call(context, null, true, xhr.status);
                    }
                }
            }
        };
        xhr.send(null);
    } else {
        xhr.send(null);
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (isFunction(callback)) {
                    callback.call(context, xhr.responseXML, false, xhr.status);
                }
            } else {
                if (isFunction(callback)) {
                    callback.call(context, null, true, xhr.status);
                }
            }
        }
    }
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name parseXML
 * @global
 * @function parseXML
 * @param {string} str xml string to parse
 * @return a parsed document
 * @description
 * Will parse xml string
 * @example
 * parseXML('<tagone><child></child></tagone>');
 */
export function parseXML(str) {
    if (isString(str)) {
        var parser = new DOMParser(),
            xmlDoc = new RegExp('^<\\?xml'),
            prefix = getXMLHeader();
        if (str && !str.match(xmlDoc)) {
            return parser.parseFromString(prefix + str, "text/xml");
        }
        return parser.parseFromString(str, "text/xml");
    } else {
        throw new NgError('str argument is not string type');
    }

}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name removeComments
 * @global
 * @function removeComments
 * @param {object} node instance of Node
 * @return {object} instance of Node
 * @description
 * Remove all comments
 * @example
 * removeComments(node);
 */
export function removeComments(node) {
    if (isNode(node, NODES.COMMENT_NODE)) {
        node.parentNode.removeChild(node);
    }
    forEach(getAllChildren(node), removeComments);
    return node;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getXMLHeader
 * @global
 * @function getXMLHeader
 * @return {string} xml header
 * @description
 * Returns xml string
 * @example
 * getXMLHeader();
 */
export function getXMLHeader() {
    return '<?xml version="1.0" encoding="UTF-8" ?>';
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name toXML
 * @global
 * @function toXML
 * @param {object} document instance of Document XML
 * @return {object} instance of Node
 * @description
 * Returns xml string
 * @example
 * toXML(document);
 */
export function toXML(document) {
    if (!isDocumentNode(document)) {
        return null;
    }
    var serializer = new XMLSerializer(),
        xmlString = '',
        xmlDoc = new RegExp('^<\\?xml'),
        prefix = getXMLHeader();

    try {
        xmlString = serializer.serializeToString(document);
    } catch (e) {

    }
    if (!xmlString.match(xmlDoc)) {
        return prefix + xmlString;
    }
    return xmlString;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isConstructor
 * @global
 * @function isConstructor
 * @param {object} obj
 * @return {object} constructor
 * @description
 * Gets instance constructor
 * @example
 * function A() {
 *
 * }
 * var a = new A();
 * var NA = getClassInstanceConstructor(a) /// will return definition of A
 * var nA = new NA();
 */
export function isConstructor(obj) {
    return isDefined(obj) && isObject(obj) && isDefined(obj.constructor) && isFunction(obj.constructor);
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getClassInstanceConstructor
 * @global
 * @function getClassInstanceConstructor
 * @param {object} Class constructor
 * @return {object} constructor
 * @description
 * Gets instance constructor
 * @example
 * function A() {
 *
 * }
 * var a = new A();
 * var NA = getClassInstanceConstructor(a) /// will return definition of A
 * var nA = new NA();
 */
export function getClassInstanceConstructor(Class) {
    if (isConstructor(Class)) {
        return Class.constructor;
    } else {
        throw new NgError('Class is not valid constructor', Class);
    }
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getClassInstanceName
 * @global
 * @function getClassInstanceName
 * @param {object} Class constructor
 * @return {string} Name of constructor
 * @description
 * Gets name of constructor
 * @example
 * function A() {
 *
 * }
 * var a = new A();
 * getClassInstanceName(a) /// 'A'
 *
 */
export function getClassInstanceName(Class) {
    if (isConstructor(Class)) {
        if (isIE()) {
            return getFunctionName(Class.constructor);
        } else {
            return Class.constructor.name;
        }
    } else {
        throw new NgError('Class is not valid constructor', Class);
    }
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name getFunctionName
 * @global
 * @function getFunctionName
 * @param {object} name constructor
 * @return {string} Name of constructor
 * @description
 * Gets name of function
 *
 */
export function getFunctionName(name) {
    var pattern = /(\s[A-Za-z0-9\s]+)\(/ig,
        match;
    try {
        match = name.toString().match(pattern);
        if (match) {
            return match[0].replace('(', '').trim();
        }
    } catch (e) {

    }
    return null;
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isSafari
 * @global
 * @function isSafari
 * @return {boolean}
 * @description
 * Check if browser is safari
 */
export function isSafari() {
    return /^((?!chrome).)*safari/i.test(navigator.userAgent);
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isIE
 * @global
 * @function isIE
 * @return {boolean}
 * @description
 * Check if browser is internet explorer
 */
export function isIE() {
    return /MSIE|Trident/i.test(navigator.userAgent);
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isMozilla
 * @global
 * @function isMozilla
 * @return {boolean}
 * @description
 * Check if browser is mozilla
 */
export function isMozilla() {
    return /firefox/i.test(navigator.userAgent);
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isChrome
 * @global
 * @function isChrome
 * @return {boolean}
 * @description
 * Check if browser is chrome
 */
export function isChrome() {
    return /chrome/i.test(navigator.userAgent);
}


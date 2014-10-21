/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NODES
 * @global
 * @description
 * Global vars
 */
const ELEMENT_NODE = 1;
const ATTRIBUTE_NODE = 2;
const TEXT_NODE = 3;
const CDATA_SECTION_NODE = 4;
const ENTITY_REFERENCE_NODE = 5;
const ENTITY_NODE = 6;
const PROCESSING_INSTRUCTION_NODE = 7;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;
const DOCUMENT_TYPE_NODE = 10;
const DOCUMENT_FRAGMENT_NODE = 11;
const NOTATION_NODE = 12;
/**
 * to String
 * @type {Function}
 */
var toString = Object.prototype.toString;

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
 * @name isConstructor
 * @global
 * @function isConstructor
 * @return {boolean}
 */
export function isConstructor(obj) {
    if (isObject(obj)) {
        return Object.getPrototypeOf(obj).hasOwnProperty("constructor");
    }
    return false;
}
/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name copy
 * @global
 * @function copy
 */
export function copy(source) {
    var destination;
    if (isDate(source)) {
        return new Date(source.getTime());
    } else if (isRegExp(source)) {
        return new RegExp(source.source);
    } else if (isConstructor(source)) {
        destination = new source.constructor;
        Object.keys(source).forEach((key) => {
            destination[key] = copy(source[key]);
        });
        return destination;
    }
    return source;
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
export function forEach(obj, iterator, context = null) {
    var key;
    if (obj) {
        if (isArray(obj)) {
            obj.forEach(iterator, context);
        } else if(isObject(obj)) {
            Object.keys(obj).forEach(function(item) {
                if (item !== 'length') {
                    iterator.call(context, obj[item], item);
                }
            });
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
export function instanceOf(object, Class) {
    if (isFunction(Class)) {
        return object instanceof Class;
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
    return isNode(node, TEXT_NODE);
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
export function isCommentNode(node) {
    return isNode(node, COMMENT_NODE);
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
    return isNode(node, DOCUMENT_NODE);
}

/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name isDocumentFragmentNode
 * @global
 * @function isDocumentFragmentNode
 * @param {object} node instance of Node
 * @return {boolean}
 * @description
 * Check if object is valid document fragment node node
 * @example
 * isDocumentFragmentNode(document); // false
 */
export function isDocumentFragmentNode(node) {
    return isNode(node, DOCUMENT_FRAGMENT_NODE);
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
    return isNode(node, ELEMENT_NODE);
}


/**
 * @license  2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name clean
 * @global
 * @function clean
 * @param {object} obj to clean
 * @description
 * Nullify all references in object
 * clean({a:{}, b:1, c:1}); // {a:null, b:null, c:null}
 */
export function clean(obj) {
    var key;
    if (!isObject(obj) && !isArray(obj)) {
        throw new NgError('obj param is not an object type', [e])
    }
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = null;
        }
    }
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
export function getXML(url, async = true) {
    var xhr = new XMLHttpRequest(), ob;
    if (isFunction(xhr.overrideMimeType)) {
        xhr.overrideMimeType('text/xml');
    }
    xhr.open('GET', url, async);
    if (!async) {
        xhr.send(null);
        ob = {
            then: (resolve, reject) => {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    if (isFunction(resolve)) {
                        resolve(xhr.responseXML);
                    }
                } else {
                    if (isFunction(reject)) {
                        reject(xhr);
                    }
                }
                return ob;
            }
        };
        return ob;
    }

    return new Promise(function(resolve, reject) {
        xhr.onreadystatechange = handle;
        xhr.send(null);

        function handle() {
            if(xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.responseXML);
                } else {
                    reject(xhr);
                }
            }
        }
    });

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
    var result;
    try {

        for(let iNode of gen(node)) {
            if (isCommentNode(iNode)) {
                if (iNode.nextSibling) {
                    result = iNode.nextSibling;
                } else {
                    result = iNode.parentNode;
                }
                iNode.parentNode.removeChild(iNode);
            }

        }
    } catch (e) {
        throw new NgError('removeComments: to many iterations');
    }
    /**
     * Iterate
     * @param node
     */
    function* gen(node) {
        var skip = false;
        while (true) {
            if (result) {
                node = result;
                result = null;
            }
            if (node.firstChild && !skip) {
                node = node.firstChild;
                yield node;
            } else if (node.nextSibling) {
                node = node.nextSibling;
                skip = false;
                yield node;
            } else if (node.parentNode) {
                node = node.parentNode;
                skip = true;
            } else {
                break;
            }
        }
    }
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


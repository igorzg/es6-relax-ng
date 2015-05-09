define([], function() {
  "use strict";
  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = 2;
  var TEXT_NODE = 3;
  var CDATA_SECTION_NODE = 4;
  var ENTITY_REFERENCE_NODE = 5;
  var ENTITY_NODE = 6;
  var PROCESSING_INSTRUCTION_NODE = 7;
  var COMMENT_NODE = 8;
  var DOCUMENT_NODE = 9;
  var DOCUMENT_TYPE_NODE = 10;
  var DOCUMENT_FRAGMENT_NODE = 11;
  var NOTATION_NODE = 12;
  var toString = Object.prototype.toString;
  function trim(value) {
    return isString(value) ? value.trim() : value;
  }
  function isBoolean(value) {
    return typeof value === 'boolean';
  }
  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  function isDefined(value) {
    return typeof value !== 'undefined';
  }
  function isObject(value) {
    return value != null && typeof value === 'object';
  }
  function isString(value) {
    return typeof value === 'string';
  }
  function isNumber(value) {
    return typeof value === 'number';
  }
  function isDate(value) {
    return toString.call(value) === '[object Date]';
  }
  function isArray(value) {
    return Array.isArray(value);
  }
  function isFunction(value) {
    return typeof value === 'function';
  }
  function isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
  }
  function isConstructor(obj) {
    if (isObject(obj)) {
      return Object.getPrototypeOf(obj).hasOwnProperty("constructor");
    }
    return false;
  }
  function copy(source) {
    var destination;
    if (isDate(source)) {
      return new Date(source.getTime());
    } else if (isRegExp(source)) {
      return new RegExp(source.source);
    } else if (isConstructor(source)) {
      destination = new source.constructor;
      Object.keys(source).forEach((function(key) {
        destination[key] = copy(source[key]);
      }));
      return destination;
    }
    return source;
  }
  function camelCase(value) {
    return value.replace(/([\:\-\_]+(.))/g, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    }).replace(/^moz([A-Z])/, 'Moz$1');
  }
  function css(element, name, value) {
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
  function forEach(obj, iterator) {
    var context = arguments[2] !== (void 0) ? arguments[2] : null;
    var key;
    if (obj) {
      if (isArray(obj)) {
        obj.forEach(iterator, context);
      } else if (isObject(obj)) {
        Object.keys(obj).forEach(function(item) {
          if (item !== 'length') {
            iterator.call(context, obj[item], item);
          }
        });
      }
    }
    return obj;
  }
  function instanceOf(object, Class) {
    if (isFunction(Class)) {
      return object instanceof Class;
    }
    return false;
  }
  function isNode(node, type) {
    if (node && node.nodeType) {
      if (type) {
        return node.nodeType === type;
      }
      return true;
    }
    return false;
  }
  function isTextNode(node) {
    return isNode(node, TEXT_NODE);
  }
  function isCommentNode(node) {
    return isNode(node, COMMENT_NODE);
  }
  function isDocumentNode(node) {
    return isNode(node, DOCUMENT_NODE);
  }
  function isDocumentFragmentNode(node) {
    return isNode(node, DOCUMENT_FRAGMENT_NODE);
  }
  function isElementNode(node) {
    return isNode(node, ELEMENT_NODE);
  }
  function clean(obj) {
    var key;
    if (!isObject(obj) && !isArray(obj)) {
      throw new NgError('obj param is not an object type', [e]);
    }
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = null;
      }
    }
  }
  function removeWhiteSpace(str) {
    if (!isString(str)) {
      return str;
    }
    return trim(str.replace(/[\t\n\r]+/g, ''));
  }
  function handleError(message, attrs) {
    if (isArray(attrs)) {
      forEach(attrs, function(value, index) {
        if (isString(value)) {
          message = message.replace('{' + index + '}', value);
        } else {
          try {
            message = message.replace('{' + index + '}', JSON.stringify(value));
          } catch (e) {}
        }
      });
    }
    return message;
  }
  function getXML(url) {
    var async = arguments[1] !== (void 0) ? arguments[1] : true;
    var xhr = new XMLHttpRequest(),
        ob;
    if (isFunction(xhr.overrideMimeType)) {
      xhr.overrideMimeType('text/xml');
    }
    xhr.open('GET', url, async);
    if (!async) {
      xhr.send(null);
      ob = {then: (function(resolve, reject) {
          if (xhr.readyState == 4 && xhr.status == 200) {
            if (isFunction(resolve)) {
              resolve(xhr.responseXML);
            }
          } else {
            if (isFunction(reject)) {
              reject(xhr);
            }
          }
          return ob;
        })};
      return ob;
    }
    return new Promise(function(resolve, reject) {
      xhr.onreadystatechange = handle;
      xhr.send(null);
      function handle() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(xhr.responseXML);
          } else {
            reject(xhr);
          }
        }
      }
    });
  }
  function parseXML(str) {
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
  function removeComments(node) {
    var $__7 = $traceurRuntime.initGeneratorFunction(gen);
    var result;
    try {
      var $__3 = true;
      var $__4 = false;
      var $__5 = undefined;
      try {
        for (var $__1 = void 0,
            $__0 = (gen(node))[$traceurRuntime.toProperty(Symbol.iterator)](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
          var iNode = $__1.value;
          {
            if (isCommentNode(iNode)) {
              if (iNode.nextSibling) {
                result = iNode.nextSibling;
              } else {
                result = iNode.parentNode;
              }
              iNode.parentNode.removeChild(iNode);
            }
          }
        }
      } catch ($__6) {
        $__4 = true;
        $__5 = $__6;
      } finally {
        try {
          if (!$__3 && $__0.return != null) {
            $__0.return();
          }
        } finally {
          if ($__4) {
            throw $__5;
          }
        }
      }
    } catch (e) {
      throw new NgError('removeComments: to many iterations');
    }
    function gen(node) {
      var skip;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              skip = false;
              $ctx.state = 24;
              break;
            case 24:
              $ctx.state = (true) ? 20 : -2;
              break;
            case 20:
              if (result) {
                node = result;
                result = null;
              }
              $ctx.state = 21;
              break;
            case 21:
              $ctx.state = (node.firstChild && !skip) ? 5 : 18;
              break;
            case 5:
              node = node.firstChild;
              $ctx.state = 6;
              break;
            case 6:
              $ctx.state = 2;
              return node;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 24;
              break;
            case 18:
              $ctx.state = (node.nextSibling) ? 11 : 17;
              break;
            case 11:
              node = node.nextSibling;
              skip = false;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = 8;
              return node;
            case 8:
              $ctx.maybeThrow();
              $ctx.state = 24;
              break;
            case 17:
              $ctx.state = (node.parentNode) ? 15 : -2;
              break;
            case 15:
              node = node.parentNode;
              skip = true;
              $ctx.state = 24;
              break;
            default:
              return $ctx.end();
          }
      }, $__7, this);
    }
    return node;
  }
  function getXMLHeader() {
    return '<?xml version="1.0" encoding="UTF-8" ?>';
  }
  function toXML(document) {
    if (!isDocumentNode(document)) {
      return null;
    }
    var serializer = new XMLSerializer(),
        xmlString = '',
        xmlDoc = new RegExp('^<\\?xml'),
        prefix = getXMLHeader();
    try {
      xmlString = serializer.serializeToString(document);
    } catch (e) {}
    if (!xmlString.match(xmlDoc)) {
      return prefix + xmlString;
    }
    return xmlString;
  }
  function isSafari() {
    return /^((?!chrome).)*safari/i.test(navigator.userAgent);
  }
  function isIE() {
    return /MSIE|Trident/i.test(navigator.userAgent);
  }
  function isMozilla() {
    return /firefox/i.test(navigator.userAgent);
  }
  function isChrome() {
    return /chrome/i.test(navigator.userAgent);
  }
  return {
    get trim() {
      return trim;
    },
    get isBoolean() {
      return isBoolean;
    },
    get isUndefined() {
      return isUndefined;
    },
    get isDefined() {
      return isDefined;
    },
    get isObject() {
      return isObject;
    },
    get isString() {
      return isString;
    },
    get isNumber() {
      return isNumber;
    },
    get isDate() {
      return isDate;
    },
    get isArray() {
      return isArray;
    },
    get isFunction() {
      return isFunction;
    },
    get isRegExp() {
      return isRegExp;
    },
    get isConstructor() {
      return isConstructor;
    },
    get copy() {
      return copy;
    },
    get camelCase() {
      return camelCase;
    },
    get css() {
      return css;
    },
    get forEach() {
      return forEach;
    },
    get instanceOf() {
      return instanceOf;
    },
    get isNode() {
      return isNode;
    },
    get isTextNode() {
      return isTextNode;
    },
    get isCommentNode() {
      return isCommentNode;
    },
    get isDocumentNode() {
      return isDocumentNode;
    },
    get isDocumentFragmentNode() {
      return isDocumentFragmentNode;
    },
    get isElementNode() {
      return isElementNode;
    },
    get clean() {
      return clean;
    },
    get removeWhiteSpace() {
      return removeWhiteSpace;
    },
    get handleError() {
      return handleError;
    },
    get getXML() {
      return getXML;
    },
    get parseXML() {
      return parseXML;
    },
    get removeComments() {
      return removeComments;
    },
    get getXMLHeader() {
      return getXMLHeader;
    },
    get toXML() {
      return toXML;
    },
    get isSafari() {
      return isSafari;
    },
    get isIE() {
      return isIE;
    },
    get isMozilla() {
      return isMozilla;
    },
    get isChrome() {
      return isChrome;
    },
    __esModule: true
  };
});

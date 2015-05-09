define(["./ng-class", "./ng-error", "../core"], function($__0,$__2,$__4) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var NgClass = $__0.NgClass;
  var NgError = $__2.NgError;
  var $__5 = $__4,
      isNode = $__5.isNode,
      isArray = $__5.isArray,
      isString = $__5.isString,
      forEach = $__5.forEach,
      instanceOf = $__5.instanceOf,
      isDocumentNode = $__5.isDocumentNode,
      isElementNode = $__5.isElementNode,
      isTextNode = $__5.isTextNode,
      isCommentNode = $__5.isCommentNode,
      isDocumentFragmentNode = $__5.isDocumentFragmentNode,
      isSafari = $__5.isSafari,
      isIE = $__5.isIE,
      clean = $__5.clean,
      parseXML = $__5.parseXML,
      toXML = $__5.toXML;
  var NgDOM = (function($__super) {
    function NgDOM(node) {
      $traceurRuntime.superConstructor(NgDOM).call(this, NgDOM);
      if (!isNode(node)) {
        throw new NgError('NgDOM error node is not valid');
      }
      this.node = node;
      if (this.node.localName && this.node.prefix) {
        this.type = this.node.localName;
        this.typePrefix = this.node.prefix;
      } else {
        this.type = this.node.nodeName;
        this.typePrefix = null;
      }
      this.namespaceURI = this.node.namespaceURI;
      this.className = 'NgDOM';
    }
    return ($traceurRuntime.createClass)(NgDOM, {
      is: function(type) {
        var prefix = arguments[1] !== (void 0) ? arguments[1] : false;
        var typePrefix = true;
        if (prefix) {
          typePrefix = this.typePrefix === prefix;
        }
        if (isArray(type)) {
          return type.indexOf(this.type) > -1 && !!typePrefix;
        }
        return this.type === type && !!typePrefix;
      },
      firstChild: function() {
        if (this.node) {
          return this.getInstance(this.node.firstChild);
        }
        return null;
      },
      firstElementChild: function() {
        if (this.node) {
          return this.getInstance(this.node.firstElementChild);
        }
        return null;
      },
      lastChild: function() {
        if (this.node) {
          return this.getInstance(this.node.lastChild);
        }
        return null;
      },
      lastElementChild: function() {
        if (this.node) {
          return this.getInstance(this.node.lastElementChild);
        }
        return null;
      },
      nextSibling: function() {
        if (this.node) {
          return this.getInstance(this.node.nextSibling);
        }
        return null;
      },
      nextElementSibling: function() {
        if (this.node) {
          return this.getInstance(this.node.nextElementSibling);
        }
        return null;
      },
      previousSibling: function() {
        if (this.node) {
          return this.getInstance(this.node.previousSibling);
        }
        return null;
      },
      previousElementSibling: function() {
        if (this.node) {
          return this.getInstance(this.node.previousElementSibling);
        }
        return null;
      },
      parentNode: function() {
        if (this.node) {
          return this.getInstance(this.node.parentNode);
        }
        return null;
      },
      createTextNode: function(str) {
        var doc = this.getDocument();
        if (doc && doc.isDocumentNode()) {
          return this.getInstance(doc.node.createTextNode(str));
        }
        throw new NgError('Element is not attached to document node');
      },
      createElement: function(name) {
        var doc = this.getDocument();
        if (doc && doc.isDocumentNode()) {
          return this.getInstance(doc.node.createElement(name));
        }
        throw new NgError('Element is not attached to document node');
      },
      createElementNs: function(namespace, name) {
        var doc = this.getDocument();
        if (doc && doc.isDocumentNode()) {
          return this.getInstance(doc.node.createElementNS(namespace, name));
        }
        throw new NgError('Element is not attached to document node');
      },
      importNode: function(nNode) {
        var doc = this.getDocument(),
            node = this.getInstance(nNode);
        if (doc.isDocumentNode() && instanceOf(node, NgDOM)) {
          doc.node.adoptNode(node.node);
          doc.node.importNode(node.node, true);
        } else {
          throw new NgError('There is no valid document at importNode');
        }
      },
      addChild: function(nNode, importNode) {
        var node = this.getInstance(nNode);
        if (!!importNode) {
          this.importNode(node);
        }
        if (!instanceOf(node, NgDOM)) {
          throw new NgError('Error in addChild node must be instance of NgDOM');
        }
        this.node.appendChild(node.node);
        return node;
      },
      replaceNode: function(nNode, importNode) {
        var parent = this.parentNode(),
            node = this.getInstance(nNode),
            current;
        if (parent && node) {
          if (!!importNode) {
            this.importNode(node);
          }
          current = this.node;
          try {
            this.destroy();
          } catch (e) {
            throw new NgError('replaceNode cannot destroy current child, parent "{0}", replace with "{1}", current "{2}",', [parent, node, current]);
          } finally {
            parent.node.replaceChild(node.node, current);
          }
          return parent;
        } else {
          throw new NgError('replaceNode parent or node is not provided parent "{0}", replace with "{1}", current "{2}",', [parent, node, this]);
        }
      },
      insertBefore: function(newNode, beforeNode, importNode) {
        var n = this.getInstance(newNode),
            b = this.getInstance(beforeNode);
        try {
          if (!!importNode) {
            this.importNode(newNode);
          }
          this.node.insertBefore(n.node, b.node);
        } catch (e) {
          throw new NgError('Unable to execute insert before error "{0}"', [e]);
        }
      },
      clone: function() {
        var clone;
        if (isSafari() && this.isDocumentNode()) {
          clone = parseXML(toXML(this.node));
        } else {
          clone = this.node.cloneNode(true);
        }
        return this.getInstance(clone);
      },
      remove: function() {
        var parent = this.parentNode(),
            node = this.node;
        try {
          this.destroy();
        } catch (e) {
          throw new NgError('Child not removed from node "{0}"', [e]);
        } finally {
          if (parent && parent.node) {
            parent.node.removeChild(node);
          }
          node = null;
          parent = null;
        }
      },
      destroy: function() {
        clean(this);
      },
      toXML: function() {
        return (new XMLSerializer()).serializeToString(this.node);
      },
      isCommentNode: function() {
        return isCommentNode(this.node);
      },
      isTextNode: function() {
        return isTextNode(this.node);
      },
      isElementNode: function() {
        return isElementNode(this.node);
      },
      isDocumentNode: function() {
        return isDocumentNode(this.node);
      },
      isDocumentFragmentNode: function() {
        return isDocumentFragmentNode(this.node);
      },
      getDocument: function() {
        if (this.isDocumentNode()) {
          return this;
        } else if (!this.$document) {
          this.$document = this.node.ownerDocument;
        }
        return this.getInstance(this.$document);
      },
      getInstance: function(node) {
        var doc;
        if (instanceOf(node, NgDOM)) {
          return node;
        } else if (isNode(node)) {
          doc = new NgDOM(node);
          doc.$document = this.getDocument();
        }
        return !!doc ? doc : null;
      },
      setValue: function(value) {
        if (this.isTextNode()) {
          this.node.nodeValue = value;
          return true;
        } else if (this.isElementNode()) {
          if (isSafari() || isIE()) {
            this.removeChildren();
            this.addChild(this.parse(value));
          } else {
            this.node.innerHTML = value;
          }
          return true;
        }
        return false;
      },
      getValue: function() {
        var str = '';
        if (this.isTextNode()) {
          return this.node.nodeValue;
        } else if (this.isElementNode()) {
          if (isSafari() || isIE()) {
            forEach(this.children(), function(cNode) {
              if (cNode.isTextNode()) {
                str += cNode.getValue();
              } else {
                str += cNode.toXML();
              }
            });
            return str;
          } else {
            return this.node.innerHTML;
          }
        }
        return str;
      },
      createFragment: function() {
        var doc = this.getDocument();
        if (doc) {
          return this.getInstance(doc.node.createDocumentFragment());
        }
        return null;
      },
      parse: function(html) {
        var docFragment = this.createFragment(),
            parseElement,
            importNode = false;
        if (docFragment) {
          if (isSafari() || isIE()) {
            parseElement = this.getInstance(parseXML('<div>' + html + '</div>').documentElement.cloneNode(true));
            importNode = true;
          } else {
            parseElement = docFragment.createElement('div');
            parseElement.node.innerHTML = html;
          }
          if (parseElement.hasChildren()) {
            forEach(parseElement.children(), function(cNode) {
              docFragment.addChild(cNode.clone(), importNode);
            });
          }
          parseElement.destroy();
          return docFragment;
        }
        return false;
      },
      children: function() {
        var nodes = [];
        forEach(this.node.childNodes, function(node) {
          nodes.push(this.getInstance(node));
        }, this);
        return nodes;
      },
      removeChildren: function() {
        forEach(this.children(), (function(cNode) {
          cNode.remove();
        }));
        return this;
      },
      hasChildren: function() {
        if (this.node) {
          return this.node.hasChildNodes();
        }
        return false;
      },
      hasChildElements: function() {
        if (this.node) {
          return this.node.childElementCount > 0;
        }
        return false;
      },
      getChildElementCount: function() {
        if (this.node) {
          return this.node.childElementCount;
        }
        return 0;
      },
      childElements: function() {
        var nodes = [];
        forEach(this.node.childNodes, function(node) {
          if (isElementNode(node)) {
            nodes.push(this.getInstance(node));
          }
        }, this);
        return nodes;
      },
      wrap: function(node) {
        node.addChild(this.clone());
        this.replaceNode(node);
        return node;
      },
      unwrap: function() {
        var parent = this.parentNode();
        forEach(this.children(), function(cNode) {
          parent.insertBefore(cNode.clone(), this);
        }, this);
        this.remove();
        return parent;
      },
      wrapChildren: function(node, prevent) {
        var nodesToSlice = [];
        if (isArray(prevent) || isString(prevent)) {
          forEach(this.children(), function(cNode) {
            if (isArray(prevent)) {
              if (prevent.indexOf(cNode.type) === -1) {
                nodesToSlice.push(cNode);
              }
            } else if (cNode.type !== prevent) {
              nodesToSlice.push(cNode);
            }
          });
        } else {
          nodesToSlice = this.children();
        }
        forEach(nodesToSlice, function(cNode) {
          node.addChild(cNode.clone());
          cNode.remove();
        });
        this.addChild(node);
        return this;
      },
      wrapDeepInTwoChildNs: function(node, ns, prefix) {
        var children = this.childElements();
        if (children.length > 2) {
          do {
            wrap.call(this, children, node, ns, prefix);
            children = this.childElements();
          } while (children.length > 2);
        }
        function wrap(childNodes, nodeName, nameSpace, nsPrefix) {
          var wrapNode;
          if (nodeName && !nameSpace) {
            wrapNode = this.createElement(nodeName);
          } else {
            if (nsPrefix) {
              nodeName = nsPrefix + nodeName;
            }
            wrapNode = this.createElementNs(nameSpace, nodeName);
          }
          forEach(childNodes.splice(0, 2), function(cNode) {
            wrapNode.addChild(cNode.clone());
            cNode.remove();
          });
          this.insertBefore(wrapNode, this.firstElementChild());
        }
        return this;
      },
      setAttributeNS: function(namespace, name, value) {
        this.node.setAttributeNS(namespace, name, value);
        return this;
      },
      setAttribute: function(name, value) {
        this.node.setAttribute(name, value);
        return this;
      },
      removeAttributeNS: function(namespace, name) {
        this.node.removeAttributeNS(namespace, name);
        return this;
      },
      removeAttribute: function(name) {
        this.node.removeAttribute(name);
        return this;
      },
      removeAttributeNode: function(attrNode) {
        this.node.removeAttributeNode(attrNode);
        return this;
      },
      hasAttributeNS: function(namespace, name) {
        return this.node.hasAttributeNS(namespace, name);
      },
      hasAttribute: function(name) {
        return this.node.hasAttribute(name);
      },
      isNamespace: function(attrNode) {
        if ((attrNode.prefix === 'xmlns' && this.node && attrNode.localName === this.node.prefix) || (attrNode.name === 'xmlns' && !attrNode.prefix) || (attrNode.prefix === 'xmlns')) {
          return true;
        }
        return false;
      },
      getNamespaces: function() {
        var namespaces = [];
        if (this.isElementNode()) {
          forEach(this.node.attributes, function(value) {
            if (this.isNamespace(value)) {
              namespaces.push({
                name: value.nodeName,
                prefix: value.prefix,
                localName: value.localName,
                type: value.nodeType,
                value: value.nodeValue,
                baseURI: value.baseURI,
                namespaceURI: value.namespaceURI
              });
            }
          }, this);
        }
        return namespaces;
      },
      getNamespace: function(namespace) {
        return this.getNamespaces().filter((function(item) {
          return item.value === namespace;
        })).shift();
      },
      textContent: function() {
        return this.node.textContent;
      },
      getAttributes: function() {
        return Array.prototype.slice.call(this.node.attributes);
      },
      getAttributeNode: function(name) {
        return this.node.getAttributeNode(name);
      },
      getAttributeNodeNS: function(namespace, name) {
        return this.node.getAttributeNodeNS(namespace, name);
      },
      getAttribute: function(name) {
        return this.node.getAttribute(name);
      },
      getAttributeNS: function(namespace, name) {
        return this.node.getAttributeNS(namespace, name);
      },
      querySelector: function(selector) {
        if (this.node && isString(selector)) {
          return this.getInstance(this.node.querySelector(selector));
        }
        return null;
      },
      querySelectorAll: function(selector) {
        if (isArray(selector)) {
          selector = selector.join(',');
        }
        if (this.node) {
          return [].map.call(this.node.querySelectorAll(selector), this.getInstance.bind(this));
        }
        return null;
      },
      querySelectorAllNS: function(namespace, selector) {
        if (isString(selector) && isString(namespace)) {
          return this.querySelectorAll('*|' + selector).filter((function(item) {
            return item.namespaceURI === namespace;
          }));
        }
        return null;
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgDOM() {
      return NgDOM;
    },
    __esModule: true
  };
});

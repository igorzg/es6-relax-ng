define(["./ng-class", "./ng-dom", "./ng-error", "../core"], function($__0,$__2,$__4,$__6) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  var NgClass = $__0.NgClass;
  var NgDOM = $__2.NgDOM;
  var NgError = $__4.NgError;
  var $__7 = $__6,
      isNode = $__7.isNode,
      removeComments = $__7.removeComments,
      toXML = $__7.toXML,
      isObject = $__7.isObject,
      clean = $__7.clean,
      isFunction = $__7.isFunction,
      getXML = $__7.getXML,
      instanceOf = $__7.instanceOf,
      isString = $__7.isString,
      isArray = $__7.isArray,
      forEach = $__7.forEach,
      removeWhiteSpace = $__7.removeWhiteSpace;
  var RELAX_NG_NAME_NS_RGX = /^(.*):(.*)/;
  var NgSchema = (function($__super) {
    function NgSchema(schema) {
      var config = arguments[1] !== (void 0) ? arguments[1] : {
        cloneComplex: true,
        removeInvalidNodes: true
      };
      var fc,
          ns;
      $traceurRuntime.superConstructor(NgSchema).call(this, NgSchema);
      if (!schema && !isNode(schema)) {
        throw new NgError('NgSchema: schema is not provided or have parsing errors schema:', schema);
      }
      schema = removeComments(schema);
      this.config = {};
      if (isObject(config)) {
        Object.assign(this.config, config);
      }
      this.schema = new NgDOM(schema);
      this.rngNs = 'http://relaxng.org/ns/structure/1.0';
      this.localName = null;
      try {
        fc = this.schema.firstElementChild();
        ns = fc.getNamespace(this.rngNs);
        if (ns) {
          if (ns.localName !== 'xmlns') {
            this.localName = ns.localName;
          }
        } else {
          throw new NgError('Schema is not valid relax ng schema, missing ns or is not valid structure');
        }
      } catch (e) {
        if (e.message) {
          throw new NgError(e.message);
        } else {
          throw new NgError('Invalid schema xml structure');
        }
      }
      if (this.config.cloneComplex) {
        this.complex = this.schema.clone();
      } else {
        this.complex = this.schema;
      }
      this.annotations = [];
      this.className = 'NgSchema';
    }
    return ($traceurRuntime.createClass)(NgSchema, {
      step_1: function() {
        var parents = ['attribute', 'choice', 'define', 'element', 'except', 'group', 'interleave', 'list', 'mixed', 'oneOrMore', 'optional', 'start', 'zeroOrMore'];
        this.traverse(function step_1_traverse(node) {
          var parent = node.parentNode(),
              message,
              href,
              replacedNode = null,
              that = this;
          if (this.matchNode(parent, parents)) {
            href = node.getAttribute('href');
            if (href) {
              getXML(href, false).then((function(data) {
                replacedNode = node.replaceNode(mergeExternal.call(that, data), true);
              }), (function(xhr) {
                throw new NgError("field to load xml file status code: {0}", xhr.status);
              }));
            }
          } else {
            message = 'invalid schema definition in step step_1 externalRef don\'t have provided correct parent current parent is "{0}" but allowed are: "{1}" or node don\'t have correct namespace assigned';
            throw new NgError(message, parent.type, parents.join(','));
          }
          return replacedNode;
        }, 'externalRef');
        function mergeExternal(data) {
          var doc = new NgDOM(data),
              fc,
              ns,
              message;
          fc = doc.firstElementChild();
          ns = fc.getNamespace(this.rngNs);
          if (ns && ns.localName) {
            if (ns.localName !== 'xmlns' && this.localName !== ns.localName) {
              message = 'external file don\'t have correct namespace external: "{0}", ';
              message += 'don\'t match "{1}" . Exchange external or internal to do ';
              message += 'correct schema merge.';
              throw new NgError(message, ns.localName, this.localName);
            } else {
              return fc;
            }
          } else {
            throw new NgError('step_1_traverse, checkExternal: invalid schema xml structure');
          }
        }
      },
      step_2: function() {
        var parents = ['div', 'grammar'],
            children = ['define', 'div', 'start'];
        this.traverse(function step_2_traverse(node) {
          var parent = node.parentNode(),
              message,
              href,
              replacedNode = null,
              that = this;
          if (this.matchNode(parent, parents)) {
            forEach(node.childElements(), function(cNode, index) {
              if (!this.matchNode(cNode, children)) {
                var message = 'invalid schema definition in step step_2';
                message += ', include don\'t have provided correct children';
                message += ', current children is {0} at index {1} but allowed are: {2}';
                throw new NgError(message, cNode.type, index, children.join(','));
              } else if (this.matchNode(cNode, 'div')) {
                cNode.unwrap();
              }
            }, this);
            href = node.getAttribute('href');
            if (href) {
              getXML(href, false).then((function(data) {
                replacedNode = node.replaceNode(mergeExternal.call(that, data, node), true);
              }), (function(xhr) {
                throw new NgError("field to load xml file status code: {0}", xhr.status);
              }));
            }
          } else {
            message = 'invalid schema definition in step step_2 include don\'t have provided correct parent current parent is "{0}" but allowed are: "{1}" or node don\'t have correct namespace assigned';
            throw new NgError(message, parent.type, parents.join(','));
          }
          return replacedNode;
        }, 'include');
        function mergeExternal(data, node) {
          var doc = new NgDOM(data),
              fc,
              ce,
              ns,
              message;
          fc = doc.firstElementChild();
          ce = fc.childElements();
          forEach(node.childElements(), function step2_merge_external(cNode) {
            forEach(ce.filter(function(nItem) {
              return nItem.type === cNode.type;
            }), function step2_merge_external_filter(fItem) {
              if (fItem.is('start') || (fItem.is('define') && cNode.is('define') && fItem.getAttribute('name') === cNode.getAttribute('name'))) {
                fItem.replaceNode(cNode, true);
              }
            });
          });
          ns = fc.getNamespace(this.rngNs);
          if (ns && ns.localName) {
            if (ns.localName !== 'xmlns' && this.localName !== ns.localName) {
              message = 'external file don\'t have correct namespace external: "{0}", ';
              message += 'don\'t match "{1}" . Exchange external or internal to do ';
              message += 'correct schema merge.';
              throw new NgError(message, ns.localName, this.localName);
            } else {
              return fc;
            }
          } else {
            throw new NgError('step_2_traverse, checkExternal: invalid schema xml structure');
          }
        }
      },
      step_3: function() {
        this.traverse(function grammar_no_parent_doc(node) {
          if (!this.matchNode(node.parentNode(), '#document')) {
            return node.unwrap();
          }
        }, 'grammar');
      },
      step_4: function() {
        this.traverse(function merge_start(node) {
          if (!this.matchNode(node.parentNode(), 'grammar')) {
            return node.unwrap();
          }
        }, 'start');
      },
      step_5: function() {
        this.traverse(function merge_define(node) {
          if (!this.matchNode(node.parentNode(), 'grammar')) {
            node.getDocument().querySelector('grammar').addChild(node);
          }
        }, 'define');
      },
      step_6: function() {
        var nodes = [],
            first;
        this.traverse(function merge_start(node) {
          if (this.matchNode(node.parentNode(), 'grammar')) {
            if (nodes.length > 1 && node.getAttribute('combine') && node.getAttribute('combine') !== 'choice') {
              throw new NgError('while merging schema, multiple start nodes must have combine as choice pattern');
            }
            nodes.push(node);
          }
        }, 'start');
        if (nodes.length > 1) {
          first = nodes.shift();
          nodes.forEach((function(iNode) {
            first.addChild(iNode);
            iNode.unwrap();
          }));
          first.wrapChildren(this.createElement('choice'));
        } else {
          nodes = null;
        }
      },
      step_7: function() {
        this.traverse(function step_7_remove_annotations(node) {
          var parent;
          if (this.isAnnotation(node)) {
            this.annotations.push(node.clone());
            parent = node.parentNode();
            node.remove();
            return parent;
          }
        });
      },
      step_8: function() {
        this.traverseAll(function step_8_remove_whitespace(node) {
          var value,
              parent = node.parentNode();
          if (!this.matchNode(parent, ['value', 'param'])) {
            value = removeWhiteSpace(node.getValue());
            if (value) {
              node.setValue(value);
            } else {
              node.remove();
              return parent;
            }
          }
        }, '#text');
      },
      step_9: function() {
        this.traverse(function step_9_remove_whitespace(node) {
          removeAttributeWhitespace(node, "name");
          removeAttributeWhitespace(node, "type");
          removeAttributeWhitespace(node, "combine");
        });
        function removeAttributeWhitespace(node, name) {
          if (node.hasAttribute(name)) {
            node.setAttribute(name, removeWhiteSpace(node.getAttribute(name)));
          }
        }
      },
      step_10: function() {
        this.traverse(function step_10_datatypeLibraryInheritance(node) {
          var datatypeUrl = getInheritedLibray(node);
          if (datatypeUrl) {
            node.setAttribute("datatypeLibrary", datatypeUrl);
          }
          if (node.is("value", this.localName) && !node.hasAttribute("type")) {
            node.setAttribute("type", "token");
          }
        }, ['data', 'value']);
        function getInheritedLibray(node) {
          if (node.isElementNode() && node.hasAttribute("datatypeLibrary")) {
            return node.getAttribute("datatypeLibrary");
          } else if (node.parentNode()) {
            return getInheritedLibray(node.parentNode());
          }
          return null;
        }
      },
      step_11: function() {
        this.traverse(function step_11_replace_name_attributes(node) {
          var nameNode,
              ns,
              name;
          if (node.hasAttribute("name")) {
            nameNode = this.createElement("name");
            if (node.hasAttribute("ns")) {
              nameNode.setAttribute("ns", node.getAttribute("ns"));
            } else {
              nameNode.setAttribute("ns", "");
            }
            nameNode.setValue(node.getAttribute("name"));
            if (node.hasChildElements()) {
              node.insertBefore(nameNode, node.firstElementChild());
            } else {
              node.addChild(nameNode);
            }
            node.removeAttribute("name");
          } else if (node.is('element', this.localName)) {
            throw new NgError("step_11, node {0} don't have an name attribute", node.toXML());
          }
        }, ["element", "attribute"]);
      },
      step_12: function() {
        this.traverse(function step_12_inherit_ns_attributes(node) {
          var ns = getInheritedNs(node);
          if (ns) {
            node.setAttribute("ns", ns);
          } else {
            node.setAttribute("ns", "");
          }
        }, ["name", "nsName", "value"]);
        function getInheritedNs(node) {
          if (node.isElementNode() && node.hasAttribute("ns")) {
            return node.getAttribute("ns");
          } else if (node.parentNode()) {
            return getInheritedNs(node.parentNode());
          }
          return null;
        }
      },
      step_13: function() {
        this.traverse(function step_13_remove_invalid_ns_attributes(node) {
          if (!this.matchNode(node, ["name", "nsName", "value"])) {
            if (node.hasAttribute("ns")) {
              node.removeAttribute("ns");
            }
          }
        });
      },
      step_14: function() {
        this.traverse(function step_14_map_name_prefixes(node) {
          var value = node.getValue();
          if (RELAX_NG_NAME_NS_RGX.test(value)) {
            node.setValue(value.replace(RELAX_NG_NAME_NS_RGX, function step_14_replace_m2(s, m1, m2) {
              return m2;
            }));
            node.setAttribute("ns", getInheritedNs(node, value.replace(RELAX_NG_NAME_NS_RGX, function step_14_replace_m1(s, m1) {
              return m1;
            })));
          }
        }, 'name');
        function getInheritedNs(node, suffix) {
          if (node.isElementNode() && node.hasAttribute("xmlns:" + suffix)) {
            return node.getAttribute("xmlns:" + suffix);
          } else if (node.parentNode()) {
            return getInheritedNs(node.parentNode(), suffix);
          }
          throw new NgError('no valid namespace found in step_14 pattern "{0}"', suffix);
        }
      },
      step_15: function() {
        this.traverse(function step_15_replace_with_children(node) {
          var parent = node.parentNode();
          node.unwrap();
          return parent;
        }, 'div');
      },
      step_16: function() {
        this.traverse(function step_16_wrap_group(node) {
          if (node.hasChildElements() && node.getChildElementCount() > 1) {
            node.wrapChildren(this.createElement('group'));
          }
        }, ['define', 'oneOrMore', 'zeroOrMore', 'optional', 'list', 'mixed']);
      },
      step_17: function() {
        this.traverse(function step_17_element(node) {
          if (node.hasChildElements() && node.getChildElementCount() > 2) {
            node.wrapChildren(this.createElement('group'), 'name');
          }
        }, 'element');
      },
      step_18: function() {
        this.traverse(function step_18_except(node) {
          if (node.hasChildElements() && node.getChildElementCount() > 1) {
            node.wrapChildren(this.createElement('choice'));
          }
        }, 'except');
      },
      step_19: function() {
        this.traverse(function step_19_attribute(node) {
          var parent = node.parentNode();
          if (node.hasChildElements() && node.getChildElementCount() === 1) {
            node.addChild(this.createElement('text'));
          } else if (!node.hasChildElements()) {
            node.remove();
            return parent;
          }
        }, 'attribute');
      },
      step_20: function() {
        this.traverse(function step_20_mixed(node) {
          var parent = node.parentNode();
          if (node.hasChildElements() && node.getChildElementCount() === 1) {
            node.unwrap();
            return parent;
          } else if (!node.hasChildElements()) {
            node.remove();
            return parent;
          }
        }, ['choice', 'group', 'interleave']);
      },
      step_21: function() {
        this.traverse(function step_21_wrapInTwoChild(node) {
          var parent = node.parentNode();
          if (node.hasChildElements() && node.getChildElementCount() > 2) {
            if (this.localName) {
              node.wrapDeepInTwoChildNs(node.type, this.rngNs, this.localName + ':');
            } else {
              node.wrapDeepInTwoChildNs(node.type);
            }
            return parent;
          }
        }, ['choice', 'group', 'interleave']);
      },
      step_22: function() {
        this.traverse(function step_22_mixed(node) {
          var interleave = this.createElement('interleave');
          forEach(node.childElements(), (function(cNode) {
            interleave.addChild(cNode.clone());
          }));
          interleave.addChild(this.createElement('text'));
          node.replaceNode(interleave);
          return interleave;
        }, 'mixed');
      },
      step_23: function() {
        this.traverse(function step_23_optional(node) {
          var choice = this.createElement('choice');
          forEach(node.childElements(), (function(cNode) {
            choice.addChild(cNode.clone());
          }));
          choice.addChild(this.createElement('empty'));
          node.replaceNode(choice);
          return choice;
        }, 'optional');
      },
      step_24: function() {
        this.traverse(function step_24_zeroOrMore(node) {
          var choice = this.createElement('choice'),
              oneOrMore = this.createElement('oneOrMore');
          forEach(node.childElements(), (function(cNode) {
            oneOrMore.addChild(cNode.clone());
          }));
          choice.addChild(oneOrMore);
          choice.addChild(this.createElement('empty'));
          node.replaceNode(choice);
          return choice;
        }, 'zeroOrMore');
      },
      step_25: function() {
        var nodes = [],
            allowed = ['interleave', 'choice'],
            item,
            node,
            wrap;
        this.traverse(function step_25_combine(node) {
          var obj,
              name,
              combine;
          if (node.hasAttribute("combine")) {
            combine = node.getAttribute("combine");
            if (allowed.indexOf(combine) === -1) {
              throw new NgError('invalid combine value on node: {0}, allowed are "{1}"', node.toXML(), allowed.join(','));
            }
            name = node.getAttribute("name");
            obj = query(nodes, name, node.type);
            if (obj) {
              if (obj.combine !== combine) {
                throw new NgError('nodes with same name must have same combine attribute: {0}, {1}', node.toXML(), obj.node.toXML());
              }
              if (obj.combineWith.indexOf(node) === -1) {
                obj.combineWith.push(node);
              }
            } else {
              nodes.push({
                name: name,
                type: node.type,
                combine: combine,
                node: node,
                combineWith: []
              });
            }
          }
        }, ['define', 'start']);
        while (item = nodes.shift()) {
          node = item.node;
          node.removeAttribute('combine');
          if (item.combineWith.length === 0) {
            continue;
          }
          wrap = this.createElement(item.combine);
          node.wrapChildren(wrap);
          item.combineWith.forEach((function(cNode) {
            wrap.addChild(cNode);
            cNode.unwrap();
          }));
          clean(item);
        }
        this.step_21();
        this.step_20();
        function query(obj, name, type) {
          return obj.filter((function(item) {
            return item.name === name && item.type === type;
          })).shift();
        }
      },
      step_26: function() {
        this.traverse(function step_26_parentRef(node) {
          var parent = node.parentNode(),
              ref = this.createElement('ref');
          ref.setAttribute('name', node.getAttribute('name'));
          node.replaceNode(ref);
          return parent;
        }, 'parentRef');
      },
      step_27: function() {
        var nodes = [];
        this.traverse(function step_27_define_replace_ref(node) {
          var parent = node.parentNode(),
              fc = node.firstElementChild();
          if (!this.matchNode(fc, 'element')) {
            nodes.push(node.clone());
            node.remove();
            return parent;
          }
        }, 'define');
        this.traverse(function findRefs(cNode) {
          var cName = cNode.getAttribute('name'),
              clone,
              cPnode,
              found;
          found = nodes.filter(function filter(iNode) {
            return iNode.getAttribute("name") === cName;
          }).shift();
          if (found) {
            cPnode = cNode.parentNode();
            clone = found.clone();
            cNode.replaceNode(clone);
            clone.unwrap();
            return cPnode;
          }
        }, 'ref');
        nodes.forEach(function destory_clones(node) {
          node.destroy();
        });
        nodes = null;
      },
      step_28: function() {
        this.traverse(function step_28_cleanup(node) {
          var fc,
              lc,
              parent;
          if (node.getChildElementCount() === 2) {
            parent = node.parentNode();
            fc = node.firstElementChild();
            lc = node.lastElementChild();
            if (fc.is('empty', this.localName) && lc.is('empty', this.localName)) {
              node.replaceNode(this.createElement('empty'));
              return parent;
            }
          } else {
            throw new NgError('invalid node number on element type {0} expected 2, number of nodes is: {1}', node.type, node.getChildElementCount());
          }
        }, ['group', 'interleave', 'choice']);
      },
      step_29: function() {
        this.traverse(function step_29_cleanup(node) {
          var fc,
              parent;
          if (node.getChildElementCount() === 1) {
            parent = node.parentNode();
            fc = node.firstElementChild();
            if (fc.is('empty', this.localName)) {
              node.replaceNode(this.createElement('empty'));
              return parent;
            }
          } else {
            throw new NgError('invalid node number on element type {0} expected 1, number of nodes is: {1}', node.type, node.getChildElementCount());
          }
        }, 'oneOrMore');
      },
      step_30: function() {
        this.traverse(function step_28_cleanup(node) {
          var fc,
              lc,
              parent;
          if (node.getChildElementCount() === 2) {
            parent = node.parentNode();
            fc = node.firstElementChild();
            lc = node.lastElementChild();
            if (fc.is('empty', this.localName)) {
              node.replaceNode(lc.clone());
              return parent;
            } else if (lc.is('empty', this.localName)) {
              node.replaceNode(fc.clone());
              return parent;
            }
          } else {
            throw new NgError('invalid node number on element type {0} expected 2, number of nodes is: {1}', node.type, node.getChildElementCount());
          }
        }, 'group');
      },
      simplify: function() {
        this.step_1();
        this.step_2();
        this.step_3();
        this.step_4();
        this.step_5();
        this.step_6();
        this.step_7();
        this.step_8();
        this.step_9();
        this.step_10();
        this.step_11();
        this.step_12();
        this.step_13();
        this.step_14();
        this.step_15();
        this.step_16();
        this.step_17();
        this.step_18();
        this.step_19();
        this.step_20();
        this.step_21();
        this.step_22();
        this.step_23();
        this.step_24();
        this.step_25();
        this.step_26();
        this.step_27();
        this.step_28();
        this.step_29();
        this.step_30();
      },
      isAnnotation: function(node) {
        return this.localName !== node.typePrefix;
      },
      matchNode: function(node, match) {
        if (match && node) {
          if (!node.isDocumentNode() && !node.isTextNode() && this.localName && this.isAnnotation(node)) {
            return false;
          } else if (isArray(match) && match.indexOf(node.type) === -1) {
            return false;
          } else if (isString(match) && match !== node.type) {
            return false;
          }
          return true;
        }
        return false;
      },
      traverseAll: function(callback, match) {
        var $__17 = $traceurRuntime.initGeneratorFunction(gen);
        var result;
        try {
          if (!isFunction(callback)) {
            throw new NgError('callback is not function');
          }
          var $__13 = true;
          var $__14 = false;
          var $__15 = undefined;
          try {
            for (var $__11 = void 0,
                $__10 = (gen(this.schema))[$traceurRuntime.toProperty(Symbol.iterator)](); !($__13 = ($__11 = $__10.next()).done); $__13 = true) {
              var node = $__11.value;
              {
                if (match) {
                  if (this.matchNode(node, match)) {
                    result = callback.call(this, node);
                  }
                } else {
                  result = callback.call(this, node);
                }
              }
            }
          } catch ($__16) {
            $__14 = true;
            $__15 = $__16;
          } finally {
            try {
              if (!$__13 && $__10.return != null) {
                $__10.return();
              }
            } finally {
              if ($__14) {
                throw $__15;
              }
            }
          }
        } catch (e) {
          throw new NgError('NgSchema traverse: ' + e.message, callback.toString(), e.stack ? e.stack.toString() : e.toString());
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
                  $ctx.state = (node.firstChild() && !skip) ? 5 : 18;
                  break;
                case 5:
                  node = node.firstChild();
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
                  $ctx.state = (node.nextSibling()) ? 11 : 17;
                  break;
                case 11:
                  node = node.nextSibling();
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
                  $ctx.state = (node.parentNode()) ? 15 : -2;
                  break;
                case 15:
                  node = node.parentNode();
                  skip = true;
                  $ctx.state = 24;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__17, this);
        }
      },
      traverse: function(callback, match) {
        var $__17 = $traceurRuntime.initGeneratorFunction(gen);
        var result;
        try {
          if (!isFunction(callback)) {
            throw new NgError('callback is not function');
          }
          var $__13 = true;
          var $__14 = false;
          var $__15 = undefined;
          try {
            for (var $__11 = void 0,
                $__10 = (gen(this.schema))[$traceurRuntime.toProperty(Symbol.iterator)](); !($__13 = ($__11 = $__10.next()).done); $__13 = true) {
              var node = $__11.value;
              {
                if (match) {
                  if (this.matchNode(node, match)) {
                    result = callback.call(this, node);
                  }
                } else {
                  result = callback.call(this, node);
                }
              }
            }
          } catch ($__16) {
            $__14 = true;
            $__15 = $__16;
          } finally {
            try {
              if (!$__13 && $__10.return != null) {
                $__10.return();
              }
            } finally {
              if ($__14) {
                throw $__15;
              }
            }
          }
        } catch (e) {
          throw new NgError('NgSchema traverse: ' + e.message, callback.toString(), e.stack ? e.stack.toString() : e.toString());
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
                  $ctx.state = (node.firstElementChild() && !skip) ? 5 : 18;
                  break;
                case 5:
                  node = node.firstElementChild();
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
                  $ctx.state = (node.nextElementSibling()) ? 11 : 17;
                  break;
                case 11:
                  node = node.nextElementSibling();
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
                  $ctx.state = (node.parentNode()) ? 15 : -2;
                  break;
                case 15:
                  node = node.parentNode();
                  skip = true;
                  $ctx.state = 24;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__17, this);
        }
      },
      createElement: function(element) {
        if (this.localName) {
          return this.schema.createElementNs(this.rngNs, this.localName + ':' + element);
        }
        return this.schema.createElement(element);
      },
      querySelectorAll: function(selector) {
        var $__8 = this;
        if (this.localName) {
          return this.schema.querySelectorAll(selector).filter((function(item) {
            return item.typePrefix === $__8.localName;
          }));
        }
        return this.schema.querySelectorAll(selector);
      },
      querySelector: function(selector) {
        var node = this.schema.querySelector(selector);
        if (this.localName && node) {
          if (node.typePrefix !== this.localName) {
            return null;
          }
        }
        return node;
      },
      toXML: function(prettyPrint) {
        var complex = arguments[1] !== (void 0) ? arguments[1] : false;
        var schema = this.schema,
            clone;
        if (complex) {
          schema = this.complex;
        }
        if (prettyPrint) {
          clone = new NgSchema(removeWhiteSpace(schema.clone().node));
          clone.step_8();
          clone.traverse(function prettifyTraverse(node) {
            var count = getNodeDeepLevel(node),
                parent = node.parentNode(),
                space;
            if (!parent.isDocumentNode()) {
              space = createWhiteSpace(count);
              parent.insertBefore(node.createTextNode("\u000A"), node);
              parent.insertBefore(node.createTextNode(space), node);
              if (node.hasChildElements()) {
                node.addChild(node.createTextNode("\u000A" + space), node);
              }
            } else {
              node.addChild(node.createTextNode("\u000A"), node);
            }
          });
          schema = clone.schema;
        }
        if (schema.isDocumentNode()) {
          return toXML(schema.node);
        }
        return false;
        function createWhiteSpace(indent) {
          var str = "";
          while (indent > 0) {
            str += "\u0009";
            --indent;
          }
          return str;
        }
        function getNodeDeepLevel(node, count) {
          var counter = count || 0;
          if (node && node.parentNode() && !node.isDocumentNode()) {
            return getNodeDeepLevel(node.parentNode(), ++counter);
          }
          return counter;
        }
      },
      destroy: function() {
        if (this.schema) {
          this.schema.destroy();
        }
        if (this.complex) {
          this.complex.destroy();
        }
        clean(this);
      },
      clone: function() {
        try {
          return new NgSchema(this.schema.clone().node, this.config);
        } catch (e) {
          new NgError('Error in cloning schema', e);
        }
        return false;
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgSchema() {
      return NgSchema;
    },
    __esModule: true
  };
});

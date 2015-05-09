define(["./ng-class", "./ng-error", "./ng-context", "./ng-schema", "./ng-reference", "./ng-element", "./ng-attribute", "./ng-any-name-except", "./ng-ns-name-except", "./ng-any-name", "./ng-ns-name", "./ng-name", "./ng-choice", "./ng-interleave", "./ng-group", "./ng-one-or-more", "./ng-name-class-choice", "./ng-list", "./ng-text", "./ng-not-allowed", "./ng-empty", "./ng-param", "./ng-data", "./ng-data-except", "./ng-data-type", "./ng-value", "../core"], function($__0,$__2,$__4,$__6,$__8,$__10,$__12,$__14,$__16,$__18,$__20,$__22,$__24,$__26,$__28,$__30,$__32,$__34,$__36,$__38,$__40,$__42,$__44,$__46,$__48,$__50,$__52) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  if (!$__8 || !$__8.__esModule)
    $__8 = {default: $__8};
  if (!$__10 || !$__10.__esModule)
    $__10 = {default: $__10};
  if (!$__12 || !$__12.__esModule)
    $__12 = {default: $__12};
  if (!$__14 || !$__14.__esModule)
    $__14 = {default: $__14};
  if (!$__16 || !$__16.__esModule)
    $__16 = {default: $__16};
  if (!$__18 || !$__18.__esModule)
    $__18 = {default: $__18};
  if (!$__20 || !$__20.__esModule)
    $__20 = {default: $__20};
  if (!$__22 || !$__22.__esModule)
    $__22 = {default: $__22};
  if (!$__24 || !$__24.__esModule)
    $__24 = {default: $__24};
  if (!$__26 || !$__26.__esModule)
    $__26 = {default: $__26};
  if (!$__28 || !$__28.__esModule)
    $__28 = {default: $__28};
  if (!$__30 || !$__30.__esModule)
    $__30 = {default: $__30};
  if (!$__32 || !$__32.__esModule)
    $__32 = {default: $__32};
  if (!$__34 || !$__34.__esModule)
    $__34 = {default: $__34};
  if (!$__36 || !$__36.__esModule)
    $__36 = {default: $__36};
  if (!$__38 || !$__38.__esModule)
    $__38 = {default: $__38};
  if (!$__40 || !$__40.__esModule)
    $__40 = {default: $__40};
  if (!$__42 || !$__42.__esModule)
    $__42 = {default: $__42};
  if (!$__44 || !$__44.__esModule)
    $__44 = {default: $__44};
  if (!$__46 || !$__46.__esModule)
    $__46 = {default: $__46};
  if (!$__48 || !$__48.__esModule)
    $__48 = {default: $__48};
  if (!$__50 || !$__50.__esModule)
    $__50 = {default: $__50};
  if (!$__52 || !$__52.__esModule)
    $__52 = {default: $__52};
  var NgClass = $__0.NgClass;
  var NgError = $__2.NgError;
  var NgContext = $__4.NgContext;
  var NgSchema = $__6.NgSchema;
  var NgReference = $__8.NgReference;
  var NgElement = $__10.NgElement;
  var NgAttribute = $__12.NgAttribute;
  var NgAnyNameExcept = $__14.NgAnyNameExcept;
  var NgNsNameExcept = $__16.NgNsNameExcept;
  var NgAnyName = $__18.NgAnyName;
  var NgNsName = $__20.NgNsName;
  var NgName = $__22.NgName;
  var NgChoice = $__24.NgChoice;
  var NgInterLeave = $__26.NgInterLeave;
  var NgGroup = $__28.NgGroup;
  var NgOneOrMore = $__30.NgOneOrMore;
  var NgNameClassChoice = $__32.NgNameClassChoice;
  var NgList = $__34.NgList;
  var NgText = $__36.NgText;
  var NgNotAllowed = $__38.NgNotAllowed;
  var NgEmpty = $__40.NgEmpty;
  var NgParam = $__42.NgParam;
  var NgData = $__44.NgData;
  var NgDataExcept = $__46.NgDataExcept;
  var NgDataType = $__48.NgDataType;
  var NgValue = $__50.NgValue;
  var $__53 = $__52,
      isObject = $__53.isObject,
      isArray = $__53.isArray,
      isConstructor = $__53.isConstructor,
      copy = $__53.copy;
  var NgPattern = (function($__super) {
    function NgPattern(schema) {
      var createPattern = arguments[1] !== (void 0) ? arguments[1] : true;
      var element;
      $traceurRuntime.superConstructor(NgPattern).call(this, NgPattern);
      this.className = 'NgPattern';
      this.context = new NgContext();
      this.schemaInstance = null;
      this.pattern = null;
      this.refCache = [];
      if (schema instanceof NgSchema) {
        this.schemaInstance = schema;
      } else {
        throw new NgError('schema object is not valid schema instance it must be NgSchema');
      }
      element = this.schemaInstance.querySelector('start').firstElementChild();
      if (!element) {
        throw new NgError('No valid start element provided');
      }
      if (createPattern) {
        this.pattern = this.getDefinition(element, this.context);
      }
    }
    return ($traceurRuntime.createClass)(NgPattern, {
      getPattern: function() {
        return this.clone().pattern;
      },
      clone: function() {
        var clone = new NgPattern(this.schemaInstance, false);
        if (!clone.pattern && this.pattern) {
          clone.pattern = copy(this.pattern);
        }
        return clone;
      },
      ref: function(node, context) {
        var $__54 = this;
        var name,
            define,
            pattern,
            created;
        name = node.getAttribute('name');
        define = this.schemaInstance.querySelector('define[name="' + name + '"]');
        pattern = this.refCache.find((function(item) {
          return item.name === name;
        }));
        if (pattern) {
          return new NgReference(name, (function() {
            var ref = $__54.refCache.find((function(item) {
              return item.name === name;
            }));
            if (!ref || !ref.pattern) {
              throw new NgError("No reference found {0}, {1}", name, ref);
            }
            return ref.pattern;
          }));
        }
        created = {
          name: name,
          pattern: null
        };
        this.refCache.push(created);
        pattern = this.getDefinition(define, new NgContext(context.uri));
        created.pattern = pattern;
        return pattern;
      },
      element: function(node, context) {
        var fc,
            si,
            p1,
            p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        return new NgElement(p1, p2);
      },
      attribute: function(node, context) {
        var fc,
            si,
            p1,
            p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        return new NgAttribute(p1, p2);
      },
      except: function(node, context) {
        var pattern = this.getDefinition(node.firstElementChild(), context),
            parent = node.parentNode();
        switch (parent.type) {
          case 'anyName':
            return new NgAnyNameExcept(pattern);
            break;
          case 'nsName':
            return new NgNsNameExcept(parent.getAttribute('ns'), pattern);
            break;
          case 'data':
            return pattern;
            break;
        }
        throw new NgError('excepted valid pattern at node "{0}"', node.toXML());
      },
      define: function(node, context) {
        return this.getDefinition(node.firstElementChild(), context);
      },
      anyName: function(node, context) {
        if (node.hasChildElements()) {
          return this.getDefinition(node.firstElementChild(), context);
        }
        return new NgAnyName();
      },
      nsName: function(node, context) {
        if (node.hasChildElements()) {
          return this.getDefinition(node.firstElementChild(), context);
        }
        return new NgNsName(node.getAttribute('ns'));
      },
      name: function(node) {
        return new NgName(node.getAttribute('ns'), node.textContent());
      },
      choice: function(node, context) {
        var fc,
            si,
            p1,
            p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        if (this.isNameClassChoice(node)) {
          return new NgNameClassChoice(p1, p2);
        }
        return new NgChoice(p1, p2);
      },
      isNameClassChoice: function(node) {
        var $__63 = $traceurRuntime.initGeneratorFunction(gen);
        var $__59 = true;
        var $__60 = false;
        var $__61 = undefined;
        try {
          for (var $__57 = void 0,
              $__56 = (gen(node.parentNode()))[$traceurRuntime.toProperty(Symbol.iterator)](); !($__59 = ($__57 = $__56.next()).done); $__59 = true) {
            var parent = $__57.value;
            {
              if (parent.is(['anyName', 'nsName', 'name'])) {
                return true;
              } else if (parent.is(['element', 'attribute'])) {
                return false;
              }
            }
          }
        } catch ($__62) {
          $__60 = true;
          $__61 = $__62;
        } finally {
          try {
            if (!$__59 && $__56.return != null) {
              $__56.return();
            }
          } finally {
            if ($__60) {
              throw $__61;
            }
          }
        }
        function gen(node) {
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $ctx.state = (node) ? 7 : -2;
                  break;
                case 7:
                  $ctx.state = (node.isDocumentNode()) ? -2 : 3;
                  break;
                case 3:
                  $ctx.state = 4;
                  return node;
                case 4:
                  $ctx.maybeThrow();
                  $ctx.state = 2;
                  break;
                case 2:
                  node = node.parentNode();
                  $ctx.state = 0;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__63, this);
        }
      },
      group: function(node, context) {
        var fc,
            si,
            p1,
            p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        return new NgGroup(p1, p2);
      },
      interleave: function(node, context) {
        var fc,
            si,
            p1,
            p2;
        fc = node.firstElementChild();
        p1 = this.getDefinition(fc, context);
        si = fc.nextElementSibling();
        p2 = this.getDefinition(si, context);
        return new NgInterLeave(p1, p2);
      },
      oneOrMore: function(node, context) {
        var p = this.getDefinition(node.firstElementChild(), context);
        return new NgOneOrMore(p);
      },
      list: function(node, context) {
        var p = this.getDefinition(node.firstElementChild(), context);
        return new NgList(p);
      },
      param: function(node) {
        return new NgParam(node.getAttribute('name'), node.textContent());
      },
      namespace: function(node, context) {
        var ctx = new NgContext(),
            ns = node.getAttribute('xmlns');
        Object.assign(ctx, context);
        if (ns) {
          ctx.map.push(ns);
        }
        return ctx;
      },
      value: function(node, context) {
        return new NgValue(this.datatype(node), node.textContent(), this.namespace(node, context));
      },
      datatype: function(node) {
        var att1,
            att2;
        att1 = node.getAttribute('datatypeLibrary');
        att2 = node.getAttribute('type');
        return new NgDataType(att1, att2);
      },
      data: function(node, context) {
        var $__63 = $traceurRuntime.initGeneratorFunction(gen);
        var paramList = [],
            except;
        var $__59 = true;
        var $__60 = false;
        var $__61 = undefined;
        try {
          for (var $__57 = void 0,
              $__56 = (gen(node.firstElementChild()))[$traceurRuntime.toProperty(Symbol.iterator)](); !($__59 = ($__57 = $__56.next()).done); $__59 = true) {
            var cNode = $__57.value;
            {
              if (cNode.is('except')) {
                except = this.getDefinition(cNode, context);
              } else {
                paramList.push(this.getDefinition(cNode, context));
              }
            }
          }
        } catch ($__62) {
          $__60 = true;
          $__61 = $__62;
        } finally {
          try {
            if (!$__59 && $__56.return != null) {
              $__56.return();
            }
          } finally {
            if ($__60) {
              throw $__61;
            }
          }
        }
        if (except) {
          return new NgDataExcept(this.datatype(node), paramList, except);
        }
        return new NgData(this.datatype(node), paramList);
        function gen(node) {
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $ctx.state = (node) ? 1 : -2;
                  break;
                case 1:
                  $ctx.state = 2;
                  return node;
                case 2:
                  $ctx.maybeThrow();
                  $ctx.state = 4;
                  break;
                case 4:
                  node = node.nextElementSibling();
                  $ctx.state = 0;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__63, this);
        }
      },
      getDefinition: function(node, context) {
        var nodeLiteral;
        switch (node.type) {
          case 'define':
            return this.define(node, context);
          case 'ref':
            return this.ref(node, context);
          case 'element':
            return this.element(node, context);
          case 'attribute':
            return this.attribute(node, context);
          case 'except':
            return this.except(node, context);
          case 'anyName':
            return this.anyName(node, context);
          case 'nsName':
            return this.nsName(node, context);
          case 'name':
            return this.name(node);
          case 'choice':
            return this.choice(node, context);
          case 'interleave':
            return this.interleave(node, context);
          case 'group':
            return this.group(node, context);
          case 'oneOrMore':
            return this.oneOrMore(node, context);
          case 'list':
            return this.list(node, context);
          case 'param':
            return this.param(node);
          case 'value':
            return this.value(node, context);
          case 'data':
            return this.data(node, context);
          case 'text':
            return new NgText();
          case 'notAllowed':
            return new NgNotAllowed();
          case 'empty':
            return new NgEmpty();
        }
        nodeLiteral = node.toXML();
        throw new NgError(("No valid node provided, pattern is not recognized\n        or schema is not simplified correctly, current node: " + nodeLiteral));
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgPattern() {
      return NgPattern;
    },
    __esModule: true
  };
});

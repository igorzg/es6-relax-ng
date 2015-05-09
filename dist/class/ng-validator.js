define(["./ng-class", "./ng-pattern", "./ng-not-allowed", "./ng-empty", "./ng-choice", "./ng-interleave", "./ng-group", "./ng-qname", "./ng-one-or-more", "./ng-attribute-node", "./ng-attribute-error", "./ng-error", "./ng-dom", "./ng-context", "./ng-after", "./ng-validator-errors", "../core"], function($__0,$__2,$__4,$__6,$__8,$__10,$__12,$__14,$__16,$__18,$__20,$__22,$__24,$__26,$__28,$__30,$__32) {
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
  var NgClass = $__0.NgClass;
  var NgPattern = $__2.NgPattern;
  var NgNotAllowed = $__4.NgNotAllowed;
  var NgEmpty = $__6.NgEmpty;
  var NgChoice = $__8.NgChoice;
  var NgInterLeave = $__10.NgInterLeave;
  var NgGroup = $__12.NgGroup;
  var NgQName = $__14.NgQName;
  var NgOneOrMore = $__16.NgOneOrMore;
  var NgAttributeNode = $__18.NgAttributeNode;
  var $__21 = $__20,
      NgAttributeInvalidValueError = $__21.NgAttributeInvalidValueError,
      NgAttributeMissingValueError = $__21.NgAttributeMissingValueError;
  var NgError = $__22.NgError;
  var NgDOM = $__24.NgDOM;
  var NgContext = $__26.NgContext;
  var NgAfter = $__28.NgAfter;
  var $__31 = $__30,
      NgValidatorContainsError = $__31.NgValidatorContainsError,
      NgValidatorNullableError = $__31.NgValidatorNullableError,
      NgValidatorEndTagDerivError = $__31.NgValidatorEndTagDerivError,
      NgValidatorApplyAfterError = $__31.NgValidatorApplyAfterError,
      NgValidatorTextDerivNotAllowedError = $__31.NgValidatorTextDerivNotAllowedError,
      NgValidatorAttDerivError = $__31.NgValidatorAttDerivError,
      NgDataTypeError = $__31.NgDataTypeError,
      NgDataTypeEqualityError = $__31.NgDataTypeEqualityError,
      NgValidatorStartTagOpenDerivNgEmptyError = $__31.NgValidatorStartTagOpenDerivNgEmptyError,
      NgValidatorStartTagOpenDerivError = $__31.NgValidatorStartTagOpenDerivError,
      NgValidatorTextDerivError = $__31.NgValidatorTextDerivError;
  var $__33 = $__32,
      isObject = $__33.isObject,
      forEach = $__33.forEach;
  var WHITE_SPACE_RGX = /[^\t\n\r ]/;
  var XMLNS_URI = "http://www.w3.org/2000/xmlns/";
  var NS = "xmlns";
  var NgValidator = (function($__super) {
    function NgValidator(pattern) {
      var datatypeLibrary = arguments[1] !== (void 0) ? arguments[1] : null;
      $traceurRuntime.superConstructor(NgValidator).call(this, NgValidator);
      if (pattern instanceof NgPattern) {
        this.patternInstance = pattern;
      } else {
        throw new NgError('pattern is not instanceof NgPattern');
      }
      this.datatypeLibrary = datatypeLibrary;
    }
    return ($traceurRuntime.createClass)(NgValidator, {
      qName: function(node) {
        var value = "";
        forEach(node.getNamespaces(), (function(ns) {
          if ((ns.prefix === NS && ns.localName === node.typePrefix) || (ns.name === NS && !ns.prefix)) {
            value = ns.value;
          }
        }));
        return new NgQName(value, node.type);
      },
      isWhitespace: function(str) {
        return !(WHITE_SPACE_RGX.test(str));
      },
      normalizeWhitespace: function(str) {
        return str.split(/\s+/).join(" ");
      },
      strip: function(node) {
        if (node.isCommentNode()) {
          return true;
        } else if (node.isTextNode()) {
          return this.isWhitespace(node.getValue());
        }
        return false;
      },
      contains: function(nameClass, qName) {
        switch (nameClass.className) {
          case 'NgAnyName':
          case 'NgAnyNameExcept':
          case 'NgNsName':
          case 'NgNsNameExcept':
          case 'NgName':
          case 'NgNameClassChoice':
            return nameClass.contains.call(this, nameClass, qName);
          default:
            return new NgValidatorContainsError(nameClass, qName);
        }
      },
      nullable: function(pattern) {
        switch (pattern.className) {
          case 'NgGroup':
          case 'NgInterLeave':
            return this.nullable(pattern.pattern1) && this.nullable(pattern.pattern2);
          case 'NgChoice':
            return this.nullable(pattern.pattern1) || this.nullable(pattern.pattern2);
          case 'NgOneOrMore':
            return this.nullable(pattern.pattern);
          case 'NgElement':
          case 'NgAttribute':
          case 'NgList':
          case 'NgValue':
          case 'NgData':
          case 'NgDataExcept':
          case 'NgAfter':
          case 'NgNotAllowed':
            return false;
          case 'NgEmpty':
          case 'NgText':
            return true;
          default:
            return new NgValidatorNullableError(pattern);
        }
      },
      choice: function(pattern1, pattern2) {
        if (pattern2.className === 'NgNotAllowed') {
          return pattern1;
        } else if (pattern1.className === 'NgNotAllowed') {
          return pattern2;
        } else if (pattern1.className === 'NgEmpty' && pattern2.className === 'NgEmpty') {
          return new NgEmpty();
        }
        return new NgChoice(pattern1, pattern2);
      },
      group: function(pattern1, pattern2) {
        if (pattern1.className === 'NgNotAllowed') {
          return pattern1;
        } else if (pattern2.className === 'NgNotAllowed') {
          return pattern2;
        } else if (pattern2.className === 'NgEmpty') {
          return pattern1;
        } else if (pattern1.className === 'NgEmpty') {
          return pattern2;
        }
        return new NgGroup(pattern1, pattern2);
      },
      interleave: function(pattern1, pattern2) {
        if (pattern1.className === 'NgNotAllowed') {
          return pattern1;
        } else if (pattern2.className === 'NgNotAllowed') {
          return pattern2;
        } else if (pattern2.className === 'NgEmpty') {
          return pattern1;
        } else if (pattern1.className === 'NgEmpty') {
          return pattern2;
        }
        return new NgInterLeave(pattern1, pattern2);
      },
      after: function(pattern1, pattern2) {
        if (pattern2.className === 'NgNotAllowed') {
          return pattern2;
        } else if (pattern1.className === 'NgNotAllowed') {
          return pattern1;
        }
        return new NgAfter(pattern1, pattern2);
      },
      oneOrMore: function(pattern) {
        switch (pattern.className) {
          case 'NgNotAllowed':
            return pattern;
          default:
            return new NgOneOrMore(pattern);
        }
      },
      endTagDeriv: function(pattern, node) {
        switch (pattern.className) {
          case 'NgChoice':
          case 'NgAfter':
            return pattern.endTagDeriv.call(this, pattern, node);
          case 'NgNotAllowed':
            return pattern;
          default:
            return new NgValidatorEndTagDerivError(pattern, node);
        }
      },
      applyAfter: function(func, pattern) {
        switch (pattern.className) {
          case 'NgChoice':
          case 'NgAfter':
            return pattern.applyAfter.call(this, func, pattern);
          case 'NgNotAllowed':
            return pattern;
          default:
            return new NgValidatorApplyAfterError(func, pattern);
        }
      },
      listDeriv: function(context, pattern, strings, node) {
        var p;
        if (strings.length == 0) {
          return pattern;
        }
        p = this.textDeriv(context, pattern, strings.pop(), node);
        return this.listDeriv(context, p, strings);
      },
      textDeriv: function(context, pattern, string, node) {
        switch (pattern.className) {
          case 'NgChoice':
          case 'NgInterLeave':
          case 'NgGroup':
          case 'NgAfter':
          case 'NgOneOrMore':
          case 'NgText':
          case 'NgValue':
          case 'NgData':
          case 'NgDataExcept':
          case 'NgList':
          case 'NgReference':
            return pattern.textDeriv.call(this, context, pattern, string, node);
          case 'NgEmpty':
          case 'NgElement':
            return new NgValidatorTextDerivNotAllowedError(node, pattern);
          case 'NgNotAllowed':
            return pattern;
          default:
            return new NgValidatorTextDerivError(node, pattern);
        }
      },
      attDeriv: function(context, pattern, node) {
        switch (pattern.className) {
          case 'NgAfter':
          case 'NgChoice':
          case 'NgGroup':
          case 'NgInterLeave':
          case 'NgOneOrMore':
          case 'NgAttribute':
          case 'NgReference':
            return pattern.attDeriv.call(this, context, pattern, node);
          case 'NgNotAllowed':
            return pattern;
          default:
            return new NgValidatorAttDerivError(node, pattern);
        }
      },
      attsDeriv: function(context, pattern, attributes, node) {
        var attDeriv,
            attr;
        if (attributes.length === 0) {
          return pattern;
        }
        attr = attributes.shift();
        if (attr.namespaceURI === XMLNS_URI) {
          return this.attsDeriv(context, pattern, attributes, node);
        }
        attDeriv = this.attDeriv(context, pattern, new NgAttributeNode(attr, node));
        return this.attsDeriv(context, attDeriv, attributes, node);
      },
      valueMatch: function(context, pattern, string, node) {
        var p;
        if (this.nullable(pattern) && this.isWhitespace(string)) {
          return new NgEmpty();
        }
        p = this.textDeriv(context, pattern, string, node);
        if (this.nullable(p)) {
          return new NgEmpty();
        }
        return p;
      },
      datatypeAllows: function(datatype, paramList, string, context) {
        var locals = ["string", "token"];
        if (!datatype.uri || !this.datatypeLibrary) {
          if (locals.indexOf(datatype.localName) > -1 && paramList.length == 0) {
            return new NgEmpty();
          }
          return new NgDataTypeError(datatype, string, null);
        }
        try {
          return this.datatypeLibrary.datatypeAllows(datatype, paramList, string, context);
        } catch (e) {
          throw new NgError("datatypeLibrary don't have an datatypeAllows method");
        }
      },
      datatypeEqual: function(datatype, string1, context1, string2, context2) {
        var p1,
            p2;
        if (!datatype.uri || !this.datatypeLibrary) {
          if (datatype.localName === "string") {
            if (string1 === string2) {
              return new NgEmpty();
            }
            return new NgDataTypeEqualityError(datatype, string2, string1);
          } else if (datatype.localName === "token") {
            p1 = this.normalizeWhitespace(string1);
            p2 = this.normalizeWhitespace(string2);
            if (p1 === p2) {
              return new NgEmpty();
            }
            return new NgDataTypeEqualityError(datatype, string2, string1);
          }
          return new NgDataTypeError(datatype, string2, string1);
        }
        try {
          return this.datatypeLibrary.datatypeEqual(datatype, string1, context1, string2, context2);
        } catch (e) {
          throw new NgError("datatypeLibrary don't have an datatypeEqual method");
        }
      },
      startTagOpenDeriv: function(pattern, qName, node) {
        switch (pattern.className) {
          case 'NgEmpty':
            return new NgValidatorStartTagOpenDerivNgEmptyError(node, pattern, qName);
          case 'NgChoice':
          case 'NgElement':
          case 'NgInterLeave':
          case 'NgOneOrMore':
          case 'NgGroup':
          case 'NgReference':
          case 'NgAfter':
            return pattern.startTagOpenDeriv.call(this, pattern, qName, node);
          case 'NgNotAllowed':
            return pattern;
          default:
            return new NgValidatorStartTagOpenDerivError(node, pattern, qName);
        }
      },
      startTagCloseDeriv: function(pattern, node) {
        switch (pattern.className) {
          case 'NgReference':
          case 'NgAfter':
          case 'NgChoice':
          case 'NgGroup':
          case 'NgInterLeave':
          case 'NgOneOrMore':
            return pattern.startTagCloseDeriv.call(this, pattern, node);
          case 'NgAttribute':
            if (node.hasAttribute(pattern.nameClass.localName)) {
              return new NgAttributeInvalidValueError(node, pattern);
            } else {
              return new NgAttributeMissingValueError(node, pattern);
            }
          default:
            return pattern;
        }
      },
      childrenDeriv: function(context, pattern, children) {
        var p,
            cNode;
        if (children.length === 0) {
          return pattern;
        } else if (children.length === 1 && children[0].isTextNode()) {
          cNode = children.shift();
          p = this.childDeriv(context, pattern, cNode);
          if (this.isWhitespace(cNode.getValue())) {
            return this.choice(pattern, p);
          }
          return p;
        }
        return this.stripChildrenDeriv(context, pattern, children);
      },
      stripChildrenDeriv: function(context, pattern, children) {
        var cNode;
        if (children.length === 0) {
          return pattern;
        }
        cNode = children.shift();
        if (!this.strip(cNode)) {
          pattern = this.childDeriv(context, pattern, cNode);
        }
        return this.stripChildrenDeriv(context, pattern, children);
      },
      childDeriv: function(context, pattern, node) {
        var p1,
            p2,
            p3,
            p4;
        if (node.isTextNode()) {
          return this.textDeriv(context, pattern, node.getValue(), node);
        } else if (node.isElementNode()) {
          p1 = this.startTagOpenDeriv(pattern, this.qName(node), node);
          p2 = this.attsDeriv(node.getNamespaces(), p1, node.getAttributes(), node);
          p3 = this.startTagCloseDeriv(p2, node);
          p4 = this.childrenDeriv(node.getNamespaces(), p3, node.children());
          return this.endTagDeriv(p4, node);
        } else {
          throw new NgError('only text and element nodes are allowed in childDeriv', node);
        }
      },
      validate: function(node) {
        var pattern = arguments[1] !== (void 0) ? arguments[1] : null;
        if (!(node instanceof NgDOM)) {
          throw new NgError('node must be valid NgDOM instance');
        }
        if (node.isDocumentNode()) {
          node = node.firstElementChild();
        }
        if (!isObject(pattern)) {
          pattern = this.patternInstance.getPattern();
        }
        if (!pattern.context) {
          pattern.context = new NgContext();
        }
        return this.childDeriv(pattern.context, pattern, node);
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgValidator() {
      return NgValidator;
    },
    __esModule: true
  };
});

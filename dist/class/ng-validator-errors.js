define(["./ng-not-allowed"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgNotAllowed = $__0.NgNotAllowed;
  var NgValidatorContainsError = (function($__super) {
    function NgValidatorContainsError(nameClass, qName) {
      var message = "invalid pattern: -> schema pattern is not valid pattern in contains";
      $traceurRuntime.superConstructor(NgValidatorContainsError).call(this, message, null, nameClass);
      this.instanceOf(NgValidatorContainsError);
      this.qName = qName;
      this.errorClassName = 'NgValidatorContainsError';
    }
    return ($traceurRuntime.createClass)(NgValidatorContainsError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgValidatorNullableError = (function($__super) {
    function NgValidatorNullableError(pattern) {
      var message = "invalid pattern: -> schema pattern is not valid pattern in nullable";
      $traceurRuntime.superConstructor(NgValidatorNullableError).call(this, message, null, pattern);
      this.instanceOf(NgValidatorNullableError);
      this.errorClassName = 'NgValidatorNullableError';
    }
    return ($traceurRuntime.createClass)(NgValidatorNullableError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgValidatorEndTagDerivError = (function($__super) {
    function NgValidatorEndTagDerivError(pattern, node) {
      var message = "invalid pattern on endTagDeriv";
      $traceurRuntime.superConstructor(NgValidatorEndTagDerivError).call(this, message, node, pattern);
      this.instanceOf(NgValidatorEndTagDerivError);
      this.errorClassName = 'NgValidatorEndTagDerivError';
    }
    return ($traceurRuntime.createClass)(NgValidatorEndTagDerivError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgValidatorApplyAfterError = (function($__super) {
    function NgValidatorApplyAfterError(func, pattern) {
      var message = "invalid pattern on applyAfter";
      $traceurRuntime.superConstructor(NgValidatorApplyAfterError).call(this, message, null, pattern);
      this.instanceOf(NgValidatorApplyAfterError);
      this.func = func;
      this.errorClassName = 'NgValidatorApplyAfterError';
    }
    return ($traceurRuntime.createClass)(NgValidatorApplyAfterError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgValidatorTextDerivNotAllowedError = (function($__super) {
    function NgValidatorTextDerivNotAllowedError(node, pattern) {
      var message = ("not allowed to have pattern \"" + pattern.className + "\" at textDeriv");
      $traceurRuntime.superConstructor(NgValidatorTextDerivNotAllowedError).call(this, message, node, pattern);
      this.instanceOf(NgValidatorTextDerivNotAllowedError);
      this.errorClassName = 'NgValidatorTextDerivNotAllowedError';
    }
    return ($traceurRuntime.createClass)(NgValidatorTextDerivNotAllowedError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgValidatorTextDerivError = (function($__super) {
    function NgValidatorTextDerivError(node, pattern) {
      var message = "invalid pattern on textDeriv";
      $traceurRuntime.superConstructor(NgValidatorTextDerivError).call(this, message, node, pattern);
      this.instanceOf(NgValidatorTextDerivError);
      this.errorClassName = 'NgValidatorTextDerivError';
    }
    return ($traceurRuntime.createClass)(NgValidatorTextDerivError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgValidatorAttDerivError = (function($__super) {
    function NgValidatorAttDerivError(node, pattern) {
      var message = "invalid pattern at attrDeriv";
      $traceurRuntime.superConstructor(NgValidatorAttDerivError).call(this, message, node, pattern);
      this.instanceOf(NgValidatorAttDerivError);
      this.errorClassName = 'NgValidatorAttDerivError';
    }
    return ($traceurRuntime.createClass)(NgValidatorAttDerivError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgDataTypeError = (function($__super) {
    function NgDataTypeError(datatype, value, match) {
      var message = ("\"" + datatype.localName + "\" is not correct datatype allowed is string and token");
      $traceurRuntime.superConstructor(NgDataTypeError).call(this, message, null, null);
      this.instanceOf(NgDataTypeError);
      this.datatype = datatype;
      this.value = value;
      this.match = match;
      this.errorClassName = 'NgDataTypeError';
    }
    return ($traceurRuntime.createClass)(NgDataTypeError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgDataTypeEqualityError = (function($__super) {
    function NgDataTypeEqualityError(datatype, value, match) {
      var message = ("strings are not equals requested is: " + value + " , provided is: " + match);
      $traceurRuntime.superConstructor(NgDataTypeEqualityError).call(this, message, null, null);
      this.instanceOf(NgDataTypeEqualityError);
      this.datatype = datatype;
      this.value = value;
      this.match = match;
      this.errorClassName = 'NgDataTypeEqualityError';
    }
    return ($traceurRuntime.createClass)(NgDataTypeEqualityError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgValidatorStartTagOpenDerivNgEmptyError = (function($__super) {
    function NgValidatorStartTagOpenDerivNgEmptyError(node, pattern, qName) {
      var message = "invalid pattern NgEmpty on startTagOpenDeriv";
      $traceurRuntime.superConstructor(NgValidatorStartTagOpenDerivNgEmptyError).call(this, message, node, pattern);
      this.instanceOf(NgValidatorStartTagOpenDerivNgEmptyError);
      this.qName = qName;
      this.errorClassName = 'NgValidatorStartTagOpenDerivNgEmptyError';
    }
    return ($traceurRuntime.createClass)(NgValidatorStartTagOpenDerivNgEmptyError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgValidatorStartTagOpenDerivError = (function($__super) {
    function NgValidatorStartTagOpenDerivError(node, pattern, qName) {
      var message = ("node " + qName.localName + " is not allowed in here");
      $traceurRuntime.superConstructor(NgValidatorStartTagOpenDerivError).call(this, message, node, pattern);
      this.instanceOf(NgValidatorStartTagOpenDerivError);
      this.qName = qName;
      this.errorClassName = 'NgValidatorStartTagOpenDerivError';
    }
    return ($traceurRuntime.createClass)(NgValidatorStartTagOpenDerivError, {}, {}, $__super);
  }(NgNotAllowed));
  return {
    get NgValidatorContainsError() {
      return NgValidatorContainsError;
    },
    get NgValidatorNullableError() {
      return NgValidatorNullableError;
    },
    get NgValidatorEndTagDerivError() {
      return NgValidatorEndTagDerivError;
    },
    get NgValidatorApplyAfterError() {
      return NgValidatorApplyAfterError;
    },
    get NgValidatorTextDerivNotAllowedError() {
      return NgValidatorTextDerivNotAllowedError;
    },
    get NgValidatorTextDerivError() {
      return NgValidatorTextDerivError;
    },
    get NgValidatorAttDerivError() {
      return NgValidatorAttDerivError;
    },
    get NgDataTypeError() {
      return NgDataTypeError;
    },
    get NgDataTypeEqualityError() {
      return NgDataTypeEqualityError;
    },
    get NgValidatorStartTagOpenDerivNgEmptyError() {
      return NgValidatorStartTagOpenDerivNgEmptyError;
    },
    get NgValidatorStartTagOpenDerivError() {
      return NgValidatorStartTagOpenDerivError;
    },
    __esModule: true
  };
});

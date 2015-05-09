define(["./ng-not-allowed", "./ng-data-type", "../core"], function($__0,$__2,$__4) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var NgNotAllowed = $__0.NgNotAllowed;
  var NgDataType = $__2.NgDataType;
  var instanceOf = $__4.instanceOf;
  var NgDataExceptError = (function($__super) {
    function NgDataExceptError(node, pattern, ngNotAllowed) {
      var noExpectedValue = arguments[3] !== (void 0) ? arguments[3] : false;
      $traceurRuntime.superConstructor(NgDataExceptError).call(this, ngNotAllowed.message, node, pattern);
      if (instanceOf(ngNotAllowed.node, NgDataType)) {
        this.dataType = ngNotAllowed.node;
        this.dataTypePattern = ngNotAllowed.pattern;
      }
      this.instanceOf(NgDataExceptError);
      this.expected = !!noExpectedValue;
      this.errorClassName = 'NgDataExceptError';
    }
    return ($traceurRuntime.createClass)(NgDataExceptError, {}, {}, $__super);
  }(NgNotAllowed));
  return {
    get NgDataExceptError() {
      return NgDataExceptError;
    },
    __esModule: true
  };
});

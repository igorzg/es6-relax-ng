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
  var NgDataError = (function($__super) {
    function NgDataError(node, pattern, ngNotAllowed) {
      $traceurRuntime.superConstructor(NgDataError).call(this, ngNotAllowed.message, node, pattern);
      if (instanceOf(ngNotAllowed.node, NgDataType)) {
        this.dataType = ngNotAllowed.node;
        this.dataTypePattern = ngNotAllowed.pattern;
      }
      this.instanceOf(NgDataError);
      this.className = 'NgDataError';
    }
    return ($traceurRuntime.createClass)(NgDataError, {}, {}, $__super);
  }(NgNotAllowed));
  return {
    get NgDataError() {
      return NgDataError;
    },
    __esModule: true
  };
});

define(["./ng-not-allowed"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgNotAllowed = $__0.NgNotAllowed;
  var NgListError = (function($__super) {
    function NgListError(node, pattern, str) {
      var nodeLocal = node.toXML(),
          message = ("list invalid, \"" + str + "\" found  on \"" + nodeLocal + "\"");
      $traceurRuntime.superConstructor(NgListError).call(this, message, node, pattern);
      this.instanceOf(NgListError);
      this.errorClassName = 'NgListError';
    }
    return ($traceurRuntime.createClass)(NgListError, {}, {}, $__super);
  }(NgNotAllowed));
  return {
    get NgListError() {
      return NgListError;
    },
    __esModule: true
  };
});

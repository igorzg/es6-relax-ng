define(["./ng-not-allowed"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgNotAllowed = $__0.NgNotAllowed;
  var NgAfterError = (function($__super) {
    function NgAfterError(node, pattern) {
      var nodeLocal = node.toXML();
      $traceurRuntime.superConstructor(NgAfterError).call(this, ("Missing content at node: " + nodeLocal), node, pattern);
      this.instanceOf(NgAfterError);
      this.errorClassName = 'NgAfterError';
    }
    return ($traceurRuntime.createClass)(NgAfterError, {}, {}, $__super);
  }(NgNotAllowed));
  return {
    get NgAfterError() {
      return NgAfterError;
    },
    __esModule: true
  };
});

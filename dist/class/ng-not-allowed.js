define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgNotAllowed = (function($__super) {
    function NgNotAllowed(message, node, pattern) {
      $traceurRuntime.superConstructor(NgNotAllowed).call(this, NgNotAllowed);
      this.className = 'NgNotAllowed';
      this.message = message;
      this.node = node;
      this.pattern = pattern;
    }
    return ($traceurRuntime.createClass)(NgNotAllowed, {}, {}, $__super);
  }(NgClass));
  return {
    get NgNotAllowed() {
      return NgNotAllowed;
    },
    __esModule: true
  };
});

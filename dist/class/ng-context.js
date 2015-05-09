define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgContext = (function($__super) {
    function NgContext() {
      var uri = arguments[0] !== (void 0) ? arguments[0] : "";
      var map = arguments[1] !== (void 0) ? arguments[1] : [];
      $traceurRuntime.superConstructor(NgContext).call(this, NgContext);
      this.className = 'NgContext';
      this.uri = uri;
      this.map = map;
    }
    return ($traceurRuntime.createClass)(NgContext, {}, {}, $__super);
  }(NgClass));
  return {
    get NgContext() {
      return NgContext;
    },
    __esModule: true
  };
});

define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgAnyName = (function($__super) {
    function NgAnyName() {
      $traceurRuntime.superConstructor(NgAnyName).call(this, NgAnyName);
      this.className = 'NgAnyName';
    }
    return ($traceurRuntime.createClass)(NgAnyName, {contains: function() {
        return true;
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgAnyName() {
      return NgAnyName;
    },
    __esModule: true
  };
});

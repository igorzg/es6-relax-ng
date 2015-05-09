define(["./ng-error", "../core"], function($__0,$__2) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var NgError = $__0.NgError;
  var $__3 = $__2,
      isIE = $__3.isIE,
      getFunctionName = $__3.getFunctionName;
  var NgClass = (function() {
    function NgClass(Class) {
      this.instanceOf(Class);
    }
    return ($traceurRuntime.createClass)(NgClass, {instanceOf: function(Class) {
        var message;
        if (!(this instanceof Class)) {
          message = Class.toString();
          throw new NgError(("Class " + message + " is not instantiated"));
        }
      }}, {});
  }());
  return {
    get NgClass() {
      return NgClass;
    },
    __esModule: true
  };
});

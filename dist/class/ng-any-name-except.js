define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgAnyNameExcept = (function($__super) {
    function NgAnyNameExcept(nameClass) {
      $traceurRuntime.superConstructor(NgAnyNameExcept).call(this, NgAnyNameExcept);
      this.className = 'NgAnyNameExcept';
      this.nameClass = nameClass;
    }
    return ($traceurRuntime.createClass)(NgAnyNameExcept, {contains: function(nameClass, qName) {
        return !this.contains(nameClass.nameClass, qName);
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgAnyNameExcept() {
      return NgAnyNameExcept;
    },
    __esModule: true
  };
});

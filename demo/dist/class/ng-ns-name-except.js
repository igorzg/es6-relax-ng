define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgNsNameExcept = (function($__super) {
    function NgNsNameExcept(uri, nameClass) {
      $traceurRuntime.superConstructor(NgNsNameExcept).call(this, NgNsNameExcept);
      this.className = 'NgNsNameExcept';
      this.uri = uri;
      this.nameClass = nameClass;
    }
    return ($traceurRuntime.createClass)(NgNsNameExcept, {contains: function(nameClass, qName) {
        return nameClass.uri === qName.uri && !this.contains(nameClass.nameClass, qName);
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgNsNameExcept() {
      return NgNsNameExcept;
    },
    __esModule: true
  };
});

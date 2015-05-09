define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgNsName = (function($__super) {
    function NgNsName(uri) {
      $traceurRuntime.superConstructor(NgNsName).call(this, NgNsName);
      this.className = 'NgNsName';
      this.uri = uri;
    }
    return ($traceurRuntime.createClass)(NgNsName, {contains: function(nameClass, qName) {
        return nameClass.uri === qName.uri;
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgNsName() {
      return NgNsName;
    },
    __esModule: true
  };
});

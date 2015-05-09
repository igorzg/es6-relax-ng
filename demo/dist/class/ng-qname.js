define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgQName = (function($__super) {
    function NgQName(uri, localName) {
      $traceurRuntime.superConstructor(NgQName).call(this, NgQName);
      this.className = 'NgQName';
      this.uri = uri;
      this.localName = localName;
    }
    return ($traceurRuntime.createClass)(NgQName, {}, {}, $__super);
  }(NgClass));
  return {
    get NgQName() {
      return NgQName;
    },
    __esModule: true
  };
});

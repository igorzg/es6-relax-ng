define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgDataType = (function($__super) {
    function NgDataType(uri, localName) {
      $traceurRuntime.superConstructor(NgDataType).call(this, NgDataType);
      this.className = 'NgDataType';
      this.uri = uri;
      this.localName = localName;
    }
    return ($traceurRuntime.createClass)(NgDataType, {}, {}, $__super);
  }(NgClass));
  return {
    get NgDataType() {
      return NgDataType;
    },
    __esModule: true
  };
});

define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgParam = (function($__super) {
    function NgParam(localName, string) {
      $traceurRuntime.superConstructor(NgParam).call(this, NgParam);
      this.className = 'NgParam';
      this.localName = localName;
      this.string = string;
    }
    return ($traceurRuntime.createClass)(NgParam, {}, {}, $__super);
  }(NgClass));
  return {
    get NgParam() {
      return NgParam;
    },
    __esModule: true
  };
});

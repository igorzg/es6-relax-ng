define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgText = (function($__super) {
    function NgText() {
      $traceurRuntime.superConstructor(NgText).call(this, NgText);
      this.className = 'NgText';
    }
    return ($traceurRuntime.createClass)(NgText, {textDeriv: function(context, pattern, string, node) {
        return pattern;
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgText() {
      return NgText;
    },
    __esModule: true
  };
});

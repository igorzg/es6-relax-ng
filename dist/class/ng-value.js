define(["./ng-class", "./ng-not-allowed"], function($__0,$__2) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var NgClass = $__0.NgClass;
  var NgNotAllowed = $__2.NgNotAllowed;
  var NgValue = (function($__super) {
    function NgValue(datatype, string, context) {
      $traceurRuntime.superConstructor(NgValue).call(this, NgValue);
      this.className = 'NgValue';
      this.datatype = datatype;
      this.string = string;
      this.context = context;
    }
    return ($traceurRuntime.createClass)(NgValue, {textDeriv: function(context, pattern, str, node) {
        var p = this.datatypeEqual(pattern.datatype, pattern.string, pattern.context, str, context);
        if (p instanceof NgNotAllowed) {
          p.node = node;
          p.pattern = pattern;
        }
        return p;
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgValue() {
      return NgValue;
    },
    __esModule: true
  };
});

define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var ApplyFlip = (function($__super) {
    function ApplyFlip(func, arg2, context, reverse) {
      $traceurRuntime.superConstructor(ApplyFlip).call(this, ApplyFlip);
      this.className = 'ApplyFlip';
      this.func = func;
      this.arg2 = arg2;
      this.context = context;
      this.reverse = !!reverse;
    }
    return ($traceurRuntime.createClass)(ApplyFlip, {invoke: function(arg1) {
        if (this.reverse) {
          return this.context[this.func](this.arg2, arg1);
        } else {
          return this.context[this.func](arg1, this.arg2);
        }
      }}, {}, $__super);
  }(NgClass));
  return {
    get ApplyFlip() {
      return ApplyFlip;
    },
    __esModule: true
  };
});

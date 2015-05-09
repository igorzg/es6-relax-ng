define(["./ng-class", "./ng-empty", "./ng-element-error"], function($__0,$__2,$__4) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var NgClass = $__0.NgClass;
  var NgEmpty = $__2.NgEmpty;
  var NgElementError = $__4.NgElementError;
  var NgElement = (function($__super) {
    function NgElement(nameClass, pattern) {
      $traceurRuntime.superConstructor(NgElement).call(this, NgElement);
      this.className = 'NgElement';
      this.nameClass = nameClass;
      this.pattern = pattern;
    }
    return ($traceurRuntime.createClass)(NgElement, {startTagOpenDeriv: function(pattern, qName, node) {
        if (this.contains(pattern.nameClass, qName)) {
          return this.after(pattern.pattern, new NgEmpty());
        }
        return new NgElementError(node, pattern, qName);
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgElement() {
      return NgElement;
    },
    __esModule: true
  };
});

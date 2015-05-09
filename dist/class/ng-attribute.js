define(["./ng-class", "./ng-attribute-error"], function($__0,$__2) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var NgClass = $__0.NgClass;
  var NgAttributeError = $__2.NgAttributeError;
  var NgAttribute = (function($__super) {
    function NgAttribute(nameClass, pattern) {
      $traceurRuntime.superConstructor(NgAttribute).call(this, NgAttribute);
      this.className = 'NgAttribute';
      this.nameClass = nameClass;
      this.pattern = pattern;
    }
    return ($traceurRuntime.createClass)(NgAttribute, {attDeriv: function(context, pattern, attrNode) {
        if (this.contains(pattern.nameClass, attrNode.qName)) {
          return this.valueMatch(context, pattern.pattern, attrNode.string, attrNode);
        }
        return new NgAttributeError(attrNode, pattern);
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgAttribute() {
      return NgAttribute;
    },
    __esModule: true
  };
});

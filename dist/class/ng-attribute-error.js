define(["./ng-not-allowed"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgNotAllowed = $__0.NgNotAllowed;
  var NgAttributeError = (function($__super) {
    function NgAttributeError(attrNode, pattern) {
      var message = ("invalid attribute on node: \"" + attrNode.node.type + "\",\n        attribute: \"" + attrNode.qName.localName + "\", ns \"" + attrNode.qName.uri + "\",\n        is not allowed on this element");
      $traceurRuntime.superConstructor(NgAttributeError).call(this, message, attrNode.node, pattern);
      this.instanceOf(NgAttributeError);
      this.errorClassName = 'NgAttributeError';
    }
    return ($traceurRuntime.createClass)(NgAttributeError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgAttributeInvalidValueError = (function($__super) {
    function NgAttributeInvalidValueError(node, pattern) {
      var message = ("invalid attribute on node: \"" + node.type + "\",\n        attribute: \"" + pattern.nameClass.localName + "\", ns \"" + pattern.nameClass.uri + "\",\n        has an invalid value");
      $traceurRuntime.superConstructor(NgAttributeInvalidValueError).call(this, message, node, pattern);
      this.instanceOf(NgAttributeInvalidValueError);
      this.errorClassName = 'NgAttributeInvalidValueError';
    }
    return ($traceurRuntime.createClass)(NgAttributeInvalidValueError, {}, {}, $__super);
  }(NgNotAllowed));
  var NgAttributeMissingValueError = (function($__super) {
    function NgAttributeMissingValueError(node, pattern) {
      var message = ("missing attribute on node: \"" + node.type + "\",\n        attribute: \"" + pattern.nameClass.localName + "\", ns \"" + pattern.nameClass.uri + "\"");
      $traceurRuntime.superConstructor(NgAttributeMissingValueError).call(this, message, node, pattern);
      this.instanceOf(NgAttributeMissingValueError);
      this.errorClassName = 'NgAttributeMissingValueError';
    }
    return ($traceurRuntime.createClass)(NgAttributeMissingValueError, {}, {}, $__super);
  }(NgNotAllowed));
  return {
    get NgAttributeError() {
      return NgAttributeError;
    },
    get NgAttributeInvalidValueError() {
      return NgAttributeInvalidValueError;
    },
    get NgAttributeMissingValueError() {
      return NgAttributeMissingValueError;
    },
    __esModule: true
  };
});

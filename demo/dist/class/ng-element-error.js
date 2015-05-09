define(["./ng-not-allowed"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgNotAllowed = $__0.NgNotAllowed;
  var NgElementError = (function($__super) {
    function NgElementError(node, pattern, qName) {
      var message = ("invalid tag name: '" + qName.localName + "' or uri: '" + qName.uri + "',\n        expected tag name is: '" + pattern.nameClass.localName + "' and uri: '" + pattern.nameClass.uri + "'");
      $traceurRuntime.superConstructor(NgElementError).call(this, message, node, pattern);
      this.instanceOf(NgElementError);
      this.qName = qName;
      this.errorClassName = 'NgElementError';
    }
    return ($traceurRuntime.createClass)(NgElementError, {}, {}, $__super);
  }(NgNotAllowed));
  return {
    get NgElementError() {
      return NgElementError;
    },
    __esModule: true
  };
});

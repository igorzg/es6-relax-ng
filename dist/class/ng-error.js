define(["../core"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var handleError = $__0.handleError;
  var NgError = (function() {
    function NgError() {
      var args = Array.prototype.slice.call(arguments),
          message = args.shift();
      if (Array.isArray(args[0]) && args.length === 1) {
        args = args[0];
      }
      throw new Error(handleError(message, args));
    }
    return ($traceurRuntime.createClass)(NgError, {}, {});
  }());
  return {
    get NgError() {
      return NgError;
    },
    __esModule: true
  };
});

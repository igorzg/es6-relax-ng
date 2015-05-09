define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgName = (function($__super) {
    function NgName(uri, localName) {
      $traceurRuntime.superConstructor(NgName).call(this, NgName);
      this.className = 'NgName';
      this.uri = uri;
      this.localName = localName;
    }
    return ($traceurRuntime.createClass)(NgName, {contains: function(nameClass, qName) {
        return (nameClass.uri == qName.uri && nameClass.localName == qName.localName);
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgName() {
      return NgName;
    },
    __esModule: true
  };
});

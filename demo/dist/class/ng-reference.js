define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgReference = (function($__super) {
    function NgReference(name, callback) {
      $traceurRuntime.superConstructor(NgReference).call(this, NgReference);
      this.className = 'NgReference';
      this.name = name;
      this.func = callback;
    }
    return ($traceurRuntime.createClass)(NgReference, {
      textDeriv: function(context, pattern, string, node) {
        return this.textDeriv(context, pattern.func(), string, node);
      },
      attDeriv: function(context, pattern, node) {
        return this.attDeriv(context, pattern.func(), node);
      },
      startTagOpenDeriv: function(pattern, qName, node) {
        return this.startTagOpenDeriv(pattern.func(), qName, node);
      },
      startTagCloseDeriv: function(pattern, node) {
        return this.startTagCloseDeriv(pattern.func(), node);
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgReference() {
      return NgReference;
    },
    __esModule: true
  };
});

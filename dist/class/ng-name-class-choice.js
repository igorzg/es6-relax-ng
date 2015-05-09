define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgNameClassChoice = (function($__super) {
    function NgNameClassChoice(nameClass1, nameClass2) {
      $traceurRuntime.superConstructor(NgNameClassChoice).call(this, NgNameClassChoice);
      this.className = 'NgNameClassChoice';
      this.nameClass1 = nameClass1;
      this.nameClass2 = nameClass2;
    }
    return ($traceurRuntime.createClass)(NgNameClassChoice, {contains: function(nameClass, qName) {
        return this.contains(nameClass.nameClass1, qName) || this.contains(nameClass.nameClass2, qName);
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgNameClassChoice() {
      return NgNameClassChoice;
    },
    __esModule: true
  };
});

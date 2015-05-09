define(["./ng-class"], function($__0) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var NgClass = $__0.NgClass;
  var NgChoice = (function($__super) {
    function NgChoice(pattern1, pattern2) {
      $traceurRuntime.superConstructor(NgChoice).call(this, NgChoice);
      this.className = 'NgChoice';
      this.pattern1 = pattern1;
      this.pattern2 = pattern2;
    }
    return ($traceurRuntime.createClass)(NgChoice, {
      attDeriv: function(context, pattern, attributeNode) {
        var p1,
            p2;
        p1 = this.attDeriv(context, pattern.pattern1, attributeNode);
        p2 = this.attDeriv(context, pattern.pattern2, attributeNode);
        return this.choice(p1, p2);
      },
      endTagDeriv: function(pattern, node) {
        var p1,
            p2;
        p1 = this.endTagDeriv(pattern.pattern1, node);
        p2 = this.endTagDeriv(pattern.pattern2, node);
        return this.choice(p1, p2);
      },
      startTagOpenDeriv: function(pattern, qName, node) {
        var p1,
            p2;
        p1 = this.startTagOpenDeriv(pattern.pattern1, qName, node);
        p2 = this.startTagOpenDeriv(pattern.pattern2, qName, node);
        return this.choice(p1, p2);
      },
      applyAfter: function(func, pattern) {
        var p1,
            p2;
        p1 = this.applyAfter(func, pattern.pattern1);
        p2 = this.applyAfter(func, pattern.pattern2);
        return this.choice(p1, p2);
      },
      textDeriv: function(context, pattern, str, node) {
        var p1,
            p2;
        p1 = this.textDeriv(context, pattern.pattern1, str, node);
        p2 = this.textDeriv(context, pattern.pattern2, str, node);
        return this.choice(p1, p2);
      },
      startTagCloseDeriv: function(pattern, node) {
        var p1,
            p2;
        p1 = this.startTagCloseDeriv(pattern.pattern1, node);
        p2 = this.startTagCloseDeriv(pattern.pattern2, node);
        return this.choice(p1, p2);
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgChoice() {
      return NgChoice;
    },
    __esModule: true
  };
});

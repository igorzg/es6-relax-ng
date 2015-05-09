define(["./apply-flip", "./ng-class", "./ng-after-error"], function($__0,$__2,$__4) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var ApplyFlip = $__0.ApplyFlip;
  var NgClass = $__2.NgClass;
  var NgAfterError = $__4.NgAfterError;
  var NgAfter = (function($__super) {
    function NgAfter(pattern1, pattern2) {
      $traceurRuntime.superConstructor(NgAfter).call(this, NgAfter);
      this.className = 'NgAfter';
      this.pattern1 = pattern1;
      this.pattern2 = pattern2;
    }
    return ($traceurRuntime.createClass)(NgAfter, {
      attDeriv: function(context, pattern, attributeNode) {
        var p1 = this.attDeriv(context, pattern.pattern1, attributeNode);
        return this.after(p1, pattern.pattern2);
      },
      startTagOpenDeriv: function(pattern, qName, node) {
        var p1,
            flip;
        p1 = this.startTagOpenDeriv(pattern.pattern1, qName, node);
        flip = new ApplyFlip('after', pattern.pattern2, this);
        return this.applyAfter(flip, p1);
      },
      applyAfter: function(func, pattern) {
        var p2 = func.invoke(pattern.pattern2);
        return this.after(pattern.pattern1, p2);
      },
      textDeriv: function(context, pattern, str, node) {
        var p1 = this.textDeriv(context, pattern.pattern1, str, node);
        return this.after(p1, pattern.pattern2);
      },
      endTagDeriv: function(pattern, node) {
        if (this.nullable(pattern.pattern1)) {
          return pattern.pattern2;
        } else {
          return new NgAfterError(node, pattern);
        }
      },
      startTagCloseDeriv: function(pattern, node) {
        var p1 = this.startTagCloseDeriv(pattern.pattern1, node);
        return this.after(p1, pattern.pattern2);
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgAfter() {
      return NgAfter;
    },
    __esModule: true
  };
});

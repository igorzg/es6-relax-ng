define(["./ng-class", "./apply-flip"], function($__0,$__2) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var NgClass = $__0.NgClass;
  var ApplyFlip = $__2.ApplyFlip;
  var NgGroup = (function($__super) {
    function NgGroup(pattern1, pattern2) {
      $traceurRuntime.superConstructor(NgGroup).call(this, NgGroup);
      this.className = 'NgGroup';
      this.pattern1 = pattern1;
      this.pattern2 = pattern2;
    }
    return ($traceurRuntime.createClass)(NgGroup, {
      attDeriv: function(context, pattern, node) {
        var p1,
            p2,
            gr1,
            gr2;
        p1 = this.attDeriv(context, pattern.pattern1, node);
        p2 = this.attDeriv(context, pattern.pattern2, node);
        gr1 = this.group(p1, pattern.pattern2);
        gr2 = this.group(pattern.pattern1, p2);
        return this.choice(gr1, gr2);
      },
      startTagOpenDeriv: function(pattern, qName, node) {
        var p1,
            flip,
            x,
            p2;
        p1 = this.startTagOpenDeriv(pattern.pattern1, qName, node);
        flip = new ApplyFlip('group', pattern.pattern2, this);
        x = this.applyAfter(flip, p1);
        if (this.nullable(pattern.pattern1)) {
          p2 = this.startTagOpenDeriv(pattern.pattern2, qName, node);
          return this.choice(x, p2);
        } else {
          return x;
        }
      },
      startTagCloseDeriv: function(pattern, node) {
        var p1,
            p2;
        p1 = this.startTagCloseDeriv(pattern.pattern1, node);
        p2 = this.startTagCloseDeriv(pattern.pattern2, node);
        return this.group(p1, p2);
      },
      textDeriv: function(context, pattern, str, node) {
        var p1,
            p,
            p2;
        p1 = this.textDeriv(context, pattern.pattern1, str, node);
        p = this.group(p1, pattern.pattern2);
        if (this.nullable(p)) {
          p2 = this.textDeriv(context, pattern.pattern2, str, node);
          return this.choice(p, p2);
        } else {
          return p;
        }
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgGroup() {
      return NgGroup;
    },
    __esModule: true
  };
});

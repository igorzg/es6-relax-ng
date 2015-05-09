define(["./ng-class", "./apply-flip"], function($__0,$__2) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var NgClass = $__0.NgClass;
  var ApplyFlip = $__2.ApplyFlip;
  var NgInterLeave = (function($__super) {
    function NgInterLeave(pattern1, pattern2) {
      $traceurRuntime.superConstructor(NgInterLeave).call(this, NgInterLeave);
      this.className = 'NgInterLeave';
      this.pattern1 = pattern1;
      this.pattern2 = pattern2;
    }
    return ($traceurRuntime.createClass)(NgInterLeave, {
      startTagOpenDeriv: function(pattern, qName, node) {
        var p1,
            p2,
            flip,
            flip2,
            c1,
            c2;
        p1 = this.startTagOpenDeriv(pattern.pattern1, qName, node);
        p2 = this.startTagOpenDeriv(pattern.pattern2, qName, node);
        flip = new ApplyFlip('interleave', pattern.pattern2, this);
        flip2 = new ApplyFlip('interleave', pattern.pattern1, this, true);
        c1 = this.applyAfter(flip, p1);
        c2 = this.applyAfter(flip2, p2);
        return this.choice(c1, c2);
      },
      textDeriv: function(context, pattern, str, node) {
        var p1,
            p2,
            c1,
            c2;
        p1 = this.textDeriv(context, pattern.pattern1, str, node);
        p2 = this.textDeriv(context, pattern.pattern2, str, node);
        c1 = this.interleave(p1, pattern.pattern2);
        c2 = this.interleave(pattern.pattern1, p2);
        return this.choice(c1, c2);
      },
      startTagCloseDeriv: function(pattern, node) {
        var p1,
            p2;
        p1 = this.startTagCloseDeriv(pattern.pattern1, node);
        p2 = this.startTagCloseDeriv(pattern.pattern2, node);
        return this.interleave(p1, p2);
      },
      attDeriv: function(context, pattern, node) {
        var p1,
            p2,
            gr1,
            gr2;
        p1 = this.attDeriv(context, pattern.pattern1, node);
        p2 = this.attDeriv(context, pattern.pattern2, node);
        gr1 = this.interleave(p1, pattern.pattern2);
        gr2 = this.interleave(pattern.pattern1, p2);
        return this.choice(gr1, gr2);
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgInterLeave() {
      return NgInterLeave;
    },
    __esModule: true
  };
});

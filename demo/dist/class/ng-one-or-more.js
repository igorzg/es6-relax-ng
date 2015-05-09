define(["./ng-class", "./ng-empty", "./apply-flip"], function($__0,$__2,$__4) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var NgClass = $__0.NgClass;
  var NgEmpty = $__2.NgEmpty;
  var ApplyFlip = $__4.ApplyFlip;
  var NgOneOrMore = (function($__super) {
    function NgOneOrMore(pattern) {
      $traceurRuntime.superConstructor(NgOneOrMore).call(this, NgOneOrMore);
      this.className = 'NgOneOrMore';
      this.pattern = pattern;
    }
    return ($traceurRuntime.createClass)(NgOneOrMore, {
      attDeriv: function(context, pattern, node) {
        var p1,
            p2;
        p1 = this.attDeriv(context, pattern.pattern, node);
        p2 = this.choice(pattern, new NgEmpty());
        return this.group(p1, p2);
      },
      textDeriv: function(context, pattern, str, node) {
        var p1,
            p2;
        p1 = this.textDeriv(context, pattern.pattern, str, node);
        p2 = this.choice(pattern, new NgEmpty());
        return this.group(p1, p2);
      },
      startTagOpenDeriv: function(pattern, qName, node) {
        var p1,
            c1,
            flip;
        p1 = this.startTagOpenDeriv(pattern.pattern, qName, node);
        c1 = this.choice(pattern, new NgEmpty());
        flip = new ApplyFlip('group', c1, this);
        return this.applyAfter(flip, p1);
      },
      startTagCloseDeriv: function(pattern, node) {
        var p1 = this.startTagCloseDeriv(pattern.pattern, node);
        return this.oneOrMore(p1);
      }
    }, {}, $__super);
  }(NgClass));
  return {
    get NgOneOrMore() {
      return NgOneOrMore;
    },
    __esModule: true
  };
});

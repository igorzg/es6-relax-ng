define(["./ng-class", "./ng-list-error", "./ng-empty", "../core"], function($__0,$__2,$__4,$__6) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  var NgClass = $__0.NgClass;
  var NgListError = $__2.NgListError;
  var NgEmpty = $__4.NgEmpty;
  var isString = $__6.isString;
  var NgList = (function($__super) {
    function NgList(pattern) {
      $traceurRuntime.superConstructor(NgList).call(this, NgList);
      this.className = 'NgList';
      this.pattern = pattern;
    }
    return ($traceurRuntime.createClass)(NgList, {textDeriv: function(context, pattern, str, node) {
        var p1,
            n;
        p1 = this.listDeriv(context, pattern.pattern, reverseWords(str), node);
        n = this.nullable(p1);
        if (n) {
          return new NgEmpty();
        } else {
          return new NgListError(node, pattern, str);
        }
        function reverseWords(string) {
          if (!isString(string)) {
            string = string.toString();
          }
          return string.split(/\s+/).reverse();
        }
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgList() {
      return NgList;
    },
    __esModule: true
  };
});

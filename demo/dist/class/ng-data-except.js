define(["./ng-class", "./ng-not-allowed", "./ng-empty", "./ng-data-except-error"], function($__0,$__2,$__4,$__6) {
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
  var NgNotAllowed = $__2.NgNotAllowed;
  var NgEmpty = $__4.NgEmpty;
  var NgDataExceptError = $__6.NgDataExceptError;
  var NgDataExcept = (function($__super) {
    function NgDataExcept(datatype, paramList, pattern) {
      $traceurRuntime.superConstructor(NgDataExcept).call(this, NgDataExcept);
      this.className = 'NgDataExcept';
      this.datatype = datatype;
      this.paramList = paramList;
      this.pattern = pattern;
    }
    return ($traceurRuntime.createClass)(NgDataExcept, {textDeriv: function(context, pattern, str, node) {
        var p1,
            p2,
            n,
            message;
        p1 = this.datatypeAllows(pattern.datatype, pattern.paramList, str, context);
        p2 = this.textDeriv(context, pattern.pattern, str, node);
        n = !this.nullable(p2);
        if (p1 instanceof NgEmpty && n) {
          return p1;
        } else if (p1 instanceof NgNotAllowed) {
          return new NgDataExceptError(node, pattern, p1);
        }
        message = ("data invalid, attribute value \"" + str + "\" found on node \"" + node.type + "\"");
        return new NgDataExceptError(node, pattern, new NgNotAllowed(message), true);
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgDataExcept() {
      return NgDataExcept;
    },
    __esModule: true
  };
});

define(["./ng-class", "./ng-not-allowed", "./ng-data-error"], function($__0,$__2,$__4) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var NgClass = $__0.NgClass;
  var NgNotAllowed = $__2.NgNotAllowed;
  var NgDataError = $__4.NgDataError;
  var NgData = (function($__super) {
    function NgData(datatype, paramList) {
      $traceurRuntime.superConstructor(NgData).call(this, NgData);
      this.className = 'NgData';
      this.datatype = datatype;
      this.paramList = paramList;
    }
    return ($traceurRuntime.createClass)(NgData, {textDeriv: function(context, pattern, str, attributeNode) {
        var p = this.datatypeAllows(pattern.datatype, pattern.paramList, str, context);
        if (p instanceof NgNotAllowed) {
          return new NgDataError(attributeNode, pattern, p);
        }
        return p;
      }}, {}, $__super);
  }(NgClass));
  return {
    get NgData() {
      return NgData;
    },
    __esModule: true
  };
});

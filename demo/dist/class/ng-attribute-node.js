define(["./ng-class", "./ng-qname"], function($__0,$__2) {
  "use strict";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var NgClass = $__0.NgClass;
  var NgQName = $__2.NgQName;
  var NgAttributeNode = (function($__super) {
    function NgAttributeNode(attr, node) {
      $traceurRuntime.superConstructor(NgAttributeNode).call(this, NgAttributeNode);
      this.className = 'NgAttributeNode';
      this.qName = new NgQName(attr.namespaceURI ? attr.namespaceURI : "", attr.localName);
      this.string = attr.value;
      this.node = node;
    }
    return ($traceurRuntime.createClass)(NgAttributeNode, {}, {}, $__super);
  }(NgClass));
  return {
    get NgAttributeNode() {
      return NgAttributeNode;
    },
    __esModule: true
  };
});

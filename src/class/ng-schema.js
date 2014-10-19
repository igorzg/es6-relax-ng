import {NgClass} from './ng-class';
import {NgDOM} from "./ng-dom";
import {NgError} from './ng-error';
import {
    isNode,
    removeComments,
    toXML,
    isObject,
    clean,
    isFunction,
    getXML,
    instanceOf,
    isString,
    isArray,
    forEach,
    removeWhiteSpace
} from "../core";
/**
 * Regex
 * @type {RegExp}
 */
const RELAX_NG_NAME_NS_RGX = /^(.*):(.*)/;
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgSchema
 *
 * @constructor
 * @description
 *
 * NgSchema class simplification algorithm
 */
export class NgSchema extends NgClass {
    /**
     * Schema constructor
     * @param schema
     * @param config
     */
     constructor(schema, config = {cloneComplex: true, removeInvalidNodes: true}) {
        var fc, ns;
        super(NgSchema);
        /**
         * If not schema
         */
        if (!schema && !isNode(schema)) {
            throw new NgError('NgSchema: schema is not provided or have parsing errors schema:', schema);
        }

        /**
         * Remove comments
         * @type {Object}
         */
        schema = removeComments(schema);

        /**
         * Config
         * @type {{cloneComplex: boolean}}
         */
        this.config = {};
        /**
         * Is object
         */
        if (isObject(config)) {
            Object.assign(this.config, config);
        }
        /**
         * Create instance of schema dom
         * @type {object}
         */
        this.schema = new NgDOM(schema);

        /**
         * Relax ng namespace
         * @type {string}
         */
        this.rngNs = 'http://relaxng.org/ns/structure/1.0';
        /**
         * Is schema prefixed
         * @type {boolean}
         */
        this.localName = null;

        try {
            fc = this.schema.firstElementChild();
            ns = fc.getNamespace(this.rngNs);
            if (ns) {
                if (ns.localName !== 'xmlns') {
                    this.localName = ns.localName;
                }
            } else {
                throw new NgError('Schema is not valid relax ng schema, missing ns or is not valid structure');
            }
        } catch (e) {
            if (e.message) {
                throw new NgError(e.message);
            } else {
                throw new NgError('Invalid schema xml structure');
            }
        }
        /**
         * Clone complex schema
         */
        if (this.config.cloneComplex) {
            this.complex = this.schema.clone();
        } else {
            this.complex = this.schema;
        }
        /**
         * Annotations
         * @type {Array}
         */
        this.annotations = [];
        this.className = 'NgSchema';
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_1
     * @description
     * Replacing rng:externalRef with external content
     */
    step_1() {
        var parents = [
            'attribute', 'choice', 'define', 'element',
            'except', 'group', 'interleave', 'list',
            'mixed', 'oneOrMore', 'optional', 'start',
            'zeroOrMore'
        ];
        this.traverse(function step_1_traverse(node) {
            var parent = node.parentNode(), message, href, replacedNode = null, that = this;
            if (this.matchNode(parent, parents)) {
                href = node.getAttribute('href');
                if (href) {
                    getXML(href, false).then((data) => {
                        replacedNode = node.replaceNode(mergeExternal.call(that, data), true);
                    }, (xhr) => {
                        throw new NgError("field to load xml file status code: {0}", xhr.status);
                    }); // sync call
                }
            } else {
                message = 'invalid schema definition in step step_1 externalRef don\'t have provided correct parent current parent is "{0}" but allowed are: "{1}" or node don\'t have correct namespace assigned';
                throw new NgError(message, parent.type, parents.join(','));
            }
            return replacedNode;
        }, 'externalRef');

        /**
         * Merge external schema
         * @param data
         * @returns {Object}
         */
        function mergeExternal(data) {
            var doc = new NgDOM(data), fc, ns, message;
            fc = doc.firstElementChild();
            ns = fc.getNamespace(this.rngNs);
            if (ns && ns.localName) {
                if(ns.localName !== 'xmlns' && this.localName !== ns.localName) {
                    message = 'external file don\'t have correct namespace external: "{0}", ';
                    message += 'don\'t match "{1}" . Exchange external or internal to do ';
                    message += 'correct schema merge.';
                    throw new NgError(message, ns.localName, this.localName);
                } else {
                    return fc;
                }
            } else {
                throw new NgError('step_1_traverse, checkExternal: invalid schema xml structure');
            }
        }

    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_2
     * @description
     * Replacing rng:include with external content
     */
    step_2() {
        var parents = ['div', 'grammar'],
            children = ['define', 'div', 'start'];

        this.traverse(function step_2_traverse(node) {
            var parent = node.parentNode(), message, href, replacedNode = null, that = this;
            if (this.matchNode(parent, parents)) {
                forEach(node.childElements(), function (cNode, index) {
                    if (!this.matchNode(cNode, children)) {
                        var message = 'invalid schema definition in step step_2';
                        message += ', include don\'t have provided correct children';
                        message += ', current children is {0} at index {1} but allowed are: {2}';
                        throw new NgError(message, cNode.type, index, children.join(','));
                    } else if (this.matchNode(cNode, 'div')) {
                        cNode.unwrap();
                    }
                }, this);
                href = node.getAttribute('href');
                if (href) {
                    getXML(href, false).then((data) => {
                        replacedNode = node.replaceNode(mergeExternal.call(that, data, node), true);
                    }, (xhr) => {
                        throw new NgError("field to load xml file status code: {0}", xhr.status);
                    }); // sync call
                }
            } else {
                message = 'invalid schema definition in step step_2 include don\'t have provided correct parent current parent is "{0}" but allowed are: "{1}" or node don\'t have correct namespace assigned';
                throw new NgError(message, parent.type, parents.join(','));
            }

            return replacedNode;
        }, 'include');

        /**
         * Merge external schema
         * @param data
         * @param node
         * @returns {Object}
         */
        function mergeExternal(data, node) {
            var doc = new NgDOM(data), fc, ce, ns, message;
            fc = doc.firstElementChild();
            ce = fc.childElements();

            ///merge
            forEach(node.childElements(), function step2_merge_external(cNode) {
                forEach(
                    ce.filter(function (nItem) {
                        return nItem.type === cNode.type;
                    }),
                    function step2_merge_external_filter(fItem) {
                        if (fItem.is('start') || (fItem.is('define') && cNode.is('define') && fItem.getAttribute('name') ===  cNode.getAttribute('name'))) {
                            fItem.replaceNode(cNode, true);
                        }
                    }
                );
            });

            ns = fc.getNamespace(this.rngNs);
            if (ns && ns.localName) {
                if(ns.localName !== 'xmlns' && this.localName !== ns.localName) {
                    message = 'external file don\'t have correct namespace external: "{0}", ';
                    message += 'don\'t match "{1}" . Exchange external or internal to do ';
                    message += 'correct schema merge.';
                    throw new NgError(message, ns.localName, this.localName);
                } else {
                    return fc;
                }
            } else {
                throw new NgError('step_2_traverse, checkExternal: invalid schema xml structure');
            }
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_3
     * @description
     * Replace child grammars with its content
     */
    step_3() {
        this.traverse(function grammar_no_parent_doc(node) {
            if (!this.matchNode(node.parentNode(), '#document')) {
                return node.unwrap();
            }
        }, 'grammar');
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_4
     * @description
     * Replace starts whit its content if parent is not grammar
     */
    step_4() {
        this.traverse(function merge_start(node) {
            if (!this.matchNode(node.parentNode(), 'grammar')) {
                return node.unwrap();
            }
        }, 'start');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_5
     * @description
     * Collect all defined which parent is not grammar and attach them to grammar
     */
    step_5() {
        this.traverse(function merge_define(node) {
            if (!this.matchNode(node.parentNode(), 'grammar')) {
                node.getDocument().querySelector('grammar').addChild(node);
            }
        }, 'define');
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_6
     * @description
     * Merge starts add choice to roots if there is more then one start
     */
    step_6() {
        var nodes = [], first;
        this.traverse(function merge_start(node) {
            if (this.matchNode(node.parentNode(), 'grammar')) {
                if (nodes.length > 1 && node.getAttribute('combine') && node.getAttribute('combine') !== 'choice') {
                    throw new NgError('while merging schema, multiple start nodes must have combine as choice pattern');
                }
                nodes.push(node);
            }
        }, 'start');
        if (nodes.length > 1) {
            first = nodes.shift();
            nodes.forEach(iNode => {
                first.addChild(iNode);
                iNode.unwrap();
            });
            first.wrapChildren(this.createElement('choice'));
        } else {
            nodes = null;
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_7
     * @description
     * Annotations (elements) are removed.
     */
    step_7() {
        this.traverse(function step_7_remove_annotations(node) {
            var parent;
            if (this.isAnnotation(node)) {
                this.annotations.push(node.clone());
                parent = node.parentNode();
                node.remove();
                return parent;
            }
        });
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_8
     * @description
     * Text nodes containing only whitespace are removed, except when found in value and param elements.
     */
    step_8() {
        this.traverseAll(function step_8_remove_whitespace(node) {
            var value, parent = node.parentNode();
            if (!this.matchNode(parent, ['value', 'param'])) {
                value = removeWhiteSpace(node.getValue());
                if (value) {
                    node.setValue(value);
                } else {
                    node.remove();
                    return parent;
                }
            }
        }, '#text');
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_9
     * @description
     *  Whitespace is normalized in name, type, and combine attributes and in name elements.
     */
    step_9() {
        this.traverse(function step_9_remove_whitespace(node) {
            removeAttributeWhitespace(node, "name");
            removeAttributeWhitespace(node, "type");
            removeAttributeWhitespace(node, "combine");
        });
        function removeAttributeWhitespace(node, name) {
            if (node.hasAttribute(name)) {
                node.setAttribute(name, removeWhiteSpace(node.getAttribute(name)));
            }
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_10
     * @description
     * The characters that are not allowed in the dataType Library attributes are escaped.
     * The attributes are transferred through inheritance to each data and value pattern.
     * If type attribute don't have value assign token
     */
    step_10() {
        this.traverse(function step_10_datatypeLibraryInheritance(node) {
                var datatypeUrl = getInheritedLibray(node);
                if (datatypeUrl) {
                    node.setAttribute("datatypeLibrary", datatypeUrl);
                }
                if (node.is("value", this.localName) && !node.hasAttribute("type")) {
                    node.setAttribute("type", "token");
                }
        }, ['data', 'value']);

        function getInheritedLibray(node) {
            if (node.isElementNode() && node.hasAttribute("datatypeLibrary")) {
                return node.getAttribute("datatypeLibrary");
            } else if (node.parentNode()) {
                return getInheritedLibray(node.parentNode());
            }
            return null;
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_11
     * @description
     * The name attribute of the element and attribute patterns is replaced by the name element,
     * a name class that matches only a single name.
     */
    step_11() {
        this.traverse(function step_11_replace_name_attributes(node) {
            var nameNode, ns, name;
            if (node.hasAttribute("name")) {
                nameNode = this.createElement("name");
                if (node.hasAttribute("ns")) {
                    nameNode.setAttribute("ns", node.getAttribute("ns"));
                } else {
                    nameNode.setAttribute("ns", "");
                }
                nameNode.setValue(node.getAttribute("name"));
                if (node.hasChildElements()) {
                    node.insertBefore(nameNode, node.firstElementChild());
                } else {
                    node.addChild(nameNode);
                }
                node.removeAttribute("name");
            } else if (node.is('element', this.localName)) {
                throw new NgError("step_11, node {0} don't have an name attribute", node.toXML());
            }
        }, ["element", "attribute"]);
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_12
     * @description
     * For any name, nsName or value element that does not have an ns attribute, an ns attribute is added.
     * The value of the added ns attribute is the value of the ns attribute of the nearest ancestor element
     * that has an ns attribute, or the empty string if there is no such ancestor.
     */
     step_12() {
        this.traverse(function step_12_inherit_ns_attributes(node) {
            var ns = getInheritedNs(node);
            if (ns) {
                node.setAttribute("ns", ns);
            } else {
                node.setAttribute("ns", "");
            }
        }, ["name", "nsName", "value"]);

        function getInheritedNs(node) {
            if (node.isElementNode() && node.hasAttribute("ns")) {
                return node.getAttribute("ns");
            } else if (node.parentNode()) {
                return getInheritedNs(node.parentNode());
            }
            return null;
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_13
     * @description
     * Remove all ns attributes if node is not an ["name", "nsName", "value"].
     */
    step_13() {
        this.traverse(function step_13_remove_invalid_ns_attributes(node) {
            if (!this.matchNode(node, ["name", "nsName", "value"])) {
                if (node.hasAttribute("ns")) {
                    node.removeAttribute("ns");
                }
            }
        });
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_14
     * @description
     * For any name element containing a prefix, the prefix is removed and an ns attribute is added
     * replacing any existing ns attribute. The value of the added ns attribute is the value to which
     * the namespace map of the context of the name element maps the prefix.
     * The context must have a mapping for the prefix.
     */
    step_14() {
        this.traverse(function step_14_map_name_prefixes(node) {
            var value = node.getValue();
            if (RELAX_NG_NAME_NS_RGX.test(value)) {
                node.setValue(value.replace(RELAX_NG_NAME_NS_RGX, function step_14_replace_m2(s, m1, m2) {
                   return m2;
                }));
                node.setAttribute("ns", getInheritedNs(node, value.replace(RELAX_NG_NAME_NS_RGX, function step_14_replace_m1(s, m1) {
                   return m1;
                })));
            }
        }, 'name');

        function getInheritedNs(node, suffix) {
            if (node.isElementNode() && node.hasAttribute("xmlns:" + suffix)) {
                return node.getAttribute("xmlns:" + suffix);
            } else if (node.parentNode()) {
                return getInheritedNs(node.parentNode(), suffix);
            }
            throw new NgError('no valid namespace found in step_14 pattern "{0}"', suffix);
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_15
     * @description
     * Each div element is replaced by its children.
     */
    step_15() {
        this.traverse(function step_15_replace_with_children(node) {
            var parent = node.parentNode();
            node.unwrap();
            return parent;
        }, 'div')
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_16
     * @description
     *  A define, oneOrMore, zeroOrMore, optional, list or mixed element is transformed
     *  so that it has exactly one child element. If it has more than one child element,
     *  then its child elements are wrapped in a group element.
     */
    step_16() {
        this.traverse(function step_16_wrap_group(node) {
            if (node.hasChildElements() && node.getChildElementCount() > 1) {
                node.wrapChildren(this.createElement('group'));
            }
        }, ['define', 'oneOrMore', 'zeroOrMore', 'optional', 'list', 'mixed']);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_17
     * @description
     *  An element element is transformed so that it has exactly two child elements, the first
     *  being a name class and the second being a pattern. If it has more than two child elements,
     *  then the child elements other than the first are wrapped in a group element.
     */
    step_17() {
        this.traverse(function step_17_element(node) {
            if (node.hasChildElements() && node.getChildElementCount() > 2) {
                node.wrapChildren(this.createElement('group'), 'name');
            }
        }, 'element');
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_18
     * @description
     * A except element is transformed so that it has exactly one child element.
     * If it has more than one child element, then its child elements are wrapped in a choice element.
     */
    step_18() {
        this.traverse(function step_18_except(node) {
            if (node.hasChildElements() && node.getChildElementCount() > 1) {
                node.wrapChildren(this.createElement('choice'));
            }
        }, 'except');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_19
     * @description
     * If an attribute element has only one child element (a name class), then a text element is added.
     * If has no children remove element
     */
    step_19() {
        this.traverse(function step_19_attribute(node) {
            var parent = node.parentNode();
            if (node.hasChildElements() && node.getChildElementCount() === 1) {
                node.addChild(this.createElement('text'));
            } else if (!node.hasChildElements()) {
                node.remove();
                return parent;
            }
        }, 'attribute');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_20
     * @description
     * A choice, group or interleave element is transformed so that it has exactly two child elements.
     * If it has one child element, then it is replaced by its child element.
     */
     step_20() {
        this.traverse(function step_20_mixed(node) {
            var parent = node.parentNode();
            if (node.hasChildElements() && node.getChildElementCount() === 1) {
                node.unwrap();
                return parent;
            } else if (!node.hasChildElements()) {
                node.remove();
                return parent;
            }
        }, ['choice', 'group', 'interleave']);
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_20
     * @description
     *  A choice, group or interleave element is transformed so that it has exactly two child elements.
     *  If it has more than two child elements, then the first two child elements are combined
     *  into a new element with the same name as the parent element and with the first two child elements as its children.
     *  For example,
     *  <choice> p1 p2 p3 </choice>
     *  is transformed to
     *
     *  <choice> <choice> p1 p2 </choice> p3 </choice>
     *  This reduces the number of child elements by one.
     *  The transformation is applied repeatedly until there are exactly two child elements.
     */
     step_21() {
        this.traverse(function step_21_wrapInTwoChild(node) {
            var parent = node.parentNode();
            if (node.hasChildElements() && node.getChildElementCount() > 2) {
                if (this.localName) {
                    node.wrapDeepInTwoChildNs(node.type, this.rngNs, this.localName + ':');
                } else {
                    node.wrapDeepInTwoChildNs(node.type);
                }
                return parent;
            }
        }, ['choice', 'group', 'interleave']);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_22
     * @description
     *  mixed patterns are transformed into interleave patterns between their unique child pattern and a text pattern.
     */
    step_22() {
        this.traverse(function step_22_mixed(node) {
            var interleave = this.createElement('interleave');
            forEach(node.childElements(), (cNode) => { interleave.addChild(cNode.clone()) });
            interleave.addChild(this.createElement('text'));
            node.replaceNode(interleave);
            return interleave;
        }, 'mixed');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_23
     * @description
     * optional patterns are transformed into choice patterns between their unique child pattern and an empty pattern.
     */
    step_23() {
        this.traverse(function step_23_optional(node) {
            var choice = this.createElement('choice');
            forEach(node.childElements(), (cNode) => { choice.addChild(cNode.clone()) });
            choice.addChild(this.createElement('empty'));
            node.replaceNode(choice);
            return choice;
        }, 'optional');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_24
     * @description
     * zeroOrMore patterns are transformed into choice patterns between a oneOrMore pattern including their unique child pattern and an empty pattern.
     */
    step_24() {
        this.traverse(function step_24_zeroOrMore(node) {
            var choice = this.createElement('choice'),
                oneOrMore = this.createElement('oneOrMore');
            forEach(node.childElements(), (cNode) => { oneOrMore.addChild(cNode.clone()) });
            choice.addChild(oneOrMore);
            choice.addChild(this.createElement('empty'));
            node.replaceNode(choice);
            return choice;
        }, 'zeroOrMore');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_25
     * @description
     * In each grammar, multiple define elements with the same
     * name are combined as defined by their combine attribute.
     */
    step_25() {
        var nodes = [], allowed = ['interleave', 'choice'], item, node, wrap;
        /**
         * Collect nodes which needs to be combined
         */
        this.traverse(function step_25_combine(node) {
            var obj, name, combine;
            if (node.hasAttribute("combine")) {
                combine = node.getAttribute("combine");
                if (allowed.indexOf(combine) === -1) {
                    throw new NgError('invalid combine value on node: {0}, allowed are "{1}"', node.toXML(), allowed.join(','));
                }
                name = node.getAttribute("name");
                obj = query(nodes, name, node.type);
                if (obj) {
                    if (obj.combine !== combine) {
                        throw new NgError('nodes with same name must have same combine attribute: {0}, {1}', node.toXML(), obj.node.toXML());
                    }
                    if (obj.combineWith.indexOf(node) === -1) {
                        obj.combineWith.push(node);
                    }
                } else {
                    nodes.push({
                        name: name,
                        type: node.type,
                        combine: combine,
                        node: node,
                        combineWith : []
                    });
                }

            }
        }, ['define', 'start']);

        /**
         * Combine nodes loop
         */
        while (item = nodes.shift()) {
            node = item.node;
            node.removeAttribute('combine');
            if (item.combineWith.length === 0) {
                continue;
            }
            wrap = this.createElement(item.combine);
            node.wrapChildren(wrap);
            item.combineWith.forEach((cNode) => {wrap.addChild(cNode); cNode.unwrap();});
            clean(item);
        }
        /**
         * Process step 21 and 20 in reverse order
         */
        this.step_21();
        this.step_20();
        /**
         * Query
         * @param obj
         * @param name
         * @param type
         * @returns {*}
         */
        function query(obj, name, type) {
            return obj.filter((item) => { return item.name === name && item.type === type; }).shift();
        }
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_26
     * @description
     * ParentRef elements are replaced by ref elements.
     */
    step_26() {
        this.traverse(function step_26_parentRef(node) {
            var parent = node.parentNode(),
                ref = this.createElement('ref');
            ref.setAttribute('name', node.getAttribute('name'));
            node.replaceNode(ref);
            return parent;
        }, 'parentRef');
    }

    /**
     * @since 0.0.1
     * @method NgSchema#step_26
     * @description
     * For each element that isn't the unique child of a define element,
     * a named pattern is created to embed its definition.
     *
     * For each named pattern that isn't embedded, a single element pattern is suppressed.
     * References to this named pattern are replaced by its definition.
     */
     step_27() {
        var nodes = [];
        /**
         * Traverse elements
         */
        this.traverse(function step_27_define_replace_ref(node) {
            var parent = node.parentNode(),
                fc = node.firstElementChild();
            if (!this.matchNode(fc, 'element')) {
                nodes.push(node.clone());
                node.remove();
                return parent;
            }
        }, 'define');
        /**
         * Traverse refs
         */
        this.traverse(function findRefs(cNode) {
            var cName = cNode.getAttribute('name'), clone, cPnode, found;
            found = nodes.filter(function filter(iNode) {
                return iNode.getAttribute("name") === cName;
            }).shift();
            if (found) {
                cPnode = cNode.parentNode();
                clone = found.clone();
                cNode.replaceNode(clone);
                clone.unwrap();
                return cPnode;
            }
        }, 'ref');
        /**
         * Destroy clones
         */
        nodes.forEach(function destory_clones(node) {
            node.destroy();
        });
        nodes = null;
    }


    /**
     * @since 0.0.1
     * @method NgSchema#step_28
     * @description
     * Recursively escalate notAllowed patterns, when they are located where their effect is such that
     * their parent pattern itself is notAllowed.
     *
     * Remove choices that are notAllowed.
     *
     * (Note that this simplification doesn't cross element boundaries, so element foo { notAllowed }
     * isn't transformed into notAllowed.)
     *
     * Remove empty elements that have no effect.
     *
     * Move useful empty elements so that they are the first child in choice elements.
     */
    step_28() {
        this.traverse(function step_28_cleanup(node) {
            var fc, lc, parent;
            if (node.getChildElementCount() === 2) {
                parent = node.parentNode();
                fc = node.firstElementChild();
                lc = node.lastElementChild();
                if (fc.is('empty', this.localName) && lc.is('empty', this.localName)) {
                    node.replaceNode(this.createElement('empty'));
                    return parent;
                }
            } else {
                throw new NgError('invalid node number on element type {0} expected 2, number of nodes is: {1}', node.type, node.getChildElementCount());
            }
        }, ['group', 'interleave', 'choice']);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_29
     * @description
     * Recursively escalate notAllowed patterns, when they are located where their effect is such that
     * their parent pattern itself is notAllowed.
     *
     * Remove choices that are notAllowed.
     *
     * (Note that this simplification doesn't cross element boundaries, so element foo { notAllowed }
     * isn't transformed into notAllowed.)
     *
     * Remove empty elements that have no effect.
     *
     * Move useful empty elements so that they are the first child in choice elements.
     */
    step_29() {
        this.traverse(function step_29_cleanup(node) {
            var fc,  parent;
            if (node.getChildElementCount() === 1) {
                parent = node.parentNode();
                fc = node.firstElementChild();
                if (fc.is('empty', this.localName)) {
                    node.replaceNode(this.createElement('empty'));
                    return parent;
                }
            } else {
                throw new NgError('invalid node number on element type {0} expected 1, number of nodes is: {1}', node.type, node.getChildElementCount());
            }
        }, 'oneOrMore');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#step_30
     * @description
     * Recursively escalate notAllowed patterns, when they are located where their effect is such that
     * their parent pattern itself is notAllowed.
     *
     * Remove choices that are notAllowed.
     *
     * (Note that this simplification doesn't cross element boundaries, so element foo { notAllowed }
     * isn't transformed into notAllowed.)
     *
     * Remove empty elements that have no effect.
     *
     * Move useful empty elements so that they are the first child in choice elements.
     */
    step_30() {
        this.traverse(function step_28_cleanup(node) {
            var fc, lc, parent;
            if (node.getChildElementCount() === 2) {
                parent = node.parentNode();
                fc = node.firstElementChild();
                lc = node.lastElementChild();
                if (fc.is('empty', this.localName)) {
                    node.replaceNode(lc.clone());
                    return parent;
                } else if(lc.is('empty', this.localName)) {
                    node.replaceNode(fc.clone());
                    return parent;
                }
            } else {
                throw new NgError('invalid node number on element type {0} expected 2, number of nodes is: {1}', node.type, node.getChildElementCount());
            }
        }, 'group');
    }
    /**
     * @since 0.0.1
     * @method NgSchema#simplify
     * @description
     * Simplify schema
     */
    simplify() {
        this.step_1();
        this.step_2();
        this.step_3();
        this.step_4();
        this.step_5();
        this.step_6();
        this.step_7();
        this.step_8();
        this.step_9();
        this.step_10();
        this.step_11();
        this.step_12();
        this.step_13();
        this.step_14();
        this.step_15();
        this.step_16();
        this.step_17();
        this.step_18();
        this.step_19();
        this.step_20();
        this.step_21();
        this.step_22();
        this.step_23();
        this.step_24();
        this.step_25();
        this.step_26();
        this.step_27();
        this.step_28();
        this.step_29();
        this.step_30();
    }

    /**
     * @since 0.0.1
     * @method NgSchema#isAnnotation
     * @description
     * Is node annotation
     */
    isAnnotation(node) {
        return this.localName !== node.typePrefix;
    }
    /**
     * @since 0.0.1
     * @method NgSchema#matchNode
     * @description
     * Go over tree and execute function
     */
    matchNode(node, match) {
        if (match && node) {
            if (!node.isDocumentNode() && !node.isTextNode() && this.localName && this.isAnnotation(node)) {
                return false;
            } else if (isArray(match) && match.indexOf(node.type) === -1) {
                return false;
            } else if (isString(match) && match !== node.type) {
                return false;
            }
            return true;
        }
        return false;
    }
    /**
     * @since 0.0.1
     * @method NgSchema#traverseAll
     * @description
     * Go over tree including all nodes and execute function
     */
    traverseAll(callback, match) {
        var result;
        try {
            if (!isFunction(callback)) {
                throw new NgError('callback is not function');
            }
            for(let node of gen(this.schema)) {
                if (match) {
                    if (this.matchNode(node, match)) {
                        result = callback.call(this, node);
                    }
                } else {
                    result = callback.call(this, node);
                }

            }
        } catch (e) {
            throw new NgError('NgSchema traverse: ' + e.message, callback.toString(), e.stack ? e.stack.toString() : e.toString());
        }

        /**
         * Iterate
         * @param node
         */
        function* gen(node) {
            var skip = false;
            while (true) {
                if (result) {
                    node = result;
                    result = null;
                }
                if (node.firstChild() && !skip) {
                    node = node.firstChild();
                    yield node;
                } else if (node.nextSibling()) {
                    node = node.nextSibling();
                    skip = false;
                    yield node;
                } else if (node.parentNode()) {
                    node = node.parentNode();
                    skip = true;
                } else {
                    break;
                }
            }
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#traverse
     * @description
     * Go over elements and execute function
     */
    traverse(callback, match) {
        var result;
        try {
            if (!isFunction(callback)) {
                throw new NgError('callback is not function');
            }
            for(let node of gen(this.schema)) {
                if (match) {
                    if (this.matchNode(node, match)) {
                        result = callback.call(this, node);
                    }
                } else {
                    result = callback.call(this, node);
                }

            }
        } catch (e) {
            throw new NgError('NgSchema traverse: ' + e.message, callback.toString(), e.stack ? e.stack.toString() : e.toString());
        }

        /**
         * Iterate
         * @param node
         */
        function* gen(node) {
            var skip = false;
            while (true) {
                if (result) {
                    node = result;
                    result = null;
                }
                if (node.firstElementChild() && !skip) {
                    node = node.firstElementChild();
                    yield node;
                } else if (node.nextElementSibling()) {
                    node = node.nextElementSibling();
                    skip = false;
                    yield node;
                } else if (node.parentNode()) {
                    node = node.parentNode();
                    skip = true;
                } else {
                    break;
                }
            }
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#createElement
     * @description
     * Convert schema to string
     */
    createElement(element) {
        if (this.localName) {
            return this.schema.createElementNs(this.rngNs,  this.localName + ':' + element);
        }
        return this.schema.createElement(element);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#querySelector
     * @description
     * Map to query selector
     */
    querySelectorAll(selector) {
        if (this.localName) {
            return this.schema.querySelectorAll(selector).filter((item) => {return item.typePrefix === this.localName;});
        }
        return this.schema.querySelectorAll(selector);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#querySelector
     * @description
     * Map to query selector
     */
    querySelector(selector) {
        var node = this.schema.querySelector(selector);
        if (this.localName && node) {
            if (node.typePrefix !== this.localName) {
                return null;
            }
        }
        return node;
    }
    /**
     * @since 0.0.1
     * @method NgSchema#toXML
     * @description
     * Convert schema to string
     */
    toXML(prettyPrint, complex = false) {
        var schema = this.schema, clone;
        if (complex) {
            schema = this.complex;
        }
        if (prettyPrint) {
            clone = new NgSchema(removeWhiteSpace(schema.clone().node));
            clone.step_8();
            clone.traverse(function prettifyTraverse(node) {
                var count = getNodeDeepLevel(node),  parent = node.parentNode(), space;
                if (!parent.isDocumentNode()) {
                    space = createWhiteSpace(count);
                    parent.insertBefore(node.createTextNode("\u000A"), node);
                    parent.insertBefore(node.createTextNode(space), node);
                    if (node.hasChildElements()) {
                        node.addChild(node.createTextNode("\u000A" + space), node);
                    }
                } else {
                    node.addChild(node.createTextNode("\u000A"), node);
                }
            });
            schema = clone.schema;
        }
        if (schema.isDocumentNode()) {
            return toXML(schema.node);
        }
        /**
         * Return false if fail
         */
        return false;
        /**
         * Create whitespace
         * @param indent
         * @returns {*}
         */
        function createWhiteSpace(indent) {
            var str = "";
            while(indent > 0) {
                str += "\u0009";
                --indent;
            }
            return str;
        }
        /**
         * Get node deep level
         * @param node
         * @param count
         * @returns {*}
         */
        function getNodeDeepLevel(node, count) {
            var counter = count || 0;
            if (node && node.parentNode() && !node.isDocumentNode()) {
                return getNodeDeepLevel(node.parentNode(), ++counter);
            }
            return counter;
        }
    }
    /**
     * @since 0.0.1
     * @method NgSchema#destroy
     * @description
     * Destroy schema
     */
    destroy() {
        if (this.schema) {
            this.schema.destroy();
        }
        if (this.complex) {
            this.complex.destroy();
        }
        clean(this);
    }
    /**
     * @since 0.0.1
     * @method NgSchema#clone
     * @description
     * Clone schema
     */
    clone() {
        try {
            return new NgSchema(this.schema.clone().node, this.config);
        } catch (e) {
            new NgError('Error in cloning schema', e);
        }
        return false;
    }
}
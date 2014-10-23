import {NgClass} from './ng-class';
import {NgPattern} from './ng-pattern';
import {NgNotAllowed} from './ng-not-allowed';
import {NgEmpty} from './ng-empty';
import {NgChoice} from './ng-choice';
import {NgInterLeave} from './ng-interleave';
import {NgGroup} from './ng-group';
import {NgQName} from './ng-qname';
import {NgOneOrMore} from './ng-one-or-more';
import {NgAttributeNode} from './ng-attribute-node';
import {NgAttributeInvalidValueError, NgAttributeMissingValueError} from './ng-attribute-error';
import {NgError} from './ng-error';
import {NgDOM} from './ng-dom';
import {NgContext} from './ng-context';
import {NgAfter} from './ng-after';
import {
    NgValidatorContainsError,
    NgValidatorNullableError,
    NgValidatorEndTagDerivError,
    NgValidatorApplyAfterError,
    NgValidatorTextDerivNotAllowedError,
    NgValidatorAttDerivError,
    NgDataTypeError,
    NgDataTypeEqualityError,
    NgValidatorStartTagOpenDerivNgEmptyError,
    NgValidatorStartTagOpenDerivError,
    NgValidatorTextDerivError
} from './ng-validator-errors';
import {isObject, forEach} from '../core';
const WHITE_SPACE_RGX = /[^\t\n\r ]/;
const XMLNS_URI = "http://www.w3.org/2000/xmlns/";
const NS = "xmlns";
//@todo implement datatypeLibrary
//const DATATYPE_URI = "http://www.w3.org/2001/XMLSchema-datatypes";
/**
 * @license Mit Licence 2014
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidator
 *
 * @constructor
 * @description
 *
 * NgValidator
 *
 */
export class NgValidator extends NgClass {

    constructor(pattern, datatypeLibrary = null) {
        super(NgValidator);
        if (pattern instanceof NgPattern) {
            this.patternInstance = pattern;
        } else {
            throw new NgError('pattern is not instanceof NgPattern');
        }
        this.datatypeLibrary = datatypeLibrary;
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#qName
     *
     * @description
     * Creates qName class
     * @return {object}
     */
    qName(node) {
        var value = "";
        forEach(node.getNamespaces(), (ns) => {
            if ((ns.prefix === NS && ns.localName === ns.typePrefix) &&
                (ns.name === NS && !ns.prefix)) {
                value = ns.value;
            }
        });
        return new NgQName(value, node.type);
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#isWhitespace
     * @return {boolean}
     */
    isWhitespace(str) {
        return !(WHITE_SPACE_RGX.test(str));
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#normalizeWhitespace
     *
     * @description
     * normalizeWhitespace :: String -> String
     * normalizeWhitespace s = unwords (words s)
     *
     * @return {string}
     */
    normalizeWhitespace(str) {
        return str.split(/\s+/).join(" ");
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#strip
     *
     * @description
     * strip :: ChildNode -> Bool
     * strip (TextNode s) = whitespace s
     * strip _ = False
     *
     * @return {boolean}
     */
    strip(node) {
        if (node.isCommentNode()) {
            return true;
        } else if (node.isTextNode()) {
            return this.isWhitespace(node.getValue());
        }
        return false;
    }


    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#contains
     *
     * @description
     * contains :: NameClass -> QName -> Bool
     * contains (NsName ns1) (QName ns2 _) = (ns1 == ns2)
     * contains (NsNameExcept ns1 nc) (QName ns2 ln) = ns1 == ns2 && not (contains nc (QName ns2 ln))
     * contains (Name ns1 ln1) (QName ns2 ln2) = (ns1 == ns2) && (ln1 == ln2)
     * contains (NameClassChoice nc1 nc2) n = (contains nc1 n) || (contains nc2 n)
     */
    contains(nameClass, qName) {
        switch(nameClass.className) {
            case 'NgAnyName':
            case 'NgAnyNameExcept':
            case 'NgNsName':
            case 'NgNsNameExcept':
            case 'NgName':
            case 'NgNameClassChoice':
                return nameClass.contains.call(this, nameClass, qName);
            default:
                return new NgValidatorContainsError(nameClass, qName);
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#nullable
     *
     * @description
     * nullable:: Pattern -> Bool
     * nullable (Group p1 p2) = nullable p1 && nullable p2
     * nullable (Interleave p1 p2) = nullable p1 && nullable p2
     * nullable (Choice p1 p2) = nullable p1 || nullable p2
     * nullable (OneOrMore p) = nullable p
     * nullable (Element _ _) = False
     * nullable (Attribute _ _) = False
     * nullable (List _) = False
     * nullable (Value _ _ _) = False
     * nullable (Data _ _) = False
     * nullable (DataExcept _ _ _) = False
     * nullable NotAllowed = False
     * nullable Empty = True
     * nullable Text = True
     * nullable (After _ _) = False
     *
     * @return {object}
     */
    nullable(pattern) {
        switch (pattern.className) {
            case 'NgGroup':
            case 'NgInterLeave':
                return this.nullable(pattern.pattern1) && this.nullable(pattern.pattern2);
            case 'NgChoice':
                return this.nullable(pattern.pattern1) || this.nullable(pattern.pattern2);
            case 'NgOneOrMore':
                return this.nullable(pattern.pattern);
            case 'NgElement':
            case 'NgAttribute':
            case 'NgList':
            case 'NgValue':
            case 'NgData':
            case 'NgDataExcept':
            case 'NgAfter':
            case 'NgNotAllowed':
                return false;
            case 'NgEmpty':
            case 'NgText':
                return true;
            default:
                return new NgValidatorNullableError(pattern);
        }
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#choice
     *
     * @description
     * choice :: Pattern -> Pattern -> Pattern
     * choice p NotAllowed = p
     * choice NotAllowed p = p
     * choice p1 p2 = Choice p1 p2
     *
     */
    choice(pattern1, pattern2) {
        if (pattern2 instanceof NgNotAllowed) {
            return pattern1;
        } else if (pattern1 instanceof NgNotAllowed) {
            return pattern2;
        } else if (pattern1 instanceof NgEmpty && pattern2 instanceof NgEmpty) {
            return new NgEmpty();
        }
        return new NgChoice(pattern1, pattern2);
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#group
     *
     * @description
     * group :: Pattern -> Pattern -> Pattern
     * group p NotAllowed = NotAllowed
     * group NotAllowed p = NotAllowed
     * group p Empty = p
     * group Empty p = p
     * group p1 p2 = Group p1 p2
     */
    group(pattern1, pattern2) {
        if (pattern1 instanceof NgNotAllowed) {
            return pattern1;
        } else if (pattern2 instanceof NgNotAllowed) {
            return pattern2;
        } else if (pattern2 instanceof NgEmpty) {
            return pattern1;
        } else if (pattern1 instanceof NgEmpty) {
            return pattern2;
        }
        return new NgGroup(pattern1, pattern2);
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#interleave
     *
     * @description
     * interleave :: Pattern -> Pattern -> Pattern
     * interleave p NotAllowed = NotAllowed
     * interleave NotAllowed p = NotAllowed
     * interleave p Empty = p
     * interleave Empty p = p
     * interleave p1 p2 = Interleave p1 p2
     */
    interleave(pattern1, pattern2) {
        if (pattern1 instanceof NgNotAllowed) {
            return pattern1;
        } else if (pattern2 instanceof NgNotAllowed) {
            return pattern2;
        } else if (pattern2 instanceof NgEmpty) {
            return pattern1;
        } else if (pattern1 instanceof NgEmpty) {
            return pattern2;
        }
        return new NgInterLeave(pattern1, pattern2);
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#after
     *
     * @description
     * after :: Pattern -> Pattern -> Pattern
     * after p NotAllowed = NotAllowed
     * after NotAllowed p = NotAllowed
     * after p1 p2 = After p1 p2
     */
    after(pattern1, pattern2) {
        if (pattern2 instanceof NgNotAllowed) {
            return pattern2;
        } else if (pattern1 instanceof NgNotAllowed) {
            return pattern1;
        }
        return new NgAfter(pattern1, pattern2);
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#oneOrMore
     *
     * @description
     * Ng validator oneOrMore
     * @return {object}
     */
    oneOrMore(pattern) {
        switch(pattern.className) {
            case 'NgNotAllowed':
                return pattern;
            default:
                return new NgOneOrMore(pattern);
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#endTagDeriv
     *
     * @description
     * endTagDeriv :: Pattern -> Pattern
     * endTagDeriv (Choice p1 p2) = choice (endTagDeriv p1) (endTagDeriv p2)
     * endTagDeriv (After p1 p2) = if nullable p1 then p2 else NotAllowed
     * endTagDeriv _ = NotAllowed
     *
     * @return {object}
     */
    endTagDeriv(pattern, node) {
        switch(pattern.className) {
            case 'NgChoice':
            case 'NgAfter':
                return pattern.endTagDeriv.call(this, pattern, node);
            case 'NgNotAllowed':
                return pattern;
            default:
                return new NgValidatorEndTagDerivError(pattern, node);
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#applyAfter
     *
     * @description
     * applyAfter :: (Pattern -> Pattern) -> Pattern -> Pattern
     * applyAfter f (After p1 p2) = after p1 (f p2)
     * applyAfter f (Choice p1 p2) = choice (applyAfter f p1) (applyAfter f p2)
     * applyAfter f NotAllowed = NotAllowed
     *
     * @return {object}
     */
    applyAfter(func, pattern) {
        switch(pattern.className) {
            case 'NgChoice':
            case 'NgAfter':
                return pattern.applyAfter.call(this, func, pattern);
            case 'NgNotAllowed':
                return pattern;
            default:
                return new NgValidatorApplyAfterError(func, pattern);
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#listDeriv
     *
     * @description
     * listDeriv :: Context -> Pattern -> [String] -> Pattern
     * listDeriv _ p [] = p
     * listDeriv cx p (h:t) = listDeriv cx (textDeriv cx p h) t
     *
     * @return {object}
     */
    listDeriv(context, pattern, strings, node) {
        var p;
        if (strings.length == 0) {
            return pattern;
        }
        p = this.textDeriv(context, pattern, strings.pop(), node);
        return this.listDeriv(context, p, strings);
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#textDeriv
     *
     * @description
     * textDeriv :: Context -> Pattern -> String -> Pattern
     *
     * Choice:
     * textDeriv cx (Choice p1 p2) s =
     * choice (textDeriv cx p1 s) (textDeriv cx p2 s)
     *
     * Interleave:
     * textDeriv cx (Interleave p1 p2) s =
     * choice (interleave (textDeriv cx p1 s) p2)
     * (interleave p1 (textDeriv cx p2 s))
     *
     * Group:
     * textDeriv cx (Group p1 p2) s =
     * let p = group (textDeriv cx p1 s) p2
     * in if nullable p1 then choice p (textDeriv cx p2 s) else p
     *
     * After:
     * textDeriv cx (After p1 p2) s = after (textDeriv cx p1 s) p2
     *
     * OneOrMore:
     * textDeriv cx (OneOrMore p) s =
     * group (textDeriv cx p s) (choice (OneOrMore p) Empty)
     *
     * Text:
     * textDeriv cx Text _ = Text
     *
     * Datatype:
     *
     *      Value:
     *      textDeriv cx1 (Value dt value cx2) s =
     *      if datatypeEqual dt value cx2 s cx1 then Empty else NotAllowed
     *
     *      Data:
     *      textDeriv cx (Data dt params) s =
     *      if datatypeAllows dt params s cx then Empty else NotAllowed
     *
     *      DataExcept:
     *      textDeriv cx (DataExcept dt params p) s =
     *      if datatypeAllows dt params s cx && not (nullable (textDeriv cx p s)) then
     *      Empty
     *      else
     *      NotAllowed
     *
     * List:
     * textDeriv cx (List p) s =
     * if nullable (listDeriv cx p (words s)) then Empty else NotAllowed
     *
     * Other:
     * textDeriv _ _ _ = NotAllowed
     *
     *
     * @return {object}
     */

    textDeriv(context, pattern, string, node) {
        switch (pattern.className) {
            case 'NgChoice':
            case 'NgInterLeave':
            case 'NgGroup':
            case 'NgAfter':
            case 'NgOneOrMore':
            case 'NgText':
            case 'NgValue':
            case 'NgData':
            case 'NgDataExcept':
            case 'NgList':
            case 'NgReference':
                return pattern.textDeriv.call(this, context, pattern, string, node);
            case 'NgEmpty':
            case 'NgElement':
                return new NgValidatorTextDerivNotAllowedError(node, pattern);
            case 'NgNotAllowed':
                return pattern;
            default:
                return new NgValidatorTextDerivError(node, pattern);
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#applyAfter
     *
     * @description
     * attDeriv :: Context -> Pattern -> AttributeNode -> Pattern
     *
     * After:
     * attDeriv cx (After p1 p2) att =
     * after (attDeriv cx p1 att) p2
     *
     * Choice:
     * attDeriv cx (Choice p1 p2) att =
     * choice (attDeriv cx p1 att) (attDeriv cx p2 att)
     *
     * Group:
     * attDeriv cx (Group p1 p2) att =
     * choice (group (attDeriv cx p1 att) p2)
     * (group p1 (attDeriv cx p2 att))
     *
     * Interleave:
     * attDeriv cx (Interleave p1 p2) att =
     * choice (interleave (attDeriv cx p1 att) p2)
     * (interleave p1 (attDeriv cx p2 att))
     *
     * OneOrMore:
     * attDeriv cx (OneOrMore p) att =
     * group (attDeriv cx p att) (choice (OneOrMore p) Empty)
     *
     * Attribute:
     * attDeriv cx (Attribute nc p) (AttributeNode qn s) =
     * if contains nc qn && valueMatch cx p s then Empty else NotAllowed
     *
     * Other:
     * attDeriv _ _ _ = NotAllowed
     *
     * @return {object}
     */

    attDeriv(context, pattern, node) {
        switch (pattern.className) {
            case 'NgAfter':
            case 'NgChoice':
            case 'NgGroup':
            case 'NgInterLeave':
            case 'NgOneOrMore':
            case 'NgAttribute':
            case 'NgReference':
                return pattern.attDeriv.call(this, context, pattern, node);
            case 'NgNotAllowed':
                return pattern;
            default:
                return new NgValidatorAttDerivError(node, pattern);
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#attsDeriv
     *
     * @description
     * attsDeriv :: Context -> Pattern -> [AttributeNode] -> Pattern
     * attsDeriv cx p [] = p
     *
     * AttributeNode:
     * attsDeriv cx p ((AttributeNode qn s):t) =
     * attsDeriv cx (attDeriv cx p (AttributeNode qn s)) t
     *
     * @return {object}
     */
    attsDeriv(context, pattern, attributes, node) {
        var attDeriv, attr;
        if (attributes.length === 0) {
            return pattern;
        }
        attr = attributes.shift();
        if (attr.namespaceURI === XMLNS_URI) {
            return this.attsDeriv(context, pattern, attributes, node);
        }
        attDeriv = this.attDeriv(context, pattern, new NgAttributeNode(attr, node));
        return this.attsDeriv(context, attDeriv, attributes, node);
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#attsDeriv
     *
     * @description
     * valueMatch :: Context -> Pattern -> String -> Bool
     * valueMatch cx p s =
     * (nullable p && whitespace s) || nullable (textDeriv cx p s)
     *
     * @return {object}
     */
    valueMatch(context, pattern, string, node) {
        var p;
        if (this.nullable(pattern) && this.isWhitespace(string)) {
            return new NgEmpty();
        }
        p = this.textDeriv(context, pattern, string, node);
        /// checker for collection afterwards here
        if (this.nullable(p)) {
            return new NgEmpty();
        }
        return p;
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#datatypeAllows
     *
     * @description
     * datatypeAllows :: Datatype -> ParamList -> String -> Context -> Bool
     * datatypeAllows ("", "string") [] _ _ = True
     * datatypeAllows ("", "token") [] _ _ = True
     *
     * @return {object}
     */
    datatypeAllows(datatype, paramList, string, context) {
        var locals = ["string", "token"];
        if (!datatype.uri || !this.datatypeLibrary) {
            if (locals.indexOf(datatype.localName) > -1 && paramList.length == 0) {
                return new NgEmpty();
            }
            return new NgDataTypeError(datatype, string, null);
        }
        try {
            return this.datatypeLibrary.datatypeAllows(datatype, paramList, string, context);
        } catch (e) {
            throw new NgError(e.message);
        }

    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#datatypeEqual
     *
     * @description
     * datatypeEqual :: Datatype -> String -> Context -> String -> Context -> Bool
     * datatypeEqual ("", "string") s1 _ s2 _ = (s1 == s2)
     * datatypeEqual ("", "token") s1 _ s2 _ =
     * (normalizeWhitespace s1) == (normalizeWhitespace s2)
     *
     * @return {object}
     */
    datatypeEqual(datatype, string1, context1, string2, context2) {
        var p1, p2;
        if (!datatype.uri || !this.datatypeLibrary) {
            if (datatype.localName === "string") {
                if (string1 === string2) {
                    return new NgEmpty();
                }
                return new NgDataTypeEqualityError(datatype, string2, string1);
            } else if (datatype.localName === "token") {
                p1 = this.normalizeWhitespace(string1);
                p2 = this.normalizeWhitespace(string2);
                if (p1 === p2) {
                    return new NgEmpty();
                }
                return new NgDataTypeEqualityError(datatype, string2, string1);
            }

            return new NgDataTypeError(datatype, string2, string1);
        }

        try {
            return this.datatypeLibrary.datatypeEqual(datatype, string1, context1, string2, context2);
        } catch (e) {
            throw new NgError(e.message);
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#startTagOpenDeriv
     *
     * @description
     * startTagOpenDeriv :: Pattern -> QName -> Pattern
     *
     * Choice:
     * startTagOpenDeriv (Choice p1 p2) qn =
     * choice (startTagOpenDeriv p1 qn) (startTagOpenDeriv p2 qn)
     *
     * Element:
     * startTagOpenDeriv (Element nc p) qn =
     * if contains nc qn then after p Empty else NotAllowed
     *
     * Interleave:
     * startTagOpenDeriv (Interleave p1 p2) qn =
     * choice (applyAfter (flip interleave p2) (startTagOpenDeriv p1 qn))
     * (applyAfter (interleave p1) (startTagOpenDeriv p2 qn))
     *
     * OneOrMore:
     * startTagOpenDeriv (OneOrMore p) qn =
     * applyAfter (flip group (choice (OneOrMore p) Empty))
     * (startTagOpenDeriv p qn)
     *
     * Group:
     * startTagOpenDeriv (Group p1 p2) qn =
     * let x = applyAfter (flip group p2) (startTagOpenDeriv p1 qn)
     *      in if nullable p1 then
     *       choice x (startTagOpenDeriv p2 qn)
     *      else
     *       x
     *
     * After:
     * startTagOpenDeriv (After p1 p2) qn =
     * applyAfter (flip after p2) (startTagOpenDeriv p1 qn)
     *
     * Other:
     * startTagOpenDeriv _ qn = NotAllowed
     *
     * @return {object}
     *
     */
    startTagOpenDeriv(pattern, qName, node) {
        switch (pattern.className) {
            case 'NgEmpty':
                return new NgValidatorStartTagOpenDerivNgEmptyError(node, pattern, qName);
            case 'NgChoice':
            case 'NgElement':
            case 'NgInterLeave':
            case 'NgOneOrMore':
            case 'NgGroup':
            case 'NgReference':
            case 'NgAfter':
                return pattern.startTagOpenDeriv.call(this, pattern, qName, node);
            case 'NgNotAllowed':
                return pattern;
            default:
                return new NgValidatorStartTagOpenDerivError(node, pattern, qName);
        }
    }
    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#startTagCloseDeriv
     *
     * @description
     * CloseDeriv :: Pattern -> Pattern
     *
     * After:
     * CloseDeriv (After p1 p2) =
     * after (CloseDeriv p1) p2
     *
     * Choice:
     * CloseDeriv (Choice p1 p2) =
     * choice (CloseDeriv p1) (CloseDeriv p2)
     *
     * Group:
     * CloseDeriv (Group p1 p2) =
     * group (CloseDeriv p1) (CloseDeriv p2)
     *
     * Interleave:
     * CloseDeriv (Interleave p1 p2) =
     * interleave (CloseDeriv p1) (CloseDeriv p2)
     *
     * OneOrMore:
     * CloseDeriv (OneOrMore p) =
     * oneOrMore (CloseDeriv p)
     *
     * Attribute:
     * CloseDeriv (Attribute _ _) = NotAllowed
     * CloseDeriv p = p
     *
     * @return {object}
     */
    startTagCloseDeriv(pattern, node) {
        switch (pattern.className) {
            case 'NgReference':
            case 'NgAfter':
            case 'NgChoice':
            case 'NgGroup':
            case 'NgInterLeave':
            case 'NgOneOrMore':
                return pattern.startTagCloseDeriv.call(this, pattern, node);
            case 'NgAttribute':
                if (node.hasAttribute(pattern.nameClass.localName)) {
                    return new NgAttributeInvalidValueError(node, pattern);
                } else {
                    return new NgAttributeMissingValueError(node, pattern);
                }
            default:
                return pattern;
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#childrenDeriv
     *
     * @description
     * childrenDeriv :: Context -> Pattern -> [ChildNode] -> Pattern
     * childrenDeriv cx p [] = childrenDeriv cx p [(TextNode "")]
     *
     * TextNode:
     * childrenDeriv cx p [(TextNode s)] =
     * let p1 = childDeriv cx p (TextNode s)
     * in if whitespace s then choice p p1 else p1
     *
     * childrenDeriv cx p children = stripChildrenDeriv cx p children
     *
     * @return {object}
     */
    childrenDeriv(context, pattern, children) {
        var p, cNode;
        if (children.length === 0) {
            return pattern;
        } else if (children.length === 1 && children[0].isTextNode()) {
            cNode = children.shift();
            p = this.childDeriv(context, pattern, cNode);
            if (this.isWhitespace(cNode.getValue())) {
                return this.choice(pattern, p);
            }
            return p;
        }
        return this.stripChildrenDeriv(context, pattern, children);
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#stripChildrenDeriv
     *
     * @description
     * stripChildrenDeriv :: Context -> Pattern -> [ChildNode] -> Pattern
     * stripChildrenDeriv _ p [] = p
     * stripChildrenDeriv cx p (h:t) =
     * stripChildrenDeriv cx (if strip h then p else (childDeriv cx p h)) t
     *
     * @return {object}
     */
    stripChildrenDeriv(context, pattern, children) {
        var cNode;
        if (children.length === 0) {
            return pattern;
        }
        cNode = children.shift();
        if (!this.strip(cNode)) {
            pattern = this.childDeriv(context, pattern, cNode);
        }
        return this.stripChildrenDeriv(context, pattern, children);
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#childDeriv
     *
     * @description
     * childDeriv :: Context -> Pattern -> ChildNode -> Pattern
     *
     * TextNode:
     * childDeriv cx p (TextNode s) = textDeriv cx p s
     *
     * ElementNode:
     * childDeriv _ p (ElementNode qn cx atts children) =
     * let p1 = startTagOpenDeriv p qn
     * p2 = attsDeriv cx p1 atts
     * p3 = startTagCloseDeriv p2
     * p4 = childrenDeriv cx p3 children
     * in endTagDeriv p4
     *
     * @return {object}
     */
    childDeriv(context, pattern, node) {
        var p1, p2, p3, p4;
        if (node.isTextNode()) {
            return this.textDeriv(context, pattern, node.getValue(), node);
        } else if (node.isElementNode()) {
            p1 = this.startTagOpenDeriv(pattern, this.qName(node), node);
            p2 = this.attsDeriv(node.getNamespaces(), p1, node.getAttributes(), node);
            p3 = this.startTagCloseDeriv(p2, node);
            p4 = this.childrenDeriv(node.getNamespaces(), p3, node.children());
            return this.endTagDeriv(p4, node);
        } else {
            throw new NgError('only text and element nodes are allowed in childDeriv', node);
        }
    }

    /**
     * @license  2014
     * @since 0.0.1
     * @author Igor Ivanovic
     * @method NgValidator#validate
     *
     * @description
     * validate NgDOM instance
     *
     * @return {object}
     */
    validate(node, pattern = null) {
        if (!(node instanceof NgDOM)) {
            throw new NgError('node must be valid NgDOM instance');
        }
        if (node.isDocumentNode()) {
            node = node.firstElementChild();
        }
        if (!isObject(pattern)) {
            pattern = this.patternInstance.getPattern();
        }
        if (!pattern.context) {
            pattern.context = new NgContext();
        }
        return this.childDeriv(pattern.context, pattern, node);
    }
}


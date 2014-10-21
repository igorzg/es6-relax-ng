import {NgClass} from './ng-class';
import {NgPattern} from './ng-pattern';
import {
    NgValidatorContainsError
} from './ng-validator-errors';
const WHITE_SPACE_RGX = /[^\t\n\r ]/;
const DATATYPE_URI = "http://www.w3.org/2001/XMLSchema-datatypes";
const XMLNS_URI = "http://www.w3.org/2000/xmlns/";
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

    constructor(pattern) {
        super(NgValidator);
        if (pattern instanceof NgPattern) {
            this.patternInstance = pattern;
        } else {
            throw new NgError('pattern is not instanceof NgPattern');
        }
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
}

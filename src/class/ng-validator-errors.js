import {NgNotAllowed} from './ng-not-allowed';
/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorContainsError
 * @constructor
 * @description
 * NgValidatorContainsError
 */
export class NgValidatorContainsError extends NgNotAllowed{
    constructor(nameClass, qName) {
        var message = `invalid pattern: -> schema pattern is not valid pattern in contains`;
        super(message, null, nameClass);
        this.instanceOf(NgValidatorContainsError);
        this.qName = qName;
        this.errorClassName = 'NgValidatorContainsError';
    }
}

/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorNullableError
 *
 * @constructor
 * @description
 * NgValidatorNullableError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgValidatorNullableError extends NgNotAllowed{
    constructor(pattern) {
        var message = `invalid pattern: -> schema pattern is not valid pattern in nullable`;
        super(message, null, pattern);
        this.instanceOf(NgValidatorNullableError);
        this.errorClassName = 'NgValidatorNullableError';
    }
}
/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorEndTagDerivError
 *
 * @constructor
 * @description
 * NgValidatorEndTagDerivError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgValidatorEndTagDerivError extends NgNotAllowed{
    constructor(pattern, node) {
        var message = `invalid pattern on endTagDeriv`;
        super(message, node, pattern);
        this.instanceOf(NgValidatorEndTagDerivError);
        this.errorClassName = 'NgValidatorEndTagDerivError';
    }
}

/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorApplyAfterError
 *
 * @constructor
 * @description
 * NgValidatorApplyAfterError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgValidatorApplyAfterError extends NgNotAllowed{
    constructor(func, pattern) {
        var message = `invalid pattern on applyAfter`;
        super(message, null, pattern);
        this.instanceOf(NgValidatorApplyAfterError);
        this.func = func;
        this.errorClassName = 'NgValidatorApplyAfterError';
    }
}

/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorTextDerivNotAllowedError
 *
 * @constructor
 * @description
 * NgValidatorTextDerivNotAllowedError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgValidatorTextDerivNotAllowedError extends NgNotAllowed{
    constructor(node, pattern) {
        var message = `not allowed to have pattern "${pattern.className}" at textDeriv`;
        super(message, node, pattern);
        this.instanceOf(NgValidatorTextDerivNotAllowedError);
        this.errorClassName = 'NgValidatorTextDerivNotAllowedError';
    }
}


/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorTextDerivError
 *
 * @constructor
 * @description
 * NgValidatorTextDerivError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgValidatorTextDerivError extends NgNotAllowed{
    constructor(node, pattern) {
        var message = `invalid pattern on textDeriv`;
        super(message, node, pattern);
        this.instanceOf(NgValidatorTextDerivError);
        this.errorClassName = 'NgValidatorTextDerivError';
    }
}

/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorAttDerivError
 *
 * @constructor
 * @description
 * NgValidatorAttDerivError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgValidatorAttDerivError extends NgNotAllowed{
    constructor(node, pattern) {
        var message = `invalid pattern at attrDeriv`;
        super(message, node, pattern);
        this.instanceOf(NgValidatorAttDerivError);
        this.errorClassName = 'NgValidatorAttDerivError';
    }
}

/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgDataTypeError
 *
 * @constructor
 * @description
 * NgDataTypeError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgDataTypeError extends NgNotAllowed{
    constructor(datatype, value, match) {
        var message = `"${datatype.localName}" is not correct datatype allowed is string and token`;
        super(message, null, null);
        this.instanceOf(NgDataTypeError);
        this.datatype = datatype;
        this.value = value;
        this.match = match;
        this.errorClassName = 'NgDataTypeError';
    }
}


/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgDataTypeEqualityError
 *
 * @constructor
 * @description
 * NgDataTypeEqualityError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgDataTypeEqualityError extends NgNotAllowed{
    constructor(datatype, value, match) {
        var message = `strings are not equals requested is: ${value} , provided is: ${match}`;
        super(message, null, null);
        this.instanceOf(NgDataTypeEqualityError);
        this.datatype = datatype;
        this.value = value;
        this.match = match;
        this.errorClassName = 'NgDataTypeEqualityError';
    }
}



/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorStartTagOpenDerivNgEmptyError
 *
 * @constructor
 * @description
 * NgValidatorStartTagOpenDerivNgEmptyError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgValidatorStartTagOpenDerivNgEmptyError extends NgNotAllowed{
    constructor(node, pattern, qName) {
        var message = `invalid pattern NgEmpty on startTagOpenDeriv`;
        super(message, node, pattern);
        this.instanceOf(NgValidatorStartTagOpenDerivNgEmptyError);
        this.qName = qName;
        this.errorClassName = 'NgValidatorStartTagOpenDerivNgEmptyError';
    }
}


/**
 * @since 0.0.1
 * @author Igor Ivanovic
 * @name NgValidatorStartTagOpenDerivError
 *
 * @constructor
 * @description
 * NgValidatorStartTagOpenDerivError is used by ng validator
 * @param {object} pattern is instanceof pattern class
 */
export class NgValidatorStartTagOpenDerivError extends NgNotAllowed{
    constructor(node, pattern, qName) {
        var message = `node ${qName.localName} is not allowed in here`;
        super(message, node, pattern);
        this.instanceOf(NgValidatorStartTagOpenDerivError);
        this.qName = qName;
        this.errorClassName = 'NgValidatorStartTagOpenDerivError';
    }
}



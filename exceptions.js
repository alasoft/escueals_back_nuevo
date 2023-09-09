const { Http } = require("./utils");

class Exceptions {

    static AUTHENTICATION_ERROR = 1;
    static VALIDATION_ERROR = 2;
    static INTERNAL_ERROR = 3;


    static TENANT_NOT_DEFINED = 1;
    static ID_NOT_DEFINED = 2;
    static CANNOT_BE_ARRAY = 3
    static WHERE_REQUIRED = 4;

    static Authenticacion(parameters) {
        return {
            code: parameters.code,
            type: this.AUTHENTICATION_ERROR,
            status: Http.Unauthorized,
        }
    }

    static Validation(parameters) {
        return {
            code: parameters.code,
            type: this.VALIDATION_ERROR,
            status: Http.BadRequest
        }
    }

    static Internal(parameters) {
        return {
            code: parameters.code,
            type: this.INTERNAL_ERROR,
            status: Http.InternalError
        }
    }

    static TenantNotDefined() {
        return this.Internal({ code: this.TENANT_NOT_DEFINED })
    }

    static IdNotDefined() {
        return this.Internal({ code: this.ID_NOT_DEFINED })
    }

    static CannotBeArray() {
        return this.Internal({ code: this.CANNOT_BE_ARRAY })
    }

    static WhereRequired() {
        return this.Internal({ code: this.WHERE_REQUIRED })
    }

}

module.exports.Exceptions = Exceptions;
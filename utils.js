const { _ } = require("lodash");

class ObjectBase {

    constructor(parameters = {}) {
        this._parameters = parameters;
    }

    class() {
        return this.constructor;
    }

    className() {
        return this.class().name;
    }

    static Class() {
        return this.prototype.constructor;
    }

    static ClassName() {
        return this.Class().name;
    }

}

class Utils {

    static IsString(x) {
        return _.isString(x);
    }

    static IsArray(x) {
        return _.isArray(x);
    }

    static IsFunction(x) {
        return _.isFunction(x);
    }

    static IsDefined(x) {
        return x != undefined && x != null;
    }

    static IsNotDefined(x) {
        return !this.IsDefined(x);
    }

    static Merge(...objects) {
        return _.merge({}, ...objects);
    }

}

class Strings {

    static DoubleQuotes(s) {
        return '"' + s + '"';
    }
}

class Arrays {

    static ToArray(x) {
        if (Utils.IsArray(x)) {
            return x;
        } else if (Utils.IsNotDefined(x)) {
            return []
        } else {
            return [x];
        }
    }

}

module.exports.ObjectBase = ObjectBase;
module.exports.Utils = Utils;
module.exports.Strings = Strings;
module.exports.Arrays = Arrays;

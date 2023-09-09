const { _ } = require("lodash");
const cuid = require("cuid");
const normalize = require("normalize-path");

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

    static IsObject(x) {
        return _.isObject(x);
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

    static RemoveProperties(object, names) {
        for (const name of Strings.ToArray(names)) {
            delete object[name]
        }
    }

}

class Strings {

    static SingleQuotes(s) {
        return "'" + s + "'";
    }

    static DoubleQuotes(s) {
        return '"' + s + '"';
    }

    static NewGuid() {
        return cuid();
    }

    static ToArray(s, separator = ",") {
        if (Utils.IsArray(s)) {
            return s;
        } else {
            return s.split(separator)
        }
    }

    static OneSpace(s) {
        return s.replace(/\s\s+/g, ' ');
    }

    static EqualsIgnoreCase(s1, s2) {
        return (s1.toLowerCase() == s2.toLowerCase());
    }
}

class Dates {

    static TimeStamp() {
        return new Date().toUTCString();
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

class Http {

    static Unauthorized = 401;
    static BadRequest = 400;
    static InternalError = 500;

}

class Path {

    static Normalize(path) {
        const normalized = normalize(path);
        return encodeURI(normalized);
    }

    static Concatenate(...path) {
        return this.Normalize(path.join("/"));
    }

}

module.exports.ObjectBase = ObjectBase;
module.exports.Utils = Utils;
module.exports.Strings = Strings;
module.exports.Dates = Dates;
module.exports.Arrays = Arrays;
module.exports.Http = Http;
module.exports.Path = Path;
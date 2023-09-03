const { _ } = require("lodash");

class ObjectBase {

    constructor(parameters = {}) {
        this.parameters = parameters;
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

class TextBuilder extends ObjectBase {

    constructor(parameters) {
        super(parameters)
        this.items = Arrays.ToArray(this.parameters.items);
        this.itemSeparator = this.parameters.itemSeparator || " ";
    }

    add(item) {
        this.items.push(item);
        return this;
    }

    addIf(condition, item) {
        if (condition) {
            this.items.push(item);
        }
        return this;
    }

    addFirst(item) {
        this.items.unshift(item);
        return this;
    }

    text() {
        let text = "";
        this.finalItems().forEach((item, i) =>
            text += this.beforeItem(item, i) + item + this.afterItem(item, i))
        return text;
    }

    finalItems() {
        if (this._finalItems == undefined) {
            this._finalItems = this.defineFinalItems();
        }
        return this._finalItems;
    }

    defineFinalItems() {
        return this.items
            .map((item, i) =>
                this.itemToText(item, i))
            .filter(item =>
                Utils.IsDefined(item))
    }

    itemToText(item, i) {
        if (item instanceof TextBuilder) {
            return item.text();
        } else if (Utils.IsFunction(item)) {
            return this.itemToText(item(i))
        } else if (Utils.IsDefined(item)) {
            return item.toString()
        }
    }

    beforeItem(item, i) {
        if (i == 0) {
            return ""
        } else {
            return this.itemSeparator;
        }
    }

    afterItem(item, i) {
        return "";
    }

}

module.exports.ObjectBase = ObjectBase;
module.exports.Utils = Utils;
module.exports.Strings = Strings;
module.exports.Arrays = Arrays;
module.exports.TextBuilder = TextBuilder;
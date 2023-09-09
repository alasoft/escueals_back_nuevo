const { Utils, ObjectBase } = require("./utils")
const { Exceptions } = require("./exceptions")

class TextBuilder extends ObjectBase {

    constructor(parameters) {
        super(parameters)
        this.items = [];
        this.separator = this._parameters.separator || " ";
        if (Utils.IsDefined(this._parameters.items)) {
            this.add(this._parameters.items)
        }
    }

    add(item) {
        if (Utils.IsArray(item)) {
            for (const element of item) {
                this.add(element);
            }
        } else {
            this.items.push(item)
        }
        return this;
    }

    addIf(condition, item) {
        if (condition) {
            if (Utils.IsArray(item)) {
                Exceptions.CannotBeArray({ data: item })
            }
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
        return this.finalText(text, this.finalItems().length);
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
        if (Utils.IsDefined(item)) {
            if (Utils.IsObject(item)) {
                return item.text()
            } else if (Utils.IsFunction(item)) {
                return this.itemToText(item(i))
            } else {
                return item.toString();
            }
        }
    }

    beforeItem(item, i) {
        if (i == 0) {
            return ""
        } else {
            return this.separator;
        }
    }

    afterItem(item, i) {
        return "";
    }

    finalText(text) {
        return text;
    }

}

module.exports.TextBuilder = TextBuilder;
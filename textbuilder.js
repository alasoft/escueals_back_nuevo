const { Utils, Arrays, ObjectBase } = require("./utils")
const { Sql } = require("./sql")

class TextBuilder extends ObjectBase {

    constructor(parameters) {
        super(parameters)
        this.items = Arrays.ToArray(this._parameters.items);
        this.itemSeparator = this._parameters.itemSeparator || " ";
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

    parameters(paramValues) {
        this.paramValues = Utils.Merge(this.paramValues, paramValues);
        return this;
    }

    text() {
        let text = "";
        this.finalItems().forEach((item, i) =>
            text += this.beforeItem(item, i) + item + this.afterItem(item, i))
        text = this.finalText(text, this.finalItems().length);
        return this.setParamValues(text);
    }

    setParamValues(text) {
        if (Utils.IsDefined(this.paramValues)) {
            Object.keys(this.paramValues).forEach(name =>
                text = text.replace(new RegExp("@" + name, "ig"), Sql.Value(this.paramValues[name]))
            )
        }
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

    finalText(text) {
        return text;
    }

}

module.exports.TextBuilder = TextBuilder;
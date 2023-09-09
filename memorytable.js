const { Strings } = require("./utils");

class MemoryTable {

    items() {
        if (this._items == undefined) {
            this.defineItems();
        }
        return this._items;
    }

    defineItems() {
        this._items = [];
        this.addItems();
    }

    addItems() { }

    addItem(item) {
        this._items.push(item);
        return this;
    }

    add(codigo, descripcion) {
        return this.addItem({ codigo, descripcion })
    }

    get(id) {
        return this.items().find(item =>
            item.id == id)
    }

    getNombre(id) {
        const item = this.get(id);
        if (item != undefined) {
            return item.id;
        }
    }

    getId(descripcion) {
        const item = this.items().find(item =>
            Strings.EqualsIgnoreCase(item.descripcion, descripcion));
        if (item != undefined) {
            return item.id
        }
    }

}

module.exports.MemoryTable = MemoryTable;
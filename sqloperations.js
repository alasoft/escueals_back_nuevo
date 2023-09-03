const { ObjectBase, Utils, Arrays } = require("./utils")
const { TextBuilder } = require("./textbuilder")
const { Sql, SqlTypes } = require("./sql")

class SqlOperationBase extends ObjectBase {

    constructor(parameters) {
        super(parameters)
        this.tableName = this._parameters.tableName;
    }

}

class SqlCreate extends SqlOperationBase {

    constructor(parameters) {
        super(parameters);
        this.columns = this._parameters.columns;
        this.unique = this._parameters.unique;
        this.addDefaults()
    }

    addDefaults() {
        this.columns.id = SqlTypes.Pk();
        this.columns.tenant = SqlTypes.Tenant();
        this.columns._created = SqlTypes.Created();
        this.columns._updated = SqlTypes.Updated()
        this.columns._state = SqlTypes.State();
    }

    text() {
        const textBuilder = new TextBuilder();
        textBuilder
            .add("create table")
            .add("if not exists")
            .add(Sql.TableName(this.tableName))
            .add("(");
        Object.keys(this.columns).forEach(
            (name, i) => textBuilder.add((0 < i ? "," : "") + Sql.ColumnName(name) + " " + this.columns[name])
        )
        return textBuilder
            .add(this.sqlUnique())
            .add(")")
            .text()
    }

    sqlUnique() {
        if (Utils.IsDefined(this.unique)) {
            const textBuilder = new TextBuilder();
            Arrays.ToArray(this.unique).forEach(names =>
                textBuilder
                    .add(",")
                    .add("unique")
                    .add("(")
                    .add(Sql.ColumnName("tenant"))
                    .add(",")
                    .add(names.split(",").map(name => Sql.ColumnName(name)).join(","))
                    .add(")")
            )
            return textBuilder.text();
        }
    }

}

class SqlUpdateBase extends SqlOperationBase {

    constructor(parameters) {
        super(parameters);
        this.columns = this._parameters.columns;
    }

    text() {
        const textBuilder = new TextBuilder();
        textBuilder
            .add("update table")
            .add(this.tableName)
            .add("set")
        Object.keys(this.columns).forEach((name, i) =>
            textBuilder.add((0 < i ? "," : "") + Sql.ColumnName(name) + "=" + Sql.Value(this.columns[name]))
        )
        return textBuilder
            .text();
    }

}

class SqlUpdateId extends SqlUpdateBase {

    text() {
        return new TextBuilder()
            .add(super.text())
            .add(this.sqlWhere())
            .text()
    }

    sqlWhere() {
        return new SqlWhere()
            .add("tenant=@tenant")
            .add("id=@id")
            .parameters({ tenant: this._parameters.tenant, id: this._parameters.id })
    }


}

class SqlDelete {

}

class SqlWhere extends TextBuilder {

    beforeItem(itemText, i) {
        if (i == 0) {
            return "where ("
        } else {
            return " and ";
        }
    }

    finalText(text, itemCount) {
        if (0 < itemCount) {
            return text + ")";
        }
    }

}

module.exports.SqlCreate = SqlCreate;
module.exports.SqlUpdateId = SqlUpdateId;
module.exports.SqlWhere = SqlWhere;
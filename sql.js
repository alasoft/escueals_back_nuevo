const { escape } = require("sqlutils/pg");

const { ObjectBase, Utils, Strings, Arrays, Dates } = require("./utils")
const { TextBuilder } = require("./textbuilder");
const { Exceptions } = require("./exceptions");

class Sql extends Object {

    static TableName(name) {
        return Strings.DoubleQuotes(name);
    }

    static ColumnName(name) {
        return Strings.DoubleQuotes(name)
    }

    static Value(x) {
        return escape(x);
    }

    static CreateSimple(parameters) {
        return new SqlCreate({ columns: { descripcion: SqlTypes.Descripcion() } })
    }

    static Transact(sql) {
        return new TextBuilder({ separator: ";" })
            .addFirst(this.BeginTransaction())
            .add(sql)
            .add(this.Commit())
            .text()
    }

    static BeginTransaction() {
        return "start transaction";
    }

    static Commit() {
        return "commit";
    }

}

class SqlTypes {

    static Pk() {
        return "varchar(38) primary key not null"
    }

    static Tenant() {
        return "varchar(38) not null";
    }

    static Created() {
        return "timestamp not null";
    }

    static Updated() {
        return "timestamp";
    }

    static State() {
        return "int not null";
    }

    static String(parameters = {}) {
        return "varchar(" + (parameters.size || 100) + ")" + this.Required(parameters);
    }

    static Apellido() {
        return this.String({ size: 25, required: true })
    }

    static Nombre() {
        return this.String({ size: 25, required: true })
    }

    static Descripcion() {
        return this.String({ size: 50, required: true })
    }

    static Email(parameters = {}) {
        return "varchar(100)" + this.Required(parameters);
    }

    static Required(parameters) {
        return (parameters.required == true ? " not null" : "")
    }

}

class SqlCrudBase extends ObjectBase {

    constructor(parameters) {
        super(parameters);
        this.checkRequired();
        this.setDefaults();
    }

    checkRequired() { }

    tenantRequired() {
        if (Utils.IsNotDefined(this.tenant)) {
            throw Exceptions.TenantNotDefined()
        }
    }

    idRequired() {
        if (Utils.IsNotDefined(this._parameters.id)) {
            throw Exceptions.IdNotDefined()
        }
    }

    columnsRequired() {
        if (Utils.IsNotDefined(this._parameters.columns)) {
            throw Exceptions.ColumnsNotDefined()
        }
    }

    whereRequired() {
        if (Utils.IsNotDefined(this._parameters.where)) {
            throw Exceptions.WhereRequired()
        }
    }

    setDefaults() { }

    sqlWhereId() {
        return new SqlWhere()
            .add("tenant=@tenant")
            .add("id=@id")
            .parameters({ tenant: this.tenant, id: this.id })
    }

    get tenant() {
        return this._parameters.tenant;
    }

    get tableName() {
        return this._parameters.tableName;
    }

    get id() {
        return this._parameters.id
    }

    get columns() {
        return this._parameters.columns;
    }

    get unique() {
        return this._parameters.unique;
    }

    get where() {
        return this._parameters.where;
    }

}

class SqlCreate extends SqlCrudBase {

    checkRequired() {
        this.tenantRequired();
        this.columnsRequired();
    }

    setDefaults() {
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

class SqlInsert extends SqlCrudBase {

    checkRequired() {
        this.tenantRequired();
        this.idRequired();
        this.columnsRequired();
    }

    setDefaults() {
        this.columns.tenant = this.tenant;
        this.columns.id = this.id;
        this.columns._created = Dates.TimeStamp();
    }

    text() {
        const textBuilder = new TextBuilder();
        textBuilder
            .add("insert into")
            .add(Sql.TableName(this.tableName))
            .add("(");
        Object.keys(this.columns).forEach(
            (name, i) => textBuilder.add((0 < i ? ", " : "") + Sql.ColumnName(name))
        )
        textBuilder.add(")")
            .add("values")
            .add("(");
        Object.keys(this.columns).forEach(
            (name, i) => textBuilder.add((0 < i ? ", " : "") + this.Sql.Value(this.columns[name]))
        )
        return textBuilder
            .add(")")
            .text();
    }

}

class SqlUpdateBase extends SqlCrudBase {

    setDefaults() {
        Utils.RemoveProperties(this.columns, "tenant,id");
        this.columns._updated = Dates.TimeStamp();
    }

    text() {
        const textBuilder = new TextBuilder();
        textBuilder
            .add("update table")
            .add(Sql.TableName(this.tableName))
            .add("set")
        Object.keys(this.columns).forEach((name, i) =>
            textBuilder.add((0 < i ? "," : "") + Sql.ColumnName(name) + "=" + Sql.Value(this.columns[name]))
        )
        return textBuilder
            .text();
    }

}

class SqlUpdateId extends SqlUpdateBase {

    checkRequired() {
        this.tenantRequired();
        this.idRequired();
    }

    text() {
        return new TextBuilder()
            .add(super.text())
            .add(this.sqlWhereId())
            .text()
    }

}


class SqlUpdateWhere extends SqlUpdateBase {

    checkRequired() {
        super.tenantRequired();
        this.whereRequired();
    }

    text() {
        return new TextBuilder()
            .add(super.text())
            .add(this.where)
            .text()
    }

}

class SqlDeleteId extends SqlCrudBase {

    checkRequired() {
        this.tenantRequired();
        this.idRequired();
    }

    text() {
        return new TextBuilder()
            .add("delete table")
            .add(Sql.TableName(this.tableName))
            .add(this.sqlWhereId())
            .text()
    }

}

class SqlDeleteWhere extends SqlCrudBase {

    checkRequired() {
        this.tenantRequired();
        this.whereRequired();
    }

    text() {
        return new TextBuilder()
            .add("delete table")
            .add(Sql.TableName(this.tableName))
            .add(this.where)
            .text()
    }

}

class SqlWhere extends SqlText {

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

class SqlAnd extends TextBuilder {

    addSql(sql, parameters) {
        return this.add(new SqlText({ items: sql, paramValues: parameters }))
    }

    beforeItem(item, i) {
        if (i == 0) {
            return ""
        } else {
            return " and ";
        }
    }

    finalText(text, itemCount) {
        if (1 < itemCount) {
            return "(" + text + ")";
        } else {
            return text;
        }
    }

}

class SqlText extends TextBuilder {

    constructor(parameters) {
        super(parameters);
        this.paramValues = this._parameters.paramValues;
    }

    parameters(paramValues) {
        this.paramValues = Utils.Merge(this.paramValues, paramValues);
        return this;
    }

    text() {
        return this.setParamValues(super.text())
    }

    setParamValues(text) {
        if (Utils.IsDefined(this.paramValues)) {
            Object.keys(this.paramValues).forEach(name =>
                text = text.replace(new RegExp("@" + name, "ig"), Sql.Value(this.paramValues[name]))
            )
        }
        return text;
    }

}

module.exports.Sql = Sql;
module.exports.SqlTypes = SqlTypes;
module.exports.SqlCreate = SqlCreate;
module.exports.SqlInsert = SqlInsert;
module.exports.SqlUpdateId = SqlUpdateId;
module.exports.SqlUpdateWhere = SqlUpdateWhere;
module.exports.SqlDeleteId = SqlDeleteId;
module.exports.SqlWhere = SqlWhere;
module.exports.SqlText = SqlText;
const { TextBuilder } = require("./textbuilder");
const { ObjectBase, Utils, Strings } = require("./utils");

class SqlSelect extends ObjectBase {

    get tenant() {
        return this._parameters.tenant;
    }

    get filterByTenant() {
        return this._parameters.filterByTenant != false;
    }

    get filterByState() {
        return this._filterByState != false;
    }

    get distinct() {
        return this._parameters.distinct == true;
    }

    selectAll() {
        if (Utils.IsDefined(this.from.alias)) {
            return this.from.alias + ".*"
        } else {
            return "*"
        }
    }

    tenantAndStateConditions(tenantColumn, stateColumn) {
        return new SqlAnd()
            .addIf(this.filterByTenant, () =>
                tenantColumn + "=" + Strings.SingleQuotes(this.tenant))
            .addIf(0 < this.filterByStates.length, () =>
                stateColumn + " in (" + this.Sql.In(this.filterByStates) + ")")
    }

    baseJoinConditions(sqlJoin) {
        return this.tenantAndStateConditions(sqlJoin.alias + ".tenant", sqlJoin.alias + "._state");
    }

}

class SqlColumns extends TextBuilder {

    get sqlSelect() {
        return this._parameters.sqlSelect;
    }

    beforeItem(itemText, i) {
        if (i == 0) {
            return "select " + (this.sqlSelect.distinct ? "distinct " : "")
        } else {
            return ", ";
        }
    }

    finalText(text, itemCount) {
        if (itemCount == 0) {
            return "select " + this.sqlSelect.selectAll();
        } else {
            return text;
        }
    }

}

class SqlTableNameAlias extends ObjectBase {

    constructor(parameters) {
        super(parameters)
        if (Utils.IsString(_parameters)) {
            this.splitTableNameAlias(_parameters);
        } else {
            this.tableName = _parameters.tableName;
            this.alias = _parameters.alias;
        }
    }

    splitTableNameAlias(tableNameAlias) {
        const split = tableNameAlias.split(/\s+/);
        this.tableName = split[0];
        if (1 < split.length) {
            this.alias = split[1];
        }
    }

    text() {
        return this.tableName + (Utils.IsDefined(this.alias) ? " " + this.alias : "");
    }


}

class SqlFrom extends SqlTableNameAlias {

    text() {
        return "from " + super.text();
    }

}

class SqlJoins extends TextBuilder {

    constructor(parameters = {}) {
        super(parameters);
        this.addJoins();
    }

    get sqlSelect() {
        return this._parameters.sqlSelect;
    }

    get joins() {
        return this._parameters.joins || [];
    }

    addJoins() {
        this.joins.forEach(
            join => this.add(new SqlJoin(Utils.Merge(join, { sqlSelect: this.sqlSelect })))
        )
    }

    tenant() {
        return this.sqlSelect.tenant;
    }

}


class SqlJoin extends ObjectBase {

    constructor(parameters) {
        super(parameters)
        this.tableNameAlias = new SqlTableNameAlias(this._parameters.tableName);
    }

    get tableName() {
        return this.tableNameAlias.tableName;
    }

    get alias() {
        return this.tableNameAlias.alias;
    }

    get columnName() {
        return this._parameters.columnName;
    }

    get condition() {
        return this._parameters.condition;
    }

    text() {
        return new TextBuilder()
            .add("left join")
            .add(this.tableName + " " + this.alias)
            .add("on")
            .add("(")
            .add(new SqlAnd()
                .add(this.sqlSelect.baseJoinConditions(this))
                .addIfElse(this.condition != undefined,
                    this.condition,
                    this.alias + ".id=" + this.columnName
                )
            )
            .add(")")
            .text();
    }

}
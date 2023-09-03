const { Strings } = require("./utils")

class Sql {

    static TableName(name) {
        return Strings.DoubleQuotes(name);
    }

    static ColumnName(name) {
        return Strings.DoubleQuotes(name)
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

    static Email(parameters = {}) {
        return "varchar(100)" + this.Required(parameters);
    }

    static Required(parameters) {
        return (parameters.required == true ? " not null" : "")
    }

}


module.exports.Sql = Sql;
module.exports.SqlTypes = SqlTypes;
const { Sql } = require("./sql")

class CreateTables {

    execute() {

    }

    sql() {
        return [
            Sql.CreateSimple({ tableName: "escuelas" }),
            Sql.CreateSimple({ tableName: "modalidades" }),
            Sql.CreateSimple({ tableName: "materias" })
        ]
    }

}
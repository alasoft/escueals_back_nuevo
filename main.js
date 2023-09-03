const { SqlCreate, SqlUpdateId } = require("./sqloperations")
const { SqlTypes } = require("./sql")

const text = sqlUpdate();

console.log(text);

function sqlCreate() {
    return new SqlCreate({
        tableName: "alumnos",
        columns: {
            apellido: SqlTypes.Apellido(),
            nombre: SqlTypes.Nombre(),
            email: SqlTypes.Email({ required: true })
        },
        unique: ["apellido,nombre", "email"],
    }).text()
}

function sqlUpdate() {
    return new SqlUpdateId({
        tenant: "ad3405823-080d",
        id: "d-fa0df8a-0df8a0df8-a",
        tableName: "alumnos",
        columns: {
            nombre: "Juan",
            apellido: 1
        }
    }).text()
}



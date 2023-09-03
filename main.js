const { SqlCreate } = require("./sqloperations")
const { SqlTypes } = require("./sql")

const text = new SqlCreate({
    tableName: "alumnos",
    columns: {
        apellido: SqlTypes.Apellido(),
        nombre: SqlTypes.Nombre(),
        email: SqlTypes.Email({ required: true })
    },
    unique: ["apellido,nombre", "email"],
}).text()

console.log(text);
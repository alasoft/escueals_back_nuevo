const { SqlCreate, SqlUpdateId, Sql, SqlTypes } = require("./sql")
const { TextBuilder } = require("./textbuilder");

const s = Sql.TableName("A");
const textBuilder = new TextBuilder();
const text = sqlUpdate();

console.log(text);

const create = new SqlCreate({
    tableName: "alumnos",
    columns: {
        apellido: SqlTypes.Apellido(), nombre: SqlTypes.Nombre()
    },
    unique: "apellido,nombre"
}).text()

console.log(create)


function SqlSelect() {
    return new SqlSelect({

    })
}

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

function SqlInsert() {
    return new SqlInsert({
        tenant: "adf0-.435/45-4--4352443",
        tableName: "alumnos",
        columns: {
            nombre: "Juan",
            apellido: "Perez"
        }
    })
}
const { Exceptions } = require("./exceptions");
const { SqlInsert, SqlUpdateId, SqlDeleteId } = require("./sql");
const { ObjectBase, Utils, Strings } = require("./utils");

class ServiceBase extends ObjectBase {

    get db() {
        return this._parameters.db;
    }

    get req() {
        return this._parameters.req;
    }

    get user() {
        return this.req._user;
    }

    get values() {
        return this.req.body;
    }

    get res() {
        return this._parameters.res;
    }

    tenant() {
        if (Utils.IsDefined(this.user)) {
            return this.user.tenant;
        }
    }

    id() {
        return this.values.id;
    }

    value(name) {
        return this.values[name];
    }

    date(name) {
        const value = this.value(name);
        if (Utils.IsDefined(value)) {
            return new Date(this.value(name));
        }
    }

    isDefined(name) {
        return Utils.isDefined(this.value(name));
    }

    validaRequired() {
        return new Promise((resolve, reject) => {
            const requiredValues = this.requiredValues();
            if (Utils.IsDefined(names)) {
                for (const name of requiredValues.split(",")) {
                    if (!this.isDefined(name)) {
                        throw Exceptions.RequiredValue({ detail: name })
                    }
                }
            }
            resolve(true)
        })
    }

    requiredeValues() { }

    jsonFromNames(names) {
        const json = {}
        const properties = names.split(",");
        properties.forEach(name =>
            json[name] = this.value(name))
        return json;
    }

    sqlInsert(parameters = {}) {
        parameters.tenant = this.tenant();
        return new SqlInsert(parameters);
    }

    sqlUpdateId(parameters = {}) {
        parameters.tenant = this.tenant();
        return new SqlUpdateId(parameters)
    }

    sqlDeleteId(parameters = {}) {
        parameters.tenant = this.tenant();
        return new SqlDeleteId(parameters);
    }


}
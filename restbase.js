const { ObjectBase, Path } = require("./utils");
const { Log } = require("./log");

class RestBase extends ObjectBase {

    constructor(parameters) {
        super(parameters);
        this.mustAuthenticate = true;
    }

    get app() {
        return this._parameters.app;
    }

    get path() {
        return this._parameters.path;
    }

    buildVerb(verb, serviceClass) {
        const verbPath = this.verbPath(verb);
        Log.VerbPath({ message: verbPath })
        this.app.express.post(verbPath, this.authenticate.bind(this), (req, res) => {
            new serviceClass(this.serviceParameters(req, res)).execute()
        })
    }

    verbPath(verb) {
        return Path.Concatenate(this.app.root, this.path, verb)
    }

    authenticate(req, res, next) {
        if (this.mustAuthenticate == true) {
            this.app.authenticate(req);
        }
        next();
    }

    serviceParameters(req, res) {
        return Utils.Merge(this._parameters, { req, res });
    }

}
class ModulesList {
    constructor() {
        this.data = {};
    }

    addModule(name,module) {
        this.data[name] = module;
    }

    getModule(name) {
        return this.data[name];
    }

    getOnlineModules() {
        let result = "";
        for (let key in this.data) {
            if(this.data[key].online === true) {
                result += key+" ";
            }
        }
        return result;
    }
}

function create() {
    return new ModulesList();
}

exports.create = create;
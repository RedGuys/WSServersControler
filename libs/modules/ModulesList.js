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
}

function create() {
    return new ModulesList();
}

exports.create = create;
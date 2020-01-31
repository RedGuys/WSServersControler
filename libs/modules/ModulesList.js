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

    getOnlineModulesList() {
        let result = "";
        for (let key in this.data) {
            if(this.data[key].online === true) {
                result += key+" ";
            }
        }
        return result;
    }

    getModulesList() {
        let result = "";
        for (let key in this.data) {
            result += key+" ";
        }
        return result;
    }

    isLoaded(moduleName) {
        for (let key in this.data) {
            if(key === moduleName) {
                return true
            }
        }
        return false;
    }

    isOnline(moduleName) {
        for (let key in this.data) {
            if(key === moduleName) {
                return this.data[key].online;
            }
        }
        return false;
    }
}

function create() {
    return new ModulesList();
}

exports.create = create;
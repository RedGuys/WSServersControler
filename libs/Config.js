const yaml = require("js-yaml");
const fs = require("fs");
const logger = require("./Logger");

class ConfigObject {
    constructor(object) {
        this.data = object;
    }

    getVariable(name) {
        return this.data[name];
    }

    getConfigObject(name) {
        return new ConfigObject(this.data[name]);
    }

    getConfigArray(name) {
        return new ConfigArray(this.data[name]);
    }

    isDataAvailable() {
        return this.data !== undefined;
    }
}

class ConfigArray {
    constructor(array) {
        this.data = array;
    }

    getElementById(id) {
        return this.data[id];
    }

    getConfigObject(name) {
        return new ConfigObject(this.data[name]);
    }

    getConfigArray(name) {
        return new ConfigArray(this.data[name]);
    }

    getLength() {
        if(this.data === null) return 0;
        return this.data.length;
    }
}

function LoadFile(fileName,module) {
    let fileData = null;
    try {
         fileData = yaml.safeLoad(fs.readFileSync(fileName));
    } catch (e) {
        logger.errorFromModule(module,"Error reading the file '"+fileName+"': "+e);
    }
    return new ConfigObject(fileData);
}

exports.LoadFile = LoadFile;
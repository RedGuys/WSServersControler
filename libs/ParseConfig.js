const configReader = require("./Config");
const logger = require("./Logger");
const ModulesList = require("./modules/ModulesList");
const fs = require("fs");

class cnfParser {
    _config = {};
    _modules = ModulesList.create();
    _paths = {};
    options = {};
    constructor() {
        logger.info("Reading config");

        let config = configReader.LoadFile('config.yml',"main");
        let tmp = {};

        tmp["https"] = config.getConfigObject("Https");
        tmp["modules"] = config.getConfigObject("Modules");
        tmp["general"] = config.getConfigObject("General");

        this._config["general"] = {};
        this._config["general"]["port"] = 8080;

        if(tmp["https"] !== undefined) {
            if(tmp["general"]["port"] !== undefined) {
                this._config["general"]["port"] = tmp["general"]["port"];
            }
        }

        this._config["automatic"] = {};
        this._config["automatic"]["useHttps"] = false;

        if(tmp["https"] !== undefined) {
            this._config["https"] = {};
            this._config["https"]["certPath"] = tmp["https"].getVariable("certPath");
            this._config["https"]["keyPath"] = tmp["https"].getVariable("keyPath");
            this._config["https"]["caPath"] = tmp["https"].getVariable("caPath");
            this._config["automatic"]["useHttps"] = true;
        }

        this._config["modules"] = {};
        this._config["modules"]["autostart"] = tmp["modules"].getConfigArray("autostart");
        logger.info("Config readed");

        logger.info("Starting https server");
        if(this._config["automatic"]["useHttps"]) {
            this.options["cert"] = fs.readFileSync(this._config["https"]["certPath"]);
            this.options["key"] = fs.readFileSync(this._config["https"]["keyPath"]);
            if(this._config["https"]["caPath"] !== undefined) {
                this.options["ca"] = fs.readFileSync(this._config["https"]["caPath"]);
            }
        }
    }
}

module.exports.cnfParser = cnfParser;
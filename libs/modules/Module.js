const Logger = require("../Logger");
const fs = require("fs");
const Config = require("../Config");
const WebSocket = require('ws');

class Module {
    constructor(moduleName) {
        Logger.infoFromModule(moduleName,"Loading config for module "+moduleName);
        this.name = moduleName;
        this.techName = this.name;
        let stats = fs.statSync("./modules/"+moduleName+"/config.yml");
        if (!stats.isFile()) {
            Logger.errorFromModule(moduleName, "Config for " + moduleName + " not found!");
        } else {
            this.config = Config.LoadFile("modules/" + moduleName + "/config.yml", moduleName);
            this.techName = this.config.getVariable("name");
            Logger.infoFromModule(moduleName, "Config loaded");
        }
    }

    start() {
        let serverOptions = {
            noServer:true
        };
        if(this.config.getVariable("backlog") !== undefined) {
            serverOptions["backlog"] = this.config.getVariable("backlog");
        }
        if(this.config.getVariable("clientTracking") !== undefined) {
            serverOptions["clientTracking"] = this.config.getVariable("clientTracking");
        }
        if(this.config.getVariable("maxPayload") !== undefined) {
            serverOptions["maxPayload"] = this.config.getVariable("maxPayload");
        }
        // noinspection JSCheckFunctionSignatures
        this.webSocket = new WebSocket.Server(serverOptions);
        this.online = true;
        Logger.infoFromModule(this.techName,"Starting...");
        this.module = new (require("../../modules/"+this.name+"/"+this.config.getVariable("runFile")));
        if('start' in this.module) {
            this.module.start();
        }
        let module = this.module;
        this.webSocket.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                if('onMessage' in module) {
                    module.onMessage(message, ws);
                }
            });
            ws.on('close', function close(code,reason) {
                if('onClientClose' in module) {
                    module.onClientClose(code,reason);
                }
            });
            ws.on('error', function error(error) {
                if('onError' in module) {
                    module.onError(error);
                }
            });
            if('onConnection' in module) {
                module.onConnection(ws);
            }
        });
        let self = this;
        this.webSocket.on('close', function () {
            if(!self.manuallyStopt) {
                self.manuallyStopt = false;
                if ('onServerClose' in module) {
                    module.onServerClose();
                }
            }
        });
    }

    stop(code, data) {
        let waiter = true;
        function cb() {
            Logger.infoFromModule(moduleName,"Stopped...");
            waiter = false;
        }
        this.online = false;
        let moduleName = this.techName;
        if ('onServerManuallyClose' in this.module) {
            this.module.onServerManuallyClose();
        }
        this.manuallyStopt = true;
        this.webSocket.close(cb, "");
        while (waiter) {

        }
        this.webSocket = null;
    }

    unload() {
        delete this.config;
        delete this.module;
        delete this.webSocket;
        Logger.infoFromModule(this.techName,"Unloaded!");
        delete this.name;
        delete this;
    }
}

function load(moduleName) {
    return new Module(moduleName);
}

exports.load = load;

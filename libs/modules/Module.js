const Logger = require("../Logger");
const fs = require("fs");
const Config = require("../Config");
const WebSocket = require('ws');

class Module {
    constructor(moduleName) {
        Logger.infoFromModule(moduleName,"Starting load module "+moduleName);
        this.name = moduleName;
        let stats = fs.statSync("./modules/"+moduleName+"/config.yml");
        if (!stats.isFile()) {
            Logger.errorFromModule(moduleName, "Config for " + moduleName + " not found!");
        } else {
            this.config = Config.LoadFile("modules/" + moduleName + "/config.yml", moduleName);
            Logger.infoFromModule(moduleName, "Config loaded");
            this.webSocket = new WebSocket.Server({noServer:true});
        }
    }

    start() {
        Logger.infoFromModule(this.name,"Starting...");
        this.module = require("../../modules/"+this.name+"/"+this.config.getVariable("runFile"));
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
        this.webSocket.on('close', function () {
            if('onServerClose' in module) {
                module.onServerClose();
            }
        });
    }
}

function load(moduleName) {
    return new Module(moduleName);
}

exports.load = load;
const logger = require("./libs/Logger");
const Module = require("./libs/modules/Module");
const https = require("https");
const http = require("http");
const url = require('url');
const readline = require('readline');
const {cnfParser} = require("./libs/ParseConfig");

let cfgParser = new cnfParser();
let _config = cfgParser._config;
let _modules = cfgParser._modules;
let _paths = cfgParser._paths;
let options = cfgParser.options;

let tmp;
if(_config["automatic"]["useHttps"]) {
    tmp = https.createServer(options);
    logger.info("https server started!");
} else {
    tmp = http.createServer(options);
    logger.info("http server started!");
}
const server = tmp;

logger.info("Starting autostart servers");
for (let i = 0; i < _config["modules"]["autostart"].getLength(); i++) {
    let module = _config["modules"]["autostart"];
    _modules.addModule(module.getElementById(i),Module.load(_config["modules"]["autostart"].getElementById(i)));
    _paths[_modules.getModule(module.getElementById(i)).config.getVariable("path")] = module.getElementById(i);
    _modules.getModule(module.getElementById(i)).start();
}
logger.info("Autostart modules loaded");

logger.info("Start Main Server");
server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = url.parse(request.url).pathname;

    let finded = false;
    for (let pathsKey in _paths) {
        if(pathsKey === pathname) {
            _modules.getModule(_paths[pathsKey]).webSocket.handleUpgrade(request, socket, head, function done(ws) {
                _modules.getModule(_paths[pathsKey]).webSocket.emit('connection', ws, request);
                finded = true;
            });
        }
    }
    if(!finded) {
        socket.destroy();
    }
});

server.listen(_config["general"]["port"]);
logger.info("Main server loaded");

const consoleData = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
consoleData.on("line",function (input) {
    let command = input.split(" ");
    switch (command[0]) {
        case "list":
            if(command.length <= 1) {
                console.log("Usage: list [online/all]");
            } else {
                switch (command[1]) {
                    case "online":
                        console.log(_modules.getOnlineModulesList());
                        break;
                    case "all":
                        console.log(_modules.getModulesList());
                        break;
                }
            }
            break;
        case "start":
            if(command.length <= 1) {
                console.log("Usage: start (module name)");
            } else {
                if(_modules.isLoaded(command[1])) {
                    if(_modules.isOnline(command[1])) {
                        console.log("Module "+command[1]+" already online");
                    } else {
                        _modules.getModule(command[1]).start();
                    }
                } else {
                    _modules.addModule(command[1],Module.load(command[1]));
                    _paths[_modules.getModule(command[1]).config.getVariable("path")] = command[1];
                    _modules.getModule(command[1]).start();
                }
            }
            break;
        case "stop":
            if(command.length <= 1) {
                console.log("Usage: stop (module name)");
            } else {
                if(_modules.isOnline(command[1])) {
                    _modules.getModule(command[1]).stop();
                } else {
                    console.log("Module "+command[1]+" already stopt!");
                }
            }
            break;
        case "load":
            if(_modules.isLoaded(command[1])) {
                console.log("Module "+command[1]+" already loaded!");
            } else {
                for (let key in _paths) {
                    if (_paths[key] === command[1]) {
                        delete _paths[key];
                        break;
                    }
                }
                _modules.addModule(command[1], Module.load(command[1]));
                _paths[_modules.getModule(command[1]).config.getVariable("path")] = command[1];
            }
            break;
        case "unload":
            if(_modules.isLoaded(command[1])) {
                if(_modules.isOnline(command[1])) {
                    _modules.getModule(command[1]).stop();
                }
                _modules.getModule(command[1]).unload();
                _modules.removeModule(command[1]);
            } else {
                console.log("Module already unloaded!");
            }
            break;
        case "reload":
            if(_modules.isLoaded(command[1])) {
                if(_modules.isOnline(command[1])) {
                    _modules.getModule(command[1]).stop();
                }
                _modules.getModule(command[1]).unload();
                _modules.removeModule(command[1]);
            }
            _modules.addModule(command[1],Module.load(command[1]));
            _paths[_modules.getModule(command[1]).config.getVariable("path")] = command[1];
            _modules.getModule(command[1]).start();
            break;
    }
});
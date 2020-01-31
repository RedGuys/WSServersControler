const ModulesList = require("./libs/modules/ModulesList");
const logger = require("./libs/Logger");
const configReader = require("./libs/Config");
const Module = require("./libs/modules/Module");
const https = require("https");
const http = require("http");
const fs = require("fs");
const ws = require("ws");
const url = require('url');

logger.info("Reading config");
let _config = {};
let _modules = ModulesList.create();
let _paths = {};

let config = configReader.LoadFile('config.yml',"main");
let tmp = {};

tmp["https"] = config.getConfigObject("Https");
tmp["modules"] = config.getConfigObject("Modules");

_config["automatic"] = {};
_config["automatic"]["useHttps"] = false;

if(tmp["https"] !== undefined) {
    _config["https"] = {};
    _config["https"]["certPath"] = tmp["https"].getVariable("certPath");
    _config["https"]["keyPath"] = tmp["https"].getVariable("keyPath");
    _config["https"]["caPath"] = tmp["https"].getVariable("caPath");
    _config["automatic"]["useHttps"] = true;
}

_config["modules"] = {};
_config["modules"]["autostart"] = tmp["modules"].getConfigArray("autostart");
logger.info("Config readed");

logger.info("Starting https server");
let options = {};
if(_config["automatic"]["useHttps"]) {
    options["cert"] = fs.readFileSync(_config["https"]["certPath"]);
    options["key"] = fs.readFileSync(_config["https"]["keyPath"]);
    if(_config["https"]["caPath"] !== undefined) {
        options["ca"] = fs.readFileSync(_config["https"]["caPath"]);
    }
}



tmp = null;
if(_config["automatic"]["useHttps"]) {
    tmp = https.createServer(options);
} else {
    tmp = http.createServer(options);
}
const server = tmp;
logger.info("https server started!");

logger.info("Starting autostart servers");
for (let i = 0; i < _config["modules"]["autostart"].getLength(); i++) {
    let module = _config["modules"]["autostart"];
    _modules.addModule(module.getElementById(i),Module.load(_config["modules"]["autostart"].getElementById(i)));
    _modules.getModule(module.getElementById(i)).start();
    _paths[_modules.getModule(module.getElementById(i)).config.getVariable("path")] = module.getElementById(i);
}

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

server.listen(8080);
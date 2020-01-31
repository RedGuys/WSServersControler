exports.start = () => {
    console.log("I'm started!");
};

exports.onConnection = (ws) => {
    ws.send("Hello!");
    console.log("Connected new client!");
};

exports.onMessage = (message,ws) => {
    ws.send(message);
    console.log("I getted and recevived message: "+message);
};

exports.onServerClose = () => {
    console.log("I'm closing");
};

exports.onClientClose = (code, reason) => {
    console.log("Client disconnected with code "+code+" reason: "+reason);
};

exports.onError = (error) => {
    console.log("Error! "+error);
};
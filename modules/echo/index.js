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
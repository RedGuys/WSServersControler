exports.start = () => {
    console.log("I'm started!");
};

exports.onConnection = (ws) => {
    console.log("Connected new client!");
};

exports.onMessage = (message,ws) => {
    ws.send(message);
    console.log("I getted and recevived message: "+message);
};

exports.onClose = () => {
    console.log("I'm closing");
};
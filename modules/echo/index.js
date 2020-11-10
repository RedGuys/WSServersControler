class echo {
    start() {
        console.log("I'm started!");
    }

    onConnection(ws) {
        ws.send("Hello!");
        console.log("Connected new client!");
    }

    onMessage(message,ws) {
        ws.send(message);
        console.log("I getted and received message: "+message);
    }

    onServerClose() {
        console.log("I'm closing");
    }

    onServerManuallyClose() {
        console.log("I'm closing from console");
    }

    onClientClose(code, reason) {
        console.log("Client disconnected with code "+code+" reason: "+reason);
    }

    onError(error) {
        console.log("Error! "+error);
    }
}

module.exports = echo;
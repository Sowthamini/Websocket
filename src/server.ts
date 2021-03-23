const { client } = require("websocket");
const webSocket = require("ws");

const wss = new webSocket.Server({
  port: 8080,
});

const sendError = (ws: WebSocket, message: any) => {
  const messageObject = {
    type: "ERROR",
    error_message: message,
  };
  ws.send(JSON.stringify(messageObject));
};

wss.on("connection", (ws: any) => {
  ws.on("message", (data: any) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (e) {
      sendError(ws, "Wrong format");
      return;
    }
    let messageModel: { name: string; message: string; time: string } = message;
    if (messageModel.name && messageModel.message && messageModel.time) {
      wss.clients.forEach((client) => {
        if (client.readyState === webSocket.OPEN && client !== ws) {
          client.send(data);
        }
      });
    } else {
      ws.send("Something went wrong");
    }
  });
});

interface WebSocketData {
  username: string;
  tournamentId: string;
}

const server = Bun.serve<WebSocketData>({
  port: process.env.PORT || 4000,


  async fetch(req, server) {
    return undefined;
  },
  
  websocket: {
    open(ws) {
      const msg = `${ws.data.username} has entered`;
      ws.subscribe(ws.data.tournamentId);
      ws.publish(ws.data.tournamentId, msg);
    },
    message(ws, message) {
      // the server re-broadcasts incoming messages to everyone
      ws.publish(ws.data.tournamentId, `${ws.data.username}: ${message}`);
    },
    close(ws) {
      const msg = `${ws.data.username} has left`;
      server.publish(ws.data.tournamentId, msg);
      ws.unsubscribe(ws.data.tournamentId);
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

type Cookies = null | {
  auth_session: string;
};

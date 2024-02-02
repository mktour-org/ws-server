interface WebSocketData {
  username: string;
  tournamentId: string;
}

const server = Bun.serve<WebSocketData>({
  fetch(req, server) {
    const cookies = req.headers.get("cookie");
      const success = server.upgrade(req, { data: { username } });
    //   if (success) return undefined;
    console.log("fetch");
    return new Response(JSON.stringify(cookies));
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

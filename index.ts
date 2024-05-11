import { validateRequest } from '@/lib/lucia';

import { TLS } from './lib/config/tls';

interface WebSocketData {
  username: string;
  tournamentId: string;
}

const server = Bun.serve<WebSocketData>({
  port: process.env.PORT || 7070,
  tls: TLS,
  async fetch(req, server) {
    const url = new URL(req.url);
    const { user } = await validateRequest(
      url.searchParams.get('auth_session') ?? '',
    );

    const tournamentId = url.pathname.replace('/', '');
    server.upgrade(req, {
      data: { tournamentId, username: user?.username },
      headers: {
        'Set-Cookie': `SessionId=${user?.username}`,
      },
    });
    console.log(`we are fetched! by ${user?.username}`);

    return new Response(JSON.stringify(req.headers), {
      headers: { 'Content-Type': 'text/json' },
    });
  },

  websocket: {
    sendPings: true,
    open(ws) {
      const msg = `${ws.data.username} has entered`;
      console.log(msg);
      ws.subscribe(ws.data.tournamentId);
    },
    message(ws, message) {
      if (!message) ws.send('');
      else {
        console.log(ws.data.tournamentId, `${ws.data.username}: ${message}`);
        ws.publish(ws.data.tournamentId, message);
      }
    },
    close(ws) {
      const msg = `${ws.data.username} has left`;
      console.log(msg);
      ws.unsubscribe(ws.data.tournamentId);
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

import { validateRequest } from '@/lib/lucia';

import { TLS } from './lib/config/tls';
import { getStatusInTournament } from './lib/get-status-in-tournament';

import type { Status } from './lib/get-status-in-tournament';
import type { Message } from './types/ws-events';
import { errorMessage } from './lib/ws-error-message';

export interface WebSocketData {
  username: string;
  tournamentId: string;
  status: Status;
}

const server = Bun.serve<WebSocketData>({
  port: process.env.PORT || 7070,
  tls: TLS,
  async fetch(req, server) {
    const url = new URL(req.url);
    const session = req.headers.get('sec-websocket-protocol')
    const { user } = await validateRequest(
      session ?? '',
    );

    const tournamentId = url.pathname.replace('/', '');
    let status = await getStatusInTournament(user, tournamentId);

    server.upgrade(req, {
      data: { tournamentId, username: user?.username, status },
    });

    console.log(`we are fetched! by ${user?.username}`);

    return new Response(JSON.stringify(req.headers), {
      headers: { 'Content-Type': 'text/json' },
    });
  },

  websocket: {
    sendPings: true,
    open(ws) {
      const msg = `${ws.data.username} has entered. status: ${ws.data.status}`;
      console.log(msg);
      ws.subscribe(ws.data.tournamentId);
    },
    message(ws, message) {
      if (!message) ws.send('');
      else {
        if (message instanceof Buffer) return;
        const data = JSON.parse(message) as Message;
        if (ws.data.status === 'organizer') {
          console.log(ws.data.tournamentId, `${ws.data.username}: ${message}`);
          ws.publish(ws.data.tournamentId, message);
        } else {
          ws.send(errorMessage(data));
        }
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

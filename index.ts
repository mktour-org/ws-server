import { validateRequest } from '@/lib/lucia';

interface WebSocketData {
  username: string;
  tournamentId: string;
}

const server = Bun.serve<WebSocketData>({
  port: process.env.PORT || 7070,

  async fetch(req, server) {
    const url = new URL(req.url);
    const cookies: { [key: string]: string } = {};
    req.headers
      .get('cookie')
      ?.split('; ')
      ?.forEach((cook) => {
        const splittedCook = cook.split('=') as [string, string];
        cookies[splittedCook[0]] = splittedCook[1];
      });

    const { user } = await validateRequest(cookies?.auth_session || '');

    // console.log(user);
    const tournamentId = url.pathname.replace('/', '');
    server.upgrade(req, { data: { tournamentId, username: user?.username } });
    console.log(`we are fetched! by ${user?.username}`);
    return;
  },

  websocket: {
    open(ws) {
      const msg = `${ws.data.username} has entered`;
      ws.subscribe(ws.data.tournamentId);
      ws.publish(ws.data.tournamentId, msg);
    },
    message(ws, message) {
      // the server re-broadcasts incoming messages to everyone;
      console.log(ws.data.tournamentId, `${ws.data.username}: ${message}`);
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

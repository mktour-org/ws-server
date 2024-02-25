import type { Serve } from "bun";
import { lucia } from "@/lib/lucia";

interface WebSocketData {
  username: string;
  tournamentId: string;
}


export const SERVER_OPTIONS: Serve<WebSocketData> = {
  port: process.env.PORT || 8080,

  async fetch(req, server) {
    console.log(req, server)
    const url = new URL(req.url);
    const cookies: {[key: string]: string} = {};
    req.headers
      .get("cookie")
      ?.split("; ")
      ?.forEach((cook) => {
        const splittedCook = cook.split("=") as [string, string];
        cookies[splittedCook[0]] = splittedCook[1];
      });
    
    const { user } = await lucia.validateSession(cookies.auth_session);

    // console.log(user);
    const tournamentId = url.pathname.replace("/", "");
    server.upgrade(req, { data: { tournamentId, username: user?.username } });
    console.log("shit")
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
      console.log(message);
      console.log(ws.data.tournamentId, `${ws.data.username}: ${message}`);
      ws.publish(ws.data.tournamentId, `${ws.data.username}: ${message}`);
    },
    close(ws) {
      const msg = `${ws.data.username} has left`;
      ws.publish(ws.data.tournamentId, msg);
      ws.unsubscribe(ws.data.tournamentId);
    },
  },
}


type Cookies = null | {
  auth_session: string;
};



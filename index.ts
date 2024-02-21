import { SERVER_OPTIONS } from "./lib/socket";


const server = Bun.serve(SERVER_OPTIONS);
console.log(`Listening on ${server.hostname}:${server.port}`);


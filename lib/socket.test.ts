import { expect, test, describe, beforeAll, afterAll, beforeEach, afterEach} from "bun:test";
import { SERVER_OPTIONS } from "./socket";
import type { Server } from "bun";

let server: Server;
beforeAll(() => {
  server = Bun.serve(SERVER_OPTIONS);
  console.log(server)
})





describe("server checkup", () => {
  test("checkup server", 
    () => {
      const socket = new WebSocket(`ws://localhost:8080`);
      
      expect(socket).toBeInstanceOf(WebSocket);
    }
  )
})

describe("server connection", () => {
  let socket: WebSocket;
  beforeAll(() => {
    socket = new WebSocket(`ws://localhost:8080`);

  })
  test("connect to server", 
    () => {
      socket;
    }
  )
  afterAll(() => {
    socket.close()
  })
})



afterAll(() => {
  server.stop(true)
})

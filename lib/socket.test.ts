import { expect, test, describe, beforeAll, afterAll, beforeEach, afterEach} from "bun:test";
import { SERVER_OPTIONS } from "./socket";
import type { Server } from "bun";





describe("server", () => {
  let server: Server;
  beforeEach(() => {
    server = Bun.serve(SERVER_OPTIONS);
  })
  test("connect to server", 
    () => {
      const socket = new WebSocket(`ws://localhost:8080`);
      console.log(socket);
    }
  )
  afterEach(() => {
    server.stop(true)
  })
})

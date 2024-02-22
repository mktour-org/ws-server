import { expect, test, describe, beforeAll} from "bun:test";
import { SERVER_OPTIONS } from "./socket";



describe("server", () => {
  test("server startup", 
    () => {
      const server = Bun.serve(SERVER_OPTIONS);
      expect(server.hostname).toBe("localhost");
      expect(server.port).toBe(8080);
      server.stop();
    }
  )
})


describe("server connection", () => {
  beforeAll(() => {
    const server = Bun.serve(SERVER_OPTIONS);
  })
  test("connect to server", 
    () => {
      const socket = new WebSocket(`ws://localhost:8080`);
      console.log(socket);
    }
  )
})

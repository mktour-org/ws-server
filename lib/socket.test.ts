import { expect, test, describe } from "bun:test";
import { SERVER_OPTIONS } from "./socket";

describe("server", () => {
  test("server startup", 
    () => {
      const server = Bun.serve(SERVER_OPTIONS);
      expect(server.hostname).toBe("localhost");
      expect(server.port).toBe(8080);

    }
  )
})

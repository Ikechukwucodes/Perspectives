import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("development CORS", () => {
  it("allows the default Vite development origin", async () => {
    const response = await request(createApp())
      .options("/api/health")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "GET");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });
});

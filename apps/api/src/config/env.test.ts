import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getRootEnvPath } from "./env.js";

describe("environment configuration", () => {
  it("resolves the repository root .env from the API workspace", () => {
    expect(getRootEnvPath()).toBe(
      resolve(process.cwd(), "../../.env"),
    );
  });
});

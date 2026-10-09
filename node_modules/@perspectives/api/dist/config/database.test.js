import mongoose from "mongoose";
import { afterEach, describe, expect, it, vi } from "vitest";
import { connectDatabase } from "./database.js";
describe("database connection", () => {
    afterEach(() => vi.restoreAllMocks());
    it("reports a successful MongoDB connection", async () => {
        vi.spyOn(mongoose, "connect").mockResolvedValue(mongoose);
        const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
        await connectDatabase();
        expect(log).toHaveBeenCalledWith("MongoDB connected");
    });
});

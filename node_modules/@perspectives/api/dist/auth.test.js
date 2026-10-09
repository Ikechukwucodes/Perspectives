import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
const patient = {
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan@example.com",
    password: "StrongPass!123",
    confirmPassword: "StrongPass!123",
    dateOfBirth: "1992-03-14",
    country: "US",
    timezone: "America/New_York",
    termsConsent: true,
    privacyConsent: true,
    faithPreference: "optional",
};
const psychologist = {
    name: "Dr. Ada Stone",
    email: "ada@example.com",
    password: "StrongPass!123",
    confirmPassword: "StrongPass!123",
    professionalTitle: "Clinical Psychologist",
    country: "US",
    licenseInformation: "LIC-12345",
    specializations: ["Anxiety"],
    yearsOfExperience: 8,
    faithCompatibility: "open-to-discussion",
    termsConsent: true,
    privacyConsent: true,
    verificationAgreement: true,
};
function testApp() {
    return createApp();
}
describe("authentication", () => {
    it("requires a timezone during patient registration", async () => {
        const response = await request(testApp())
            .post("/api/auth/register/patient")
            .send({ ...patient, timezone: undefined });
        expect(response.status).toBe(400);
    });
    it("registers a patient without returning credentials", async () => {
        const response = await request(testApp())
            .post("/api/auth/register/patient")
            .send(patient);
        expect(response.status).toBe(201);
        expect(response.body.user).toMatchObject({
            email: patient.email,
            role: "patient",
        });
        expect(response.body.user).not.toHaveProperty("password");
        expect(response.body).not.toHaveProperty("accessToken");
    });
    it("rejects duplicate email addresses without revealing account details", async () => {
        const app = testApp();
        await request(app).post("/api/auth/register/patient").send(patient);
        const response = await request(app)
            .post("/api/auth/register/patient")
            .send(patient);
        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Unable to create account with these details.");
    });
    it("logs in valid credentials and supports authenticated identity lookup", async () => {
        const app = testApp();
        await request(app).post("/api/auth/register/patient").send(patient);
        const agent = request.agent(app);
        const login = await agent
            .post("/api/auth/login")
            .send({ email: patient.email, password: patient.password });
        const me = await agent.get("/api/auth/me");
        expect(login.status).toBe(200);
        expect(String(login.headers["set-cookie"])).toMatch(/HttpOnly/i);
        expect(me.body.user).toMatchObject({
            email: patient.email,
            role: "patient",
        });
    });
    it("rejects invalid credentials with a generic error", async () => {
        const app = testApp();
        await request(app).post("/api/auth/register/patient").send(patient);
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: patient.email, password: "wrong-password" });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password.");
    });
    it("enforces role restrictions and prevents public admin registration", async () => {
        const app = testApp();
        const agent = request.agent(app);
        await agent.post("/api/auth/register/patient").send(patient);
        const patientOnly = await agent.get("/api/admin/overview");
        const publicAdmin = await request(app)
            .post("/api/auth/register/admin")
            .send({ ...patient, email: "admin@example.com" });
        expect(patientOnly.status).toBe(403);
        expect(publicAdmin.status).toBe(404);
    });
    it("logs out and invalidates the refresh session", async () => {
        const app = testApp();
        const agent = request.agent(app);
        await agent.post("/api/auth/register/patient").send(patient);
        await agent.post("/api/auth/logout");
        expect((await agent.get("/api/auth/me")).status).toBe(401);
    });
    it("rejects an expired access session", async () => {
        let currentTime = 1_700_000_000_000;
        const app = createApp({ now: () => currentTime });
        const agent = request.agent(app);
        await agent.post("/api/auth/register/patient").send(patient);
        expect((await agent.get("/api/auth/me")).status).toBe(200);
        currentTime += 15 * 60 * 1000 + 1;
        expect((await agent.get("/api/auth/me")).status).toBe(401);
    });
    it("rejects malformed access cookies without throwing", async () => {
        const response = await request(testApp())
            .get("/api/auth/me")
            .set("Cookie", "access_token=malformed.signature");
        expect(response.status).toBe(401);
    });
    it("rotates a valid refresh session", async () => {
        const app = testApp();
        const agent = request.agent(app);
        await agent.post("/api/auth/register/patient").send(patient);
        const refreshed = await agent.post("/api/auth/refresh");
        expect(refreshed.status).toBe(200);
        expect(refreshed.body.user).toMatchObject({
            email: patient.email,
            role: "patient",
        });
        expect((await agent.get("/api/auth/me")).status).toBe(200);
    });
    it("allows a psychologist registration but keeps the admin bootstrap separate", async () => {
        const app = testApp();
        const response = await request(app)
            .post("/api/auth/register/psychologist")
            .send(psychologist);
        const bootstrap = await request(app)
            .post("/api/auth/admin/bootstrap")
            .send({
            name: "Initial Admin",
            email: "admin@example.com",
            password: "StrongPass!123",
            bootstrapKey: "test-bootstrap-key",
        });
        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe("psychologist");
        expect(bootstrap.status).toBe(403);
    });
    it("creates the initial administrator only through the protected bootstrap key", async () => {
        const app = testApp();
        const agent = request.agent(app);
        const bootstrap = await agent
            .post("/api/auth/admin/bootstrap")
            .set("x-admin-bootstrap-key", "development-bootstrap-key-change-me")
            .send({
            name: "Initial Admin",
            email: "admin@example.com",
            password: "StrongPass!123",
        });
        expect(bootstrap.status).toBe(201);
        expect(bootstrap.body.user.role).toBe("admin");
        expect((await agent.get("/api/admin/overview")).status).toBe(200);
    });
    it("enforces psychologist and admin boundaries without impersonation", async () => {
        const app = testApp();
        const patientAgent = request.agent(app);
        const psychologistAgent = request.agent(app);
        const adminAgent = request.agent(app);
        await patientAgent.post("/api/auth/register/patient").send(patient);
        await psychologistAgent
            .post("/api/auth/register/psychologist")
            .send(psychologist);
        await adminAgent
            .post("/api/auth/admin/bootstrap")
            .set("x-admin-bootstrap-key", "development-bootstrap-key-change-me")
            .send({
            name: "Initial Admin",
            email: "admin@example.com",
            password: "StrongPass!123",
        });
        expect((await patientAgent.get("/api/psychologist/me")).status).toBe(403);
        expect((await psychologistAgent.get("/api/psychologist/me")).status).toBe(200);
        expect((await psychologistAgent.get("/api/admin/overview")).status).toBe(403);
        expect((await adminAgent.get("/api/psychologist/me")).status).toBe(403);
        const adminIdentity = await adminAgent.get("/api/auth/me?userId=patient");
        expect(adminIdentity.body.user.role).toBe("admin");
    });
});

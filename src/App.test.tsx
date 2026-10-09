import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

describe("PERSPECTIVES landing page", () => {
  it("makes professional care and emergency boundaries visible", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /care that honors the whole of you/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /your faith can be part of care/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /not an emergency service/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /find your support/i }),
    ).toHaveAttribute("href", "/psychologists");
  });

  it("opens FAQ answers without navigating away", async () => {
    const user = userEvent.setup();
    render(<App />);

    const question = screen.getByRole("button", {
      name: /is this emergency support/i,
    });
    expect(screen.getByTestId("faq-emergency-answer")).not.toBeVisible();

    await user.click(question);

    expect(screen.getByTestId("faq-emergency-answer")).toBeVisible();
    expect(question).toHaveAttribute("aria-expanded", "true");
  });

  it("moves through featured psychologist stories", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Dr. Maya Okafor")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next story/i }));

    expect(screen.getByText("Dr. Samuel Reed")).toBeInTheDocument();
  });

  it("provides public routes for the core website journeys", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("link", { name: "About" }));
    expect(
      screen.getByRole("heading", { name: /care with context/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Resources" }));
    expect(
      screen.getByRole("heading", { name: /resources for your next step/i }),
    ).toBeInTheDocument();
  });

  it("labels development psychologist content clearly", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("link", { name: "Psychologists" }));

    expect(screen.getByText(/development preview/i)).toBeInTheDocument();
    expect(screen.getAllByText(/mock profile data/i).length).toBeGreaterThan(1);
  });

  it("renders the patient intake route with a non-diagnostic safety notice", () => {
    window.history.pushState({}, "", "/patient/intake");
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /share what support could look like/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/not a diagnostic questionnaire/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/immediate danger/i)).toBeInTheDocument();
  });

  it("provides patient dashboard navigation", () => {
    window.history.pushState({}, "", "/patient/dashboard");
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /your care space/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /complete intake/i }),
    ).toHaveAttribute("href", "/patient/intake");
  });

  it("provides a twelve-step psychologist application wizard", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/join-as-psychologist");
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /join your practice with care/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 12/i)).toBeInTheDocument();
    expect(screen.getAllByText(/account creation/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /next step/i }));

    expect(screen.getByText(/step 2 of 12/i)).toBeInTheDocument();
    expect(screen.getAllByText(/personal information/i).length).toBeGreaterThan(
      0,
    );
  });

  it("uses registration-safe country and faith compatibility choices", async () => {
    window.history.pushState({}, "", "/join-as-psychologist");
    render(<App />);

    const next = screen.getByRole("button", { name: /next step/i });
    await userEvent.click(next);
    expect(
      screen.getByRole("combobox", { name: /country or region/i }),
    ).toBeInTheDocument();
    for (let index = 0; index < 7; index += 1) await userEvent.click(next);
    expect(
      screen.getByRole("combobox", { name: /christian faith compatibility/i }),
    ).toBeInTheDocument();
  });
});

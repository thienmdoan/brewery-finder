import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";
import type { Brewery } from "../shared/utils";

describe("App (integration)", () => {
  const sampleItems: Brewery[] = [
    {
      id: "1",
      name: "Gamma Brewing",
      brewery_type: "micro",
      city: "Seattle",
      state: "Washington",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads and renders breweries from API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => sampleItems,
    } as unknown as Response);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading breweries/i)).toBeInTheDocument();
    expect(await screen.findByText("Gamma Brewing")).toBeInTheDocument();
  });

  it("updates page via pagination and triggers another fetch", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => sampleItems,
    } as unknown as Response);

    render(
      <MemoryRouter initialEntries={["/?name=&city=&type=&page=1"]}>
        <HomePage />
      </MemoryRouter>
    );

    await screen.findByText("Gamma Brewing");
    fireEvent.click(screen.getByRole("button", { name: "Next ›" }));

    await waitFor(() => {
      const lastCall = fetchMock.mock.calls.at(-1)?.[0];
      expect(String(lastCall)).toMatch(/page=2/);
    });
  });

  it("shows an error state on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: "boom" }),
    } as unknown as Response);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <HomePage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });
});

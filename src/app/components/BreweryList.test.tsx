import { render, screen, fireEvent } from "@testing-library/react";
import BreweryList from "./BreweryList";
import type { Brewery } from "../shared/utils.ts";

const ITEMS: Brewery[] = [
  {
    id: "a",
    name: "Alpha Brewing",
    brewery_type: "micro",
    city: "Portland",
    state: "Oregon",
  },
  {
    id: "b",
    name: "Beta Brewing",
    brewery_type: "regional",
    city: "Denver",
    state: "Colorado",
  },
];

describe("BreweryList", () => {
  it("renders list items and emits select when an item is clicked", () => {
    const onSelect = vi.fn();
    render(<BreweryList items={ITEMS} onSelect={onSelect} />);
    expect(screen.getByText("Alpha Brewing")).toBeInTheDocument();
    expect(screen.getByText("Beta Brewing")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /open details for Alpha Brewing/i })
    );
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(ITEMS[0]);
  });
});

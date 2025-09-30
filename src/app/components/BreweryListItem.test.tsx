import { render, screen, fireEvent } from "@testing-library/react";
import BreweryListItem from "./BreweryListItem";
import type { Brewery } from "../shared/utils.ts";

const sample: Brewery = {
  name: "Test Brewery",
  brewery_type: "micro",
  city: "Portland",
  state: "Oregon",
};

it("renders name, type badge, and location; responds to click", () => {
  const onClick = vi.fn();
  render(<BreweryListItem brewery={sample} onClick={onClick} />);
  expect(screen.getByText("Test Brewery")).toBeInTheDocument();
  expect(screen.getByText("micro")).toBeInTheDocument();
  expect(screen.getByText(/Portland, Oregon/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /open details/i }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

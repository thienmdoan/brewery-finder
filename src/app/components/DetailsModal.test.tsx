import { render, screen, fireEvent } from "@testing-library/react";
import DetailsModal from "./DetailsModal";
import type { Brewery } from "../shared/utils.ts";

const sample: Brewery = {
  name: "Modal Test Brewery",
  brewery_type: "micro",
  city: "San Diego",
  state: "California",
  website_url: "https://example.com",
  phone: "1234567890",
  street: "123 Main St",
  postal_code: "92101",
};

describe("DetailsModal", () => {
  it("renders content and closes via Close button and backdrop", () => {
    const onClose = vi.fn();
    const { container } = render(
      <DetailsModal brewery={sample} onClose={onClose} />
    );
    expect(screen.getByText("Modal Test Brewery")).toBeInTheDocument();
    // Close via button
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    // Close via backdrop
    const backdrop = container.querySelector(".modal-backdrop");
    expect(backdrop).not.toBeNull();
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    expect(onClose).toHaveBeenCalledTimes(2);
    // Clicking inside modal should NOT close
    const modal = container.querySelector(".modal");
    expect(modal).not.toBeNull();
    if (modal) {
      fireEvent.click(modal);
    }
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

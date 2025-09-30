import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("disables First/Prev on page 1 and calls onPage for Next", () => {
    const onPage = vi.fn<(page: number) => void>();
    render(<Pagination page={1} hasNext={true} onPage={onPage} />);
    const first = screen.getByRole("button", { name: "« First" });
    const prev = screen.getByRole("button", { name: "‹ Prev" });
    const next = screen.getByRole("button", { name: "Next ›" });
    expect(first).toBeDisabled();
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
    fireEvent.click(next);
    expect(onPage).toHaveBeenCalledWith(2);
  });

  it("enables Prev on page >1 and disables Next when no next page", () => {
    const onPage = vi.fn<(page: number) => void>();
    render(<Pagination page={3} hasNext={false} onPage={onPage} />);
    const prev = screen.getByRole("button", { name: "‹ Prev" });
    const next = screen.getByRole("button", { name: "Next ›" });
    expect(prev).toBeEnabled();
    expect(next).toBeDisabled();
    fireEvent.click(prev);
    expect(onPage).toHaveBeenCalledWith(2);
  });
});

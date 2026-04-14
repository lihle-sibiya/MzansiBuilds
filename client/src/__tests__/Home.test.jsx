import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import { vi } from "vitest";

// mock API
vi.mock("../services/api", () => ({
  getProjects: () =>
    Promise.resolve({
      data: [],
    }),
}));

test("renders feed title", async () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/build in public feed/i)).toBeInTheDocument();
  });
});

// Test for empty state when no projects exist
test("shows empty state when no projects exist", async () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
  });
});
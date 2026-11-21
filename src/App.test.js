import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders MaizeFit brand on login screen", () => {
  render(<App />);
  const brandElements = screen.getAllByText(/MaizeFit/i);
  expect(brandElements.length).toBeGreaterThan(0);
});

import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders main content", () => {
  render(<App />);
  const container = screen.getByTestId("main-container");
  expect(container).toBeInTheDocument();
});

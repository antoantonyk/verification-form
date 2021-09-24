import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

test("renders button", () => {
  render(<Button data-testid="button-test">Test</Button>);
  const btn = screen.getByTestId("button-test");
  expect(btn).toBeInTheDocument();
});

test("renders button with custom classNames", () => {
  render(
    <Button data-testid="button-test" className="test">
      Test
    </Button>
  );
  const btn = screen.getByTestId("button-test");
  expect(btn).toHaveClass("Button test");
});

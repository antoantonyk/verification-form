import React from "react";
import { render, screen } from "@testing-library/react";
import RadioButton from "./RadioButton";

test("renders radio button", () => {
  render(
    <RadioButton data-testid="radio-input" label="label text" value="yes" />
  );

  const label = screen.getByLabelText("label text");
  const input = screen.getByTestId("radio-input");

  expect(label).toBeInTheDocument();
  expect(input).toBeInTheDocument();
});

test("radio button - focus and blur", () => {
  const { container } = render(
    <RadioButton data-testid="radio-input" label="label text" value="yes" />
  );

  const input = screen.getByTestId("radio-input");

  expect(container.firstChild).toHaveClass("radio-btn");

  input.focus();

  expect(container.firstChild).toHaveClass("radio-btn radio-btn--focus");

  input.blur();

  expect(container.firstChild).toHaveClass("radio-btn");
});

test("radio button - check prop", () => {
  const { rerender } = render(
    <RadioButton data-testid="radio-input" label="label text" value="yes" />
  );

  expect(screen.getByText("label text")).toHaveClass("radio-btn");

  rerender(
    <RadioButton
      data-testid="radio-input"
      label="label text"
      value="yes"
      checked
    />
  );

  expect(screen.getByText("label text")).toHaveClass(
    "radio-btn radio-btn--active"
  );
});

test("radio button - disabled prop", () => {
  const { rerender } = render(
    <RadioButton data-testid="radio-input" label="label text" value="yes" />
  );

  expect(screen.getByText("label text")).toHaveClass("radio-btn");

  rerender(
    <RadioButton
      data-testid="radio-input"
      label="label text"
      value="yes"
      disabled
    />
  );

  expect(screen.getByText("label text")).toHaveClass(
    "radio-btn radio-btn--disabled"
  );
});

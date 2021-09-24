import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import RadioButtonGroup from "./RadioButtonGroup";
import RadioButton from "../RadioButton/RadioButton";

test("renders radio button group", () => {
  render(
    <RadioButtonGroup id="radio-input" label="group label text">
      <RadioButton value="yes" label="Yes" />
    </RadioButtonGroup>
  );

  expect(screen.getByRole("group")).toBeInTheDocument();
  expect(screen.getByText("group label text")).toBeInTheDocument();
  expect(screen.getByLabelText("Yes")).toBeInTheDocument();
});

test("renders only RadioButton as child", () => {
  render(
    <RadioButtonGroup id="radio-input" label="group label text">
      <RadioButton value="yes" label="Yes" />
      <p>unknown</p>
      <div>unknown div</div>
    </RadioButtonGroup>
  );

  expect(screen.getByRole("group")).toBeInTheDocument();
  expect(screen.getByText("group label text")).toBeInTheDocument();
  expect(screen.getByLabelText("Yes")).toBeInTheDocument();
  expect(screen.queryByText("unknown")).toBeNull();
  expect(screen.queryByText("unknown div")).toBeNull();
});

test("child as RadioButton with proper name", () => {
  render(
    <RadioButtonGroup id="radio-input" label="group label text">
      <RadioButton value="yes" label="Yes" data-testid="radio-button" />
    </RadioButtonGroup>
  );

  const input = screen.getByTestId("radio-button") as HTMLInputElement;

  expect(input).toBeInTheDocument();
  expect(input.name).toEqual("options-radio-input");
});

test("focus prop", () => {
  const { rerender } = render(
    <RadioButtonGroup id="radio-input" label="group label text">
      <RadioButton value="yes" label="Yes" data-testid="radio-button" />
    </RadioButtonGroup>
  );

  const radioGroup = screen.getByRole("group");

  expect(radioGroup).toBeInTheDocument();
  expect(radioGroup).toHaveClass("radio-btn-group");

  rerender(
    <RadioButtonGroup id="radio-input" label="group label text" focus>
      <RadioButton value="yes" label="Yes" data-testid="radio-button" />
    </RadioButtonGroup>
  );

  expect(radioGroup).toHaveClass("radio-btn-group radio-btn-group--focus");
});

test("disabled prop", () => {
  const { rerender } = render(
    <RadioButtonGroup id="radio-input" label="group label text">
      <RadioButton value="yes" label="Yes" />
    </RadioButtonGroup>
  );

  const radioGroup = screen.getByRole("group");
  const radioButton = screen.getByText("Yes");

  expect(radioGroup).toBeInTheDocument();
  expect(radioButton).toBeInTheDocument();

  expect(radioGroup).toHaveClass("radio-btn-group");
  expect(radioButton).toHaveClass("radio-btn");

  rerender(
    <RadioButtonGroup id="radio-input" label="group label text" disabled>
      <RadioButton value="yes" label="Yes" />
    </RadioButtonGroup>
  );

  expect(radioGroup).toHaveClass("radio-btn-group radio-btn-group--disabled");
  expect(radioButton).toHaveClass("radio-btn radio-btn--disabled");
});

test("should allow keypress navigation once focused", () => {
  const { rerender } = render(
    <RadioButtonGroup id="radio-input" label="group label text">
      <RadioButton value="yes" label="Yes" />
      <RadioButton value="no" label="No" />
    </RadioButtonGroup>
  );

  const radioGroup = screen.getByRole("group");
  const radioButtonYes = screen.getByText("Yes");
  const radioButtonNo = screen.getByText("No");

  expect(radioGroup).toBeInTheDocument();
  expect(radioButtonYes).toBeInTheDocument();
  expect(radioButtonNo).toBeInTheDocument();

  rerender(
    <RadioButtonGroup id="radio-input" label="group label text" focus>
      <RadioButton value="yes" label="Yes" />
      <RadioButton value="no" label="No" />
    </RadioButtonGroup>
  );

  expect(radioGroup).toHaveClass("radio-btn-group radio-btn-group--focus");

  fireEvent.keyDown(radioGroup, { key: "1", code: "1" });

  expect(radioButtonYes).toHaveClass("radio-btn radio-btn--active");
  expect(radioButtonNo).toHaveClass("radio-btn");

  fireEvent.keyDown(radioGroup, { key: "2", code: "2" });

  expect(radioButtonYes).toHaveClass("radio-btn");
  expect(radioButtonNo).toHaveClass("radio-btn radio-btn--active");
});

test("should not allow keypress navigation without getting focused", () => {
  render(
    <RadioButtonGroup id="radio-input" label="group label text">
      <RadioButton value="yes" label="Yes" />
      <RadioButton value="no" label="No" />
    </RadioButtonGroup>
  );

  const radioGroup = screen.getByRole("group");
  const radioButtonYes = screen.getByText("Yes");
  const radioButtonNo = screen.getByText("No");

  expect(radioGroup).toBeInTheDocument();
  expect(radioButtonYes).toBeInTheDocument();
  expect(radioButtonNo).toBeInTheDocument();

  fireEvent.keyDown(radioGroup, { key: "1", code: "1" });

  expect(radioGroup).toHaveClass("radio-btn-group");
  expect(radioButtonYes).toHaveClass("radio-btn");
  expect(radioButtonNo).toHaveClass("radio-btn");
});

test("should handle keypress based on the child items", () => {
  const { rerender } = render(
    <RadioButtonGroup id="radio-input" label="group label text">
      <RadioButton value="yes" label="Yes" />
      <RadioButton value="no" label="No" />
      <RadioButton value="na" label="NA" />
    </RadioButtonGroup>
  );

  const radioGroup = screen.getByRole("group");
  const radioButtonYes = screen.getByText("Yes");
  const radioButtonNo = screen.getByText("No");
  const radioButtonNA = screen.getByText("NA");

  expect(radioGroup).toBeInTheDocument();
  expect(radioButtonYes).toBeInTheDocument();
  expect(radioButtonNo).toBeInTheDocument();
  expect(radioButtonNA).toBeInTheDocument();

  rerender(
    <RadioButtonGroup id="radio-input" label="group label text" focus>
      <RadioButton value="yes" label="Yes" />
      <RadioButton value="no" label="No" />
      <RadioButton value="na" label="NA" />
    </RadioButtonGroup>
  );

  expect(radioGroup).toHaveClass("radio-btn-group radio-btn-group--focus");

  fireEvent.keyDown(radioGroup, { key: "1", code: "1" });

  expect(radioButtonYes).toHaveClass("radio-btn radio-btn--active");
  expect(radioButtonNo).toHaveClass("radio-btn");
  expect(radioButtonNA).toHaveClass("radio-btn");

  fireEvent.keyDown(radioGroup, { key: "2", code: "2" });

  expect(radioButtonYes).toHaveClass("radio-btn");
  expect(radioButtonNo).toHaveClass("radio-btn radio-btn--active");
  expect(radioButtonNA).toHaveClass("radio-btn");

  fireEvent.keyDown(radioGroup, { key: "3", code: "3" });

  expect(radioButtonYes).toHaveClass("radio-btn");
  expect(radioButtonNo).toHaveClass("radio-btn");
  expect(radioButtonNA).toHaveClass("radio-btn radio-btn--active");
});

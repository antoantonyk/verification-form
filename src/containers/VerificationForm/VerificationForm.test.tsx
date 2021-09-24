import React from "react";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
} from "@testing-library/react";

import VerificationForm from "./VerificationForm";
import {
  getCheckFormItemsByPriority,
  saveCheckFormResults,
} from "../../services/check-form.service";
import { act } from "react-dom/test-utils";
import { CheckItem } from "../../models/check-item.model";

jest.mock("../../services/check-form.service");

let TEST_DATA: CheckItem[] = [];

const getCheckFormItemsMock =
  getCheckFormItemsByPriority as jest.MockedFunction<
    typeof getCheckFormItemsByPriority
  >;

const saveCheckFormResultsMock = saveCheckFormResults as jest.MockedFunction<
  typeof saveCheckFormResults
>;

beforeEach(() => {
  TEST_DATA = [
    {
      id: "aaa",
      priority: 5,
      description: "Face on the picture matches face on the document",
    },
    {
      id: "bbb",
      priority: 7,
      description: "Veriff supports presented document",
    },
    {
      id: "ccc",
      priority: 10,
      description: "Face is clearly visible",
    },
  ];
});

test("renders VerificationForm with data", async () => {
  getCheckFormItemsMock.mockResolvedValue(TEST_DATA);

  render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(TEST_DATA.length);
  });

  expect(getCheckFormItemsMock).toHaveBeenCalledTimes(1);
});

test("renders VerificationForm without data", async () => {
  getCheckFormItemsMock.mockRejectedValue({});

  render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(
      screen.getByText("Failed to fetch the data. Please reload the page.")
    ).toBeInTheDocument();
  });
});

test("renders VerificationForm with one item enabled on load", async () => {
  getCheckFormItemsMock.mockResolvedValue(TEST_DATA);

  const { container } = render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(TEST_DATA.length);

    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(2);
  });
});

test("enable/disable next item based on the current selection", async () => {
  getCheckFormItemsMock.mockResolvedValue(TEST_DATA);

  const { container } = render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(TEST_DATA.length);
    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(2);
  });

  const firstYesItem = screen.getAllByText("Yes");
  fireEvent.click(firstYesItem[0]);

  expect(screen.getAllByRole("group")[1]).toHaveClass("radio-btn-group");
  expect(container.querySelectorAll(".radio-btn-group--disabled").length).toBe(
    1
  );

  const firstNoItem = screen.getAllByText("No");
  fireEvent.click(firstNoItem[0]);

  expect(screen.getAllByRole("group")[1]).toHaveClass(
    "radio-btn-group--disabled"
  );
  expect(container.querySelectorAll(".radio-btn-group--disabled").length).toBe(
    2
  );
});

test("enable/disable all items based on the current field selection", async () => {
  getCheckFormItemsMock.mockResolvedValue(TEST_DATA);

  const { container } = render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(TEST_DATA.length);
    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(2);
  });

  //  select all item
  screen.getAllByText("Yes").forEach((item) => {
    fireEvent.click(item);
  });

  expect(container.querySelectorAll(".radio-btn-group--disabled").length).toBe(
    0
  );

  //  set first item as no
  const firstNoItem = screen.getAllByText("No");
  fireEvent.click(firstNoItem[0]);

  expect(container.querySelectorAll(".radio-btn-group--disabled").length).toBe(
    2
  );
});

test("enable submit button on  any one of option as 'No'", async () => {
  getCheckFormItemsMock.mockResolvedValue(TEST_DATA);

  const { container } = render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(TEST_DATA.length);
    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(2);
  });
  const submitButton = container.querySelector(
    ".verification-form__btn-submit"
  ) as HTMLButtonElement;

  expect(submitButton.disabled).toBeTruthy();

  const firstNoItem = screen.getAllByText("No");
  fireEvent.click(firstNoItem[0]);

  expect(submitButton.disabled).toBeFalsy();
});

test("enable submit button on all options are selected as 'Yes'", async () => {
  getCheckFormItemsMock.mockResolvedValue([
    {
      id: "aaa",
      priority: 5,
      description: "Face on the picture matches face on the document",
    },
    {
      id: "bbb",
      priority: 7,
      description: "Veriff supports presented document",
    },
    {
      id: "ccc",
      priority: 10,
      description: "Face is clearly visible",
    },
  ]);

  const { container } = render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(3);
    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(2);
  });

  const submitButton = container.querySelector(
    ".verification-form__btn-submit"
  ) as HTMLButtonElement;

  expect(submitButton.disabled).toBeTruthy();

  const firstNoItem = screen.getAllByText("Yes");
  fireEvent.click(firstNoItem[0]);

  expect(submitButton.disabled).toBeTruthy();

  fireEvent.click(firstNoItem[1]);

  expect(submitButton.disabled).toBeTruthy();

  fireEvent.click(firstNoItem[2]);

  expect(submitButton.disabled).toBeFalsy();
});

test("submit success scenario", async () => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  getCheckFormItemsMock.mockResolvedValue(TEST_DATA);

  saveCheckFormResultsMock.mockResolvedValue([]);

  const { container } = render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(TEST_DATA.length);
    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(2);
  });
  const submitButton = container.querySelector(
    ".verification-form__btn-submit"
  ) as HTMLButtonElement;

  expect(submitButton.disabled).toBeTruthy();

  const firstNoItem = screen.getAllByText("No");
  fireEvent.click(firstNoItem[0]);

  expect(submitButton.disabled).toBeFalsy();

  act(() => {
    fireEvent.click(submitButton);
  });

  await waitFor(() => {
    expect(submitButton.disabled).toBeTruthy();
    expect(saveCheckFormResultsMock).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});

test("submit failed scenario", async () => {
  getCheckFormItemsMock.mockResolvedValue(TEST_DATA);

  saveCheckFormResultsMock.mockRejectedValue({});
  jest.spyOn(window, "alert").mockImplementation(() => {});

  const { container } = render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(TEST_DATA.length);
    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(2);
  });
  const submitButton = container.querySelector(
    ".verification-form__btn-submit"
  ) as HTMLButtonElement;

  expect(submitButton.disabled).toBeTruthy();

  const firstNoItem = screen.getAllByText("No");
  fireEvent.click(firstNoItem[0]);

  expect(submitButton.disabled).toBeFalsy();

  act(() => {
    fireEvent.click(submitButton);
  });

  await waitFor(() => {
    expect(submitButton.disabled).toBeTruthy();
    expect(saveCheckFormResultsMock).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});

test("enable/disable next item based on the arrow selection", async () => {
  getCheckFormItemsMock.mockResolvedValue([
    {
      id: "aaa",
      priority: 5,
      description: "Face on the picture matches face on the document",
    },
    {
      id: "bbb",
      priority: 7,
      description: "Veriff supports presented document",
    },
    {
      id: "ccc",
      priority: 10,
      description: "Face is clearly visible",
    },
    {
      id: "ddd",
      priority: 11,
      description: "Face is clearly visible",
    },
  ]);

  const { container } = render(<VerificationForm />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole("group").length).toBe(4);
    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(3);
  });

  const firstYesItem = screen.getAllByText("Yes");
  fireEvent.click(firstYesItem[0]);

  await waitFor(() => {
    expect(screen.getAllByRole("group")[1]).toHaveClass("radio-btn-group");
    expect(
      container.querySelectorAll(".radio-btn-group--disabled").length
    ).toBe(2);
  });

  fireEvent.keyDown(container, {
    key: "ArrowDown",
    code: "ArrowDown",
  });

  await waitFor(() => {
    expect(screen.getAllByRole("group")[1]).toHaveClass(
      "radio-btn-group radio-btn-group--focus"
    );
  });

  fireEvent.keyDown(container, {
    key: "ArrowUp",
    code: "ArrowUp",
  });

  await waitFor(() => {
    expect(screen.getAllByRole("group")[1]).toHaveClass("radio-btn-group");
  });
});

import { fetchChecks, submitCheckResults } from "./api";
import {
  getCheckFormItemsByPriority,
  saveCheckFormResults,
} from "./check-form.service";

jest.mock("./api");

const fetchChecksMock = fetchChecks as jest.MockedFunction<typeof fetchChecks>;

const submitCheckResultsMock = submitCheckResults as jest.MockedFunction<
  typeof submitCheckResults
>;

const TEST_DATA = [
  {
    id: "aaa",
    priority: 10,
    description: "Face on the picture matches face on the document",
  },
  {
    id: "bbb",
    priority: 5,
    description: "Veriff supports presented document",
  },
  {
    id: "ccc",
    priority: 7,
    description: "Face is clearly visible",
  },
  {
    id: "ddd",
    priority: 3,
    description: "Document data is clearly visible",
  },
];

test("getCheckFormItems - Sorted by Priority", async () => {
  fetchChecksMock.mockResolvedValue([...TEST_DATA]);

  const items = await getCheckFormItemsByPriority();

  expect(items.length).toBe(TEST_DATA.length);

  const sortedItems = [...TEST_DATA].sort(
    (itemA, itemB) => itemA.priority - itemB.priority
  );

  expect(items[0].priority).toBe(sortedItems[0].priority);
  expect(items[items.length - 1].priority).toBe(
    sortedItems[items.length - 1].priority
  );
});

test("getCheckFormItems - should throw error", async () => {
  const error = { success: false };
  fetchChecksMock.mockRejectedValue(error);

  try {
    await getCheckFormItemsByPriority();
  } catch (e) {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(e).toEqual(error);
  }
});

test("saveCheckFormResults - Success", async () => {
  const results = [{ result: "yes", checkId: "adsd" }];
  submitCheckResultsMock.mockResolvedValue(results);

  const items = await saveCheckFormResults(results);

  expect(items.length).toBe(results.length);
});

test("saveCheckFormResults - Failed", async () => {
  const error = { success: false };
  const results = [{ result: "yes", checkId: "adsd" }];
  submitCheckResultsMock.mockRejectedValue(error);

  try {
    await saveCheckFormResults(results);
  } catch (e) {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(e).toEqual(error);
  }
});

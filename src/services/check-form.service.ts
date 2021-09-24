import { Result } from "../models/check-item-result.model";
import { CheckItem } from "../models/check-item.model";
import { fetchChecks, submitCheckResults } from "./api";

export const getCheckFormItems = async (): Promise<CheckItem[]> => {
  try {
    let items = await fetchChecks();
    items = items
      .sort((itemA, itemB) => itemA.priority - itemB.priority)
      .map((item, index) => {
        return { ...item, disabled: index !== 0, result: "" };
      });

    return items;
  } catch (error) {
    throw error;
  }
};

export const saveCheckFormResults = async (
  results: Result[]
): Promise<Result[]> => {
  try {
    let items = await submitCheckResults(results);
    return items;
  } catch (error) {
    throw error;
  }
};

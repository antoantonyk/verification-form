import { Result } from "../models/check-item-result.model";
import { CheckItem } from "../models/check-item.model";
import { fetchChecks, submitCheckResults } from "./api";

export const getCheckFormItemsByPriority = async (): Promise<CheckItem[]> => {
  try {
    let items = await fetchChecks();
    items = items
      .sort((itemA, itemB) => itemA.priority - itemB.priority)
      .map((item, index) => {
        return { ...item };
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

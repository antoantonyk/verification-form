import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Button from "../../components/Button/Button";
import RadioButton from "../../components/RadioButton/RadioButton";
import RadioButtonGroup from "../../components/RadioButtonGroup/RadioButtonGroup";
import useKeyPress from "../../hooks/useKeyPress";
import { Result } from "../../models/check-item-result.model";

import { CheckItem } from "../../models/check-item.model";
import {
  getCheckFormItemsByPriority,
  saveCheckFormResults,
} from "../../services/check-form.service";

import "./VerificationForm.scss";

type ResultValue = "yes" | "no";
type RadioOptions = { label: string; value: ResultValue };

const VerificationForm = () => {
  const [items, setItems] = useState<CheckItem[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(-1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isSubmitEnabled = useMemo(() => {
    return (
      items.every((item) => item.result === "yes") ||
      items.some((item) => item.result === "no")
    );
  }, [items]);

  const radioOptions: RadioOptions[] = useMemo(
    () => [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
    []
  );

  const onItemSelect = useCallback(
    (selectedItemIndex: number, value: ResultValue) => {
      const updatedItems = items.map((item, index, self) => {
        if (index === selectedItemIndex) {
          return { ...item, result: value };
        }

        // Disable all items after the selected item
        if (index > selectedItemIndex && value === "no") {
          return { ...item, disabled: true };
        }

        // Disable items after the selected item based on the prev values
        if (index > selectedItemIndex && value === "yes") {
          if (
            selectedItemIndex === index - 1 ||
            self[index - 1].result === "yes"
          ) {
            return { ...item, disabled: false };
          } else {
            return { ...item, disabled: true };
          }
        }

        return item;
      });

      setItems(updatedItems);
    },
    [items]
  );

  // initiate form with default valuess
  const initForm = useCallback((items: CheckItem[]) => {
    setItems(
      items.map((item, index) => ({
        ...item,
        result: "",
        disabled: index !== 0,
      }))
    );
    setIsSubmitted(false);
  }, []);

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const results: Result[] = items
      .filter((item) => item.result && !item.disabled)
      .map((item) => {
        return { checkId: item.id, result: item.result };
      });

    try {
      await saveCheckFormResults(results);
      alert("Submitted Successfully.");
    } catch (error) {
      alert("Error. Please resubmit the form");
    }

    // reinitialize the form
    initForm(items);
    formRef.current?.reset();
  };

  // To blur the current active element
  const blurCurrentActiveElement = () => {
    const activeElement: HTMLElement = document?.activeElement as HTMLElement;

    if (activeElement) {
      activeElement.blur();
    }
  };

  // Listen for key press
  useKeyPress((key) => {
    if (key === "ArrowUp") {
      const newIndex = focusedItemIndex === -1 ? 0 : focusedItemIndex;

      if (newIndex - 1 >= 0 && !items[newIndex - 1].disabled) {
        setFocusedItemIndex(newIndex - 1);
        blurCurrentActiveElement();
      }
    }

    if (key === "ArrowDown") {
      const newIndex = focusedItemIndex === -1 ? 0 : focusedItemIndex;

      if (newIndex + 1 < items.length && !items[newIndex + 1].disabled) {
        setFocusedItemIndex(newIndex + 1);
        blurCurrentActiveElement();
      }
    }
  });

  // fetch results
  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const items = await getCheckFormItemsByPriority();
        initForm(items);
      } catch (error) {
        setItems([]);
      }

      setLoading(false);
    })();
  }, [initForm]);

  if (items.length === 0) {
    return (
      <p className="verification-form__info">
        {isLoading
          ? "Loading..."
          : "Failed to fetch the data. Please reload the page."}
      </p>
    );
  }

  return (
    <form className="verification-form" onSubmit={onFormSubmit} ref={formRef}>
      {items.map((item, index) => {
        return (
          <RadioButtonGroup
            id={item.id}
            key={item.id}
            label={item.description}
            focus={focusedItemIndex === index}
            onChange={(value) => {
              onItemSelect(index, value as ResultValue);
            }}
            onFocus={(value) => {
              value && setFocusedItemIndex(index);
            }}
            disabled={item.disabled}
          >
            {radioOptions.map((item) => (
              <RadioButton
                key={item.value}
                value={item.value}
                label={item.label}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              />
            ))}
          </RadioButtonGroup>
        );
      })}

      <Button
        type="submit"
        className="verification-form__btn-submit"
        disabled={!isSubmitEnabled || isSubmitted}
      >
        Submit
      </Button>
    </form>
  );
};

export default VerificationForm;

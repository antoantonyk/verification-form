import classNames from "classnames";
import React, {
  ChangeEvent,
  Children,
  cloneElement,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useKeyPress from "../../hooks/useKeyPress";
import RadioButton, { RadioButtonProps } from "../RadioButton/RadioButton";

import "./RadioButtonGroup.scss";

type RadioButtonChild = ReactElement<PropsWithChildren<RadioButtonProps>>;

type RadioButtonGroupProps = {
  id: string;
  label: string;
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  focus?: boolean;
  onFocus?: (value: boolean) => void;
  onChange?: (value: string) => void;
};

const RadioButtonGroup = (props: RadioButtonGroupProps) => {
  const {
    id,
    label,
    children,
    disabled,
    focus = false,
    value,
    onChange,
    onFocus,
  } = props;

  const [selectedValue, setSelectedValue] = useState("");
  const [focused, setFocused] = useState(false);
  const radioBtnGroupRef = useRef<HTMLDivElement | null>(null);

  const onValueChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.currentTarget.value);
  }, []);

  const handleFocus = useCallback(
    (e) => {
      setFocused(true);
      onFocus && onFocus(true);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e) => {
      setFocused(false);
      onFocus && onFocus(false);
    },
    [onFocus]
  );

  const onKeyPress = useCallback(
    (key) => {
      const pressedKey = Number.parseInt(key);

      // check if pressed key is within the range of children
      if (
        focused &&
        Number.isInteger(pressedKey) &&
        pressedKey > 0 &&
        pressedKey <= Children.toArray(children).length
      ) {
        // Find child and it's value
        const item = Children.toArray(children).find((child, index) => {
          const item = child as RadioButtonChild;
          return item.type === RadioButton && index + 1 === pressedKey;
        });

        if (item) {
          const { value } = (item as RadioButtonChild).props;
          setSelectedValue(value);
        }
      }
    },
    [focused, children]
  );

  // Listen for key press
  useKeyPress(onKeyPress);

  // Sync values to parent
  useEffect(() => {
    if (selectedValue && onChange) {
      onChange(selectedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  // sync props focus value to state
  useEffect(() => {
    setFocused(focus);

    if (focus) {
      radioBtnGroupRef.current?.focus();
    } else {
      radioBtnGroupRef.current?.blur();
    }
  }, [focus]);

  // sync props value value to state
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div
      className={classNames(
        "radio-btn-group",
        focused && "radio-btn-group--focus",
        disabled && "radio-btn-group--disabled"
      )}
      role="group"
      aria-labelledby={id}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={radioBtnGroupRef}
    >
      <h3 className="radio-btn-group__label" id={id}>
        {label}
      </h3>
      <div className="radio-btn-group__items">
        {Children.map(children, (child) => {
          const item = child as RadioButtonChild;

          if (item.type === RadioButton) {
            const name = `options-${id}`;
            const checked = selectedValue === item.props.value;

            const onChange = (e: ChangeEvent<HTMLInputElement>) => {
              onValueChange(e);
              item.props.onChange?.(e);
            };

            return cloneElement(item, {
              checked,
              onChange,
              name,
              disabled,
            });
          } else {
            // Remove unknown child items
            return undefined;
          }
        })}
      </div>
    </div>
  );
};

export default RadioButtonGroup;

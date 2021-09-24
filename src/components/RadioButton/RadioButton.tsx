import React, {
  ChangeEvent,
  forwardRef,
  HTMLProps,
  useCallback,
  useState,
} from "react";
import classNames from "classnames";

import "./RadioButton.scss";

export type RadioButtonProps = {
  name?: string;
  label: string;
  value: any;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
} & HTMLProps<HTMLInputElement>;

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  (props: RadioButtonProps, ref) => {
    const {
      name,
      value,
      checked = false,
      label,
      disabled,
      onChange,
      ...rest
    } = props;

    const [focused, setFocused] = useState(false);

    const handleFocus = useCallback(() => {
      setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setFocused(false);
    }, []);

    const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e);
    };

    return (
      <label
        className={classNames(
          "radio-btn",
          checked && "radio-btn--active",
          focused && "radio-btn--focus",
          disabled && "radio-btn--disabled"
        )}
      >
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onValueChange}
          disabled={disabled}
          {...rest}
        />
        {label}
      </label>
    );
  }
);

export default RadioButton;

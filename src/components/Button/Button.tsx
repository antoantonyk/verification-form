import React, { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

import "./Button.scss";

type ButtonProp = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, className, ...rest }: ButtonProp) => {
  return (
    <button className={classNames("Button", className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;

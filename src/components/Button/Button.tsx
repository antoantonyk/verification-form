import React, { ButtonHTMLAttributes } from "react";
import PropTypes from "prop-types";
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

Button.propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;

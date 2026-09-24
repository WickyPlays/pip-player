import React from "react";
import "./MatButton.scss";

export default function Button({
  className = "",
  children,
  sx,
  onClick,
  disabled = false,
}: {
  className?: string;
  children?: any;
  sx?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      className={`mat-btn ${className}`}
      style={sx}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

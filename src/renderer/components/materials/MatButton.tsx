import React from "react";
import "./MatButton.scss";

export default function Button({
  className = "",
  children,
  sx,
  onClick,
}: {
  className?: string;
  children?: any;
  sx?: React.CSSProperties;
  onClick?: () => void;
}): JSX.Element {
  return (
    <button
      className={`mat-btn ${className}`}
      style={sx}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

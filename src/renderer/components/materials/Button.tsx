export default function Button({
  className,
  children,
  sx,
  onClick,
}: {
  className?: string;
  children?: any;
  sx?: any;
  onClick?: any;
}): JSX.Element {
  const defaultStyle = {
    color: '#FFF',
    width: '10px',
    backgroundColor: '#FF0000',
    border: '1px solid black',
    borderRadius: '10px',
    padding: '10px 20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <button
      className={`mat-btn ${className}`}
      style={{ ...defaultStyle, ...sx }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary:
      "bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500",
    secondary:
      "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border-2 border-violet-600 text-violet-600 hover:bg-violet-50 focus:ring-violet-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

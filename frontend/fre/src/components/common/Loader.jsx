import React from "react";

const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeStyles[size]} border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin`}
      />
      {text && <p className="text-slate-600 font-medium">{text}</p>}
    </div>
  );
};

export default Loader;

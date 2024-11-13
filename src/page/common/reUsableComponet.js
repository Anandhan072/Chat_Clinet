import { useState } from "react";

export const CreatePassword = function ({ name, placeholder, value, handle, id }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        minLength={5}
        maxLength={25}
        value={value}
        onChange={handle}
        id={id}
      />
      <span
        style={{ position: "absolute", right: 10, top: 15, cursor: "pointer", fontSize: "1.3rem" }}
        className="hideicon"
        onClick={() => setShowPassword((s) => !showPassword)}
      >
        {showPassword ? "Hide" : "Show"}
      </span>
    </div>
  );
};

export const CreateBtn = function ({ children, setSignupConsole }) {
  return (
    <button
      onClick={(events) => {
        setSignupConsole(false);
      }}
    >
      {children}
    </button>
  );
};

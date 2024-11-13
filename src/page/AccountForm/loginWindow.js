/* eslint-disable no-undef */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AJAX } from "../error/APICalls";
import { UserContext } from "../../App"; // Ensure correct import path

const LoginPage = function ({ setSignupConsole }) {
  const loginDefaultValue = { email: "", password: "" };
  const [userLoginInfo, setUserLoginInfo] = useState(loginDefaultValue);
  const navigate = useNavigate();
  const { findUser, setFindUser } = useContext(UserContext); // Destructure the context
  const [errors, setErrors] = useState({});

  const handleLoginCredentials = function (e) {
    const { name, value } = e.target;
    setUserLoginInfo({
      ...userLoginInfo,
      [name]: value,
    });
  };

  const validate = () => {
    const errorCheck = {};
    if (!userLoginInfo.email || !/\S+@\S+\.\S+/.test(userLoginInfo.email)) {
      errorCheck.email = "Please enter a valid email address.";
    }
    if (!userLoginInfo.password || userLoginInfo.password.length < 5) {
      errorCheck.password = "Password must be at least 5 characters.";
    }
    return errorCheck;
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    const findError = validate();

    if (Object.keys(findError).length > 0) {
      setErrors(findError);
    } else {
      setErrors({});
      try {
        const responseData = await AJAX({
          methodValue: "POST",
          URL: "http://127.0.0.1:8000/api/v1/user/chat",
          valueBody: userLoginInfo,
        });

        // Check response data and update context
        if (responseData) {
          await setFindUser(responseData); // Store user info in context

          sessionStorage.setItem("keys", JSON.stringify(responseData));
          navigate("/chat");
        } else {
          // Handle case where responseData is null or invalid
          console.error("Invalid response data:", responseData);
          setErrors({ ...errors, server: "Login failed. Please try again." });
        }
      } catch (err) {
        console.error("Error during login:", err);
        setErrors({ ...errors, server: "An error occurred. Please try again." });
      }
    }
  };

  return (
    <div className="login_con">
      <WelcomeMessage>Welcome to Aratai</WelcomeMessage>
      <ProductLogo />
      <UserName
        userLoginInfo={userLoginInfo}
        handleLoginCredentials={handleLoginCredentials}
        handleSubmit={handleSubmit}
        errors={errors}
      >
        <SignUp setSignupConsole={setSignupConsole} />
      </UserName>
    </div>
  );
};

// Other components (WelcomeMessage, ProductLogo, UserName, LoginBtn, SignUp, CreatePassword) remain unchanged...

const WelcomeMessage = function ({ children }) {
  return <h1>{children}</h1>;
};

const ProductLogo = function () {
  return (
    <span>
      <svg width="80" height="80" fill="none">
        <text className="atag" x="10" y="70">
          அ
        </text>
      </svg>
    </span>
  );
};

const UserName = function ({
  children,
  userLoginInfo,
  handleLoginCredentials,
  handleSubmit,
  errors,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="login-form">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your username"
              value={userLoginInfo.email}
              onChange={handleLoginCredentials}
              autoComplete="off"
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>
          <div>
            <CreatePassword
              name="password"
              placeholder="Enter your user Password"
              value={userLoginInfo.password}
              handle={handleLoginCredentials}
              id="login-password"
              autoComplete="off"
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          </div>
        </div>
        <LoginBtn />
        {children}
      </form>
    </div>
  );
};

const LoginBtn = function () {
  return <button>Log in</button>;
};

const SignUp = function ({ setSignupConsole }) {
  return (
    <button
      onClick={(events) => {
        events.preventDefault();
        setSignupConsole(true);
      }}
    >
      Sign Up
    </button>
  );
};

const CreatePassword = function ({ name, placeholder, value, handle, id }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <span>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        minLength={5}
        maxLength={25}
        value={value}
        onChange={handle} // Correctly use onChange prop
        id={id}
      />
      <span className="hideicon" onClick={() => setShowPassword((s) => !s)}>
        {showPassword ? "Hide" : "Show"}
      </span>
    </span>
  );
};

export default LoginPage;

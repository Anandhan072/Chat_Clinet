import { useState } from "react";
import LoginPage from "../AccountForm/loginWindow";
import AccountForm from "../AccountForm/accountFrom";

const LoginWindow = function () {
  const [signupConsole, setSignupConsole] = useState(false);

  return (
    <div className="App">
      <LoginPage setSignupConsole={setSignupConsole} />
      {signupConsole && <AccountForm setSignupConsole={setSignupConsole} />}
    </div>
  );
};

export default LoginWindow;

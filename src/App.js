import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./page/chat/chat";
import LoginWindow from "./page/AccountForm/home";
import SessionChecker from "./sessionScheck";

// Create context
export const UserContext = createContext();

function App() {
  const [findUser, setFindUser] = useState({}); // Global state to store user info

  return (
    <UserContext.Provider value={{ findUser, setFindUser }}>
      <Router>
        <SessionChecker />
        <Routes>
          <Route path="/" element={<LoginWindow />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

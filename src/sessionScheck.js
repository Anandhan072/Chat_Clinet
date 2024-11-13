import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./App";

function SessionChecker() {
  const { setFindUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = sessionStorage.getItem("keys");
    console.log("User:", storedUser);

    if (storedUser) {
      console.log("hijh9johoi");
      setFindUser(JSON.parse(storedUser));
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, []);

  return null;
}

export default SessionChecker;

import React, { useEffect, useState, useContext, createContext, useRef } from "react";
import { UserContext } from "../../App";
import io from "socket.io-client";
import { AJAX } from "../error/APICalls";

const ThemeContext = createContext();

const Chat = function () {
  const { findUser, setFindUser } = useContext(UserContext);
  const { user } = findUser;
  const [allUser, setAllUser] = useState(null);
  const [selectUser, setSelectUser] = useState(null);
  const [toUser, setToUser] = useState(null);
  const [userChat, setUserChat] = useState(null);
  const backEndUrl = "http://localhost:8000/";
  const [userMessage, setUserMessage] = useState("");
  const [messageSubmit, setMessageSubmit] = useState(false);
  const socketRef = useRef(null);
  const [userInfo, setuserInfo] = useState(false);
  const [userLogout, setUserLogout] = useState(false);

  const messageHandler = (e) => setUserMessage(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      console.log("hi");
      try {
        const response = await AJAX({
          methodValue: "GET",
          URL: "http://127.0.0.1:8000/api/v1/user",
          token: findUser.token,
        });
        const usersData = response.data.user;
        setAllUser(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchData();
  }, [findUser.token]);

  useEffect(() => {
    const fetchToUserAndChat = async () => {
      if (allUser && selectUser) {
        const findToUser = allUser.find((acc) => acc._id === selectUser);
        setToUser(findToUser);

        if (findToUser) {
          const response = await AJAX({
            methodValue: "GET",
            URL: `http://127.0.0.1:8000/api/v1/message/${user._id},${findToUser._id}`,
            token: findUser.token,
          });
          const usersData = response.data.conversation.messages;
          setUserChat(usersData);
        }
      }
    };

    fetchToUserAndChat();
  }, [selectUser, allUser]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(backEndUrl);

      socketRef.current.on("connect", () => {
        console.log("Connected to server");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from server");
      });
    }

    if (messageSubmit && userMessage.length > 0 && toUser) {
      console.log("Emitting message:", userMessage);
      socketRef.current.emit("chat message", {
        userId: user?._id,
        toUserId: toUser?._id,
        message: userMessage,
      });
      setMessageSubmit(false);
      setUserMessage("");
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [messageSubmit, userMessage, toUser, user._id]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("keys");
    if (storedUser) {
      setFindUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <div className="chat">
        <ThemeContext.Provider
          value={{
            findUser,
            user,
            allUser,
            setAllUser,
            selectUser,
            setSelectUser,
            toUser,
            setToUser,
            userChat,
            userMessage,
            setMessageSubmit,
            messageHandler,
            setuserInfo,
            userInfo,
            setUserLogout,
          }}
        >
          <div className="chat-console">
            <NavBarTop />
          </div>
          <div className="chat-all">
            <AllUsersIcons />
            {selectUser && <UserChatConsole />}
          </div>
          <UserProfileInfo />
        </ThemeContext.Provider>
      </div>
    </>
  );
};

// Other components remain mostly unchanged...

const NavBarTop = function () {
  const { user, setuserInfo, selectUser, findToUser } = useContext(ThemeContext);
  console.log(findToUser);

  return (
    <div className="chat-top-navbar">
      <div className="log-nav">
        <img src="svg/arattai1.svg" alt="Arattai" />
      </div>
      <div className="nav-search">
        <input type="search" placeholder="Search UserName" />
        <span>
          <img src="svg/search.svg" alt="" />
        </span>
      </div>
      <div
        className="nav-profile"
        onClick={() => {
          console.log("hihihihihninb");
          setuserInfo(true);
        }}
      >
        <span>
          <img src={user.gender === "Male" ? "svg/male-user.svg" : "svg/female-user.svg"} alt="" />
          <p>{user.name}</p>
        </span>
      </div>
    </div>
  );
};

const UserProfileInfo = function () {
  const { user, setuserInfo, userInfo, setUserLogout } = useContext(ThemeContext);
  return (
    <div className="user-profile-info" style={{ right: userInfo ? "0" : "-60rem" }}>
      <div className="user-info">
        <span className="user-img">
          <img
            src={user.gender === "Male" ? "svg/male-user.svg" : "svg/female-user.svg"}
            alt="User Img"
          />
        </span>
        <span className="user-name">
          <h2>{user.name}</h2>
        </span>
        <span className="user-main-info">
          <p>email: {user.email}</p>
          <p>id: {user._id}</p>
        </span>
      </div>

      <div></div>

      <button onClick={() => setuserInfo(false)}>X</button>

      <button className="logout" onClick={() => setUserLogout(true)}>
        logout
      </button>
    </div>
  );
};

const AllUsersIcons = function () {
  const { allUser, user, setSelectUser } = useContext(ThemeContext);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeState, setActiveState] = useState(false);

  // Check if allUser is null or undefined, and render a fallback if it is
  if (!allUser) {
    return <p>Loading users...</p>; // Loading message
  }

  return (
    <div className="show-all-users" style={activeState ? { width: "0px" } : {}}>
      {allUser.map((acc) => {
        if (acc.email === user.email) {
          return null; // Skip the current user
        } else {
          return (
            <UsersIcons
              key={acc._id}
              acc={acc}
              isActive={activeUserId === acc._id}
              onSelect={() => {
                setActiveUserId(acc._id);
                setSelectUser(acc._id);
              }}
            />
          );
        }
      })}
      <SlideAdd onSelect={() => setActiveState((prev) => !prev)} activeState={activeState} />
    </div>
  );
};

const UsersIcons = function ({ acc, isActive, onSelect }) {
  return (
    <div className={`show-user ${isActive ? "active" : ""}`} onClick={onSelect}>
      <span className="chat-user-img">
        <img src="svg/online.svg" alt="" />
      </span>
      <div className="chat-user-info">
        <p>{acc.name}</p>
      </div>
    </div>
  );
};

const SlideAdd = function ({ activeState, onSelect }) {
  return (
    <div className="slide-close-open" onClick={onSelect}>
      {!activeState ? "<" : ">"}
    </div>
  );
};

const UserChatConsole = function () {
  const { setSendMessage } = useContext(ThemeContext);
  return (
    <div className="user-chat-town">
      <UserIcons />
      <ChatContent />
      <MessageContent setSendMessage={setSendMessage} />
    </div>
  );
};

const UserIcons = function () {
  const { setToUser, user, setSelectUser, toUser } = useContext(ThemeContext);
  console.log(toUser);
  // Prevent rendering if user data is not available
  if (!user || !toUser) return;

  return (
    <div className="chat-top-nav">
      <img src={toUser.gender === "Male" ? "svg/male-user.svg" : "svg/female-user.svg"} alt="" />
      <div className="cha-user-info">
        <p className="chat-username">{toUser.name}</p>
        <p className="chat-status">Status</p>
      </div>
      <button
        onClick={() => {
          setSelectUser(null);
          setToUser(null);
        }}
      >
        X
      </button>
    </div>
  );
};

const ChatContent = function () {
  const { userChat } = useContext(ThemeContext);

  return (
    <div className="chat-box">
      {userChat &&
        userChat.map((acc) => {
          return <MessageForm key={acc._id} userChat={acc} />;
        })}
      {/* <div className="from-message">
        <span className="messages-chat">
          <p>Hi this Anandhan</p>
          <p className="chat-time">2:00pm</p>
        </span>
      </div>
      <div className="to-message">
        <div className="messages-chat">
          <p>yes Anandhan</p>
          <p className="chat-time">3:00pm</p>
        </div>
      </div> */}
    </div>
  );
};

const MessageForm = function ({ userChat }) {
  const { user } = useContext(ThemeContext);

  return (
    <div className={user._id === userChat.from ? "from-message" : "to-message"}>
      <span className="messages-chat">
        <p>Hi this Anandhan</p>
        <p className="chat-time">{new Date(userChat.createdAt).toLocaleTimeString()}</p>
      </span>
    </div>
  );
};

const MessageContent = function () {
  const { userMessage, setMessageSubmit, messageHandler } = useContext(ThemeContext);
  return (
    <div className="message-box">
      <form
        action=""
        className="message-box-cont"
        onSubmit={(e) => {
          e.preventDefault();
          setMessageSubmit(true);
        }}
      >
        <input
          type="text"
          placeholder="Message UserName"
          className="message-felid"
          value={userMessage}
          onChange={messageHandler}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Chat;

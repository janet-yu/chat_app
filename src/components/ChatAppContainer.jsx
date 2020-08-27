import React, { useState } from "react";
import ChatBox from "./ChatBox";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import NoChatsIcon from "../assets/nochats.svg";

/**
 * Contains the main chat components such as the list of online
 * users, chats between two users, and the chat box
 */

// STYLED COMPONENTS
const StyledChatAppContainer = styled.div`
  display: flex;
  width: 100%;
  max-height: 600px;
  min-height: 80vh;
`;

const StyledChatSection = styled.div`
  flex: 1 1 auto;
  background: #fcfcfc;
  width: 50%;
`;

const StyledChatsPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ChatAppContainer = ({ loggedInUser }) => {
  const [receivingUser, setReceivingUser] = useState({});

  const handleUserChange = (username, id) => {
    setReceivingUser({ username, id });
  };

  return (
    <StyledChatAppContainer>
      <Sidebar
        loggedInUser={loggedInUser}
        setReceivingUser={handleUserChange}
        username={loggedInUser.username}
        receivingUser={
          Object.keys(receivingUser).length === 0 ? "" : receivingUser
        }
      />

      <StyledChatSection>
        {/* When the logged in user hasn't initiated any chat */}
        {Object.keys(receivingUser).length === 0 ? (
          <StyledChatsPlaceholder>
            <img
              src={NoChatsIcon}
              style={{ width: "200px" }}
              alt="No chats icon"
            />
            <p style={{ marginTop: "10px", color: "#3275D9" }}>No chats...</p>
          </StyledChatsPlaceholder>
        ) : (
          <ChatBox receivingUser={receivingUser} loggedInUser={loggedInUser} />
        )}
      </StyledChatSection>
    </StyledChatAppContainer>
  );
};

export default ChatAppContainer;

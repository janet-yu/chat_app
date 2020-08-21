import React, { useEffect, useRef, useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import ChatsList from "./ChatsList";
import styled from "styled-components";
import "emoji-mart/css/emoji-mart.css";
import LoadingDots from "./common/LoadingDots";
import TextBox from "./TextBox";

/**
 * ChatBox renders the chats list and textbox
 */

// GRAPHQL
const CHATS_QUERY = gql`
  query getChats($user1_id: String!, $user2_id: String!) {
    messages(
      order_by: { created_at: asc }
      where: {
        _or: [
          {
            _and: [
              { sender_id: { _eq: $user1_id } }
              { receiver_id: { _eq: $user2_id } }
            ]
          }
          {
            _and: [
              { sender_id: { _eq: $user2_id } }
              { receiver_id: { _eq: $user1_id } }
            ]
          }
        ]
      }
    ) {
      id
      message_text
      userByReceiverId {
        id
        username
      }
      userBySenderId {
        id
        username
      }
    }
  }
`;

// STYLED COMPONENTS
const StyledChatBoxContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const StyledChatsListContainer = styled.div`
  overflow-y: auto;
  position: relative;
  padding: 25px;
  height: 100%;
`;

const StyledReceivingUsername = styled.h2`
  background-color: ${(props) => props.theme.primary};
  padding: 20px;
  font-size: 18px;
  color: #fff;
`;

const StyledLoadingContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSendingPopup = styled.div`
  position: relative;
  top: 10px;
  padding: 10px 20px;
  background: #ebebeb;
  color: #4d4d4d;
  display: inline-block;
  z-index: 2;
`;

const StyledTextBoxContainer = styled.div`
  position: relative;
  margin: 10px 20px;
`;

const ChatBox = (props) => {
  const { loggedInUser, receivingUser } = props;
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  const { subscribeToMore, loading, error, data } = useQuery(CHATS_QUERY, {
    variables: {
      user1_id: loggedInUser.id,
      user2_id: receivingUser.id,
    },
  });

  // Component references
  const chatsList = useRef(null);

  useEffect(() => {
    // to replicate componentdidmount, use [] as the second arg,
    // only run this code when receivingUser or data has changed

    if (
      chatsList.current &&
      chatsList.current.scrollTop !== chatsList.current.scrollHeight
    ) {
      chatsList.current.scrollTop = chatsList.current.scrollHeight;
    }
  }, [receivingUser, data]);

  const renderBody = (loading, error, data) => {
    if (loading) {
      return (
        <StyledLoadingContainer>
          <LoadingDots />
        </StyledLoadingContainer>
      );
    } else if (error) {
      console.log(error);
      return <p>Whoops! We couldn't fetch your messages...</p>;
    } else {
      return (
        <React.Fragment>
          <StyledChatsListContainer ref={chatsList}>
            <ChatsList
              {...props}
              chats={data.messages}
              lastMsgId={
                data.messages.length
                  ? data.messages[data.messages.length - 1].id
                  : 0
              }
              subscribeToMore={subscribeToMore}
              setIsSendingMsg={setIsSendingMsg}
            />
          </StyledChatsListContainer>
          <StyledTextBoxContainer>
            <TextBox {...props} setIsSendingMsg={setIsSendingMsg} />
          </StyledTextBoxContainer>
        </React.Fragment>
      );
    }
  };

  return (
    <StyledChatBoxContainer>
      <StyledReceivingUsername>
        {receivingUser.username}
      </StyledReceivingUsername>
      {isSendingMsg ? (
        <div
          style={{
            textAlign: "center",
            height: "0",
          }}
        >
          <StyledSendingPopup>Sending...</StyledSendingPopup>
        </div>
      ) : (
        ""
      )}
      {renderBody(loading, error, data)}
    </StyledChatBoxContainer>
  );
};

export default ChatBox;

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

/** TextBox represents the textbox for sending messages and handles the
 *  logic behind sending messages.
 *
 *  Credit for helping with the emoji picker logic: https://github.com/Allegra9/chat-client/blob/master/src/components/NewMessageForm.js
 */

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage(
    $sender_id: String!
    $receiver_id: String!
    $message: String!
  ) {
    insert_messages(
      objects: {
        sender_id: $sender_id
        receiver_id: $receiver_id
        message_text: $message
      }
    ) {
      affected_rows
    }
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 15px 120px 15px 15px;
  border-radius: 20px;
  border: none;
  background-color: #ebf2ff;
  font-size: 16px;
`;

const StyledSendBtn = styled.button`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${(props) => props.theme.primary};
  border-radius: 30px;
  border: none;
  padding: 15px 30px;
  &:hover {
    background: #265fb3;
  }
`;

const StyledEmojiToggle = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  font-size: 20px;
`;

const StyledToggleWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 110px;
  padding: 15px 0;
`;

const TextBox = (props) => {
  const { loggedInUser, receivingUser, setIsSendingMsg } = props;
  const emojiPicker = useRef(null);
  const [msgText, setMsgText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  // ignore data returned from the mutation since we don't need to use it
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    ignoreResults: true,
  });

  useEffect(() => {
    if (showEmojis) {
      document.addEventListener("click", closeEmojiMenu);
    } else if (closeEmojiMenu) {
      document.removeEventListener("click", closeEmojiMenu);
    }

    return () => document.removeEventListener("click", closeEmojiMenu);
  }, [showEmojis]);

  const handleSendMessage = useCallback(() => {
    if (msgText !== "") {
      setIsSendingMsg(true);
      sendMessage({
        variables: {
          sender_id: loggedInUser.id,
          receiver_id: receivingUser.id,
          message: msgText,
        },
      });
    }

    setMsgText("");
  }, [msgText, setIsSendingMsg]);

  const closeEmojiMenu = useCallback(
    (e) => {
      if (showEmojis && !emojiPicker.current.contains(e.target)) {
        setShowEmojis(false);
      }
    },
    [showEmojis]
  );

  const addEmoji = (e) => {
    const emoji = e.native;
    setMsgText(msgText + emoji);
  };

  return (
    <React.Fragment>
      <StyledInput
        type="text"
        id="message-input"
        placeholder="Start typing..."
        value={msgText}
        onChange={(e) => setMsgText(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handleSendMessage();
          }
        }}
      />

      {showEmojis && (
        <span
          style={{
            position: "absolute",
            bottom: "10%",
            right: "20%",
          }}
          ref={emojiPicker}
        >
          <Picker
            onSelect={(emoji) => {
              addEmoji(emoji);
            }}
          />
        </span>
      )}

      <StyledToggleWrapper>
        <StyledEmojiToggle
          onClick={() => {
            setShowEmojis(true);
          }}
        >
          {String.fromCodePoint(0x1f60a)}
        </StyledEmojiToggle>
      </StyledToggleWrapper>

      <StyledSendBtn
        onClick={() => {
          handleSendMessage();
        }}
      >
        Send
      </StyledSendBtn>
    </React.Fragment>
  );
};

export default TextBox;

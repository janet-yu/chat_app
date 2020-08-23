import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

/**
 * Message renders the UI for ONE chat message
 */
const StyledMessage = styled.div`
  text-align: ${(props) => (props.isSender ? "right" : "left")};
`;

const StyledMessageTxt = styled.p`
  border-radius: 15px;
  padding: 15px;
  display: inline-block;
  margin: 5px 0;
  max-width: 450px;
  ${(props) => {
    if (props.isSender) {
      return css`
        background-color: ${props.theme.senderMsgColor};
        color: #fff;
      `;
    }
    return css`
      background-color: ${props.theme.receiverMsgColor};
      color: ${props.theme.primaryNameColor};
    `;
  }}
`;

const Message = (props) => {
  const {
    sendingUser,
    messageText,
    sentByLoggedInUser,
    renderUsername,
  } = props;

  // if the message is sent by the logged-in user, use a different style
  return (
    <StyledMessage isSender={sentByLoggedInUser}>
      {renderUsername ? (
        <React.Fragment>
          <span
            style={{ display: "block", fontWeight: "600", color: "#3F3F40" }}
            className="chats-list__username"
          >
            {sendingUser.username}
          </span>
          <StyledMessageTxt isSender={sentByLoggedInUser}>
            {messageText}
          </StyledMessageTxt>
        </React.Fragment>
      ) : (
        <StyledMessageTxt isSender={sentByLoggedInUser}>
          {messageText}
        </StyledMessageTxt>
      )}
    </StyledMessage>
  );
};

Message.propTypes = {
  sendingUser: PropTypes.object,
  messageText: PropTypes.string,
  sentByLoggedInUser: PropTypes.bool,
  renderUsername: PropTypes.bool,
};

export default Message;

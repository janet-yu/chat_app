import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * OnlineUser renders the UI for an online user
 */
const StyledUserWrapper = styled.div`
  position: relative;
  &::after {
    content: "";
    width: 10px;
    height: 10px;
    background-color: ${(props) => (props.online ? "#99d55d" : "#B9B9B9")};
    position: absolute;
    border-radius: 100%;
    left: 25px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const StyledUserBtn = styled.button`
  padding: 20px;
  display: block;
  background-color: ${(props) =>
    props.receiver ? props.theme.selectedUser : "#FFF"};
  width: 100%;
  border: none;
  font-size: 16px;
  font-weight: ${(props) => (props.receiver ? "bold" : "normal")};
  color: ${(props) => (props.online ? "#000" : "#808080")};
  transition: background 0.3s ease;
  &:hover {
    background-color: ${(props) => props.theme.selectedUser};
  }
`;

const User = (props) => {
  const {
    userInfo: { username, id, isOnline },
    setReceivingUser,
    isReceivingUser,
    loggedInUser,
  } = props;

  return (
    <StyledUserWrapper online={isOnline ? "online" : ""}>
      <StyledUserBtn
        onClick={() => {
          if (!(loggedInUser.id === id)) {
            setReceivingUser(username, id);
          }
        }}
        receiver={isReceivingUser ? "receiver" : ""}
        online={isOnline ? "online" : ""}
      >
        {loggedInUser.id === id ? `${username} (You)` : username}
      </StyledUserBtn>
    </StyledUserWrapper>
  );
};

User.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    isOnline: PropTypes.bool,
  }),
  setReceivingUser: PropTypes.func,
  isReceivingUser: PropTypes.bool,
  loggedInUser: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default User;

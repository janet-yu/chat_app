import React from "react";
import UsersWrapper from "./UsersWrapper";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * Sidebar contains the greeting and list of users that you can chat with
 */

const StyledAside = styled.aside`
  box-shadow: 10px 0px 10px rgba(172, 189, 208, 0.2);
  position: relative;
  z-index: 1;
  background-color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledH1 = styled.h1`
  color: ${(props) => props.theme.primary};
  font-size: 21px;
  padding: 20px;
  font-weight: bold;
`;

const Sidebar = (props) => {
  const { username, loggedInUser, setReceivingUser, receivingUser } = props;
  return (
    <StyledAside>
      <StyledH1>Hi, {username}!</StyledH1>
      <UsersWrapper {...{ loggedInUser, setReceivingUser, receivingUser }} />
    </StyledAside>
  );
};

Sidebar.propTypes = {
  username: PropTypes.string,
  setReceivingUser: PropTypes.func,
  receivingUser: PropTypes.object,
  loggedInUser: PropTypes.object,
};

export default Sidebar;

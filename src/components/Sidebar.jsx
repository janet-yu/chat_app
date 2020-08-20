import React from "react";
import OnlineUsersWrapper from "./OnlineUsersWrapper";
import styled from "styled-components";

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
      <OnlineUsersWrapper
        loggedInUser={loggedInUser}
        setReceivingUser={setReceivingUser}
        receivingUser={receivingUser}
      />
    </StyledAside>
  );
};

export default Sidebar;

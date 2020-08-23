import React from "react";
import ChatAppContainer from "./ChatAppContainer";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledLogout = styled.button`
  border: none;
  text-transform: uppercase;
  color: #224b88;
  padding: 10px;
  background: none;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

const Home = (props) => {
  const { username, userID, logout } = props;

  // Render main chat container, online users, hi [username]!
  return (
    <React.Fragment>
      <div style={{ textAlign: "right" }}>
        <StyledLogout
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout
        </StyledLogout>
      </div>
      <ChatAppContainer loggedInUser={{ username, id: userID }} />
    </React.Fragment>
  );
};

Home.propTypes = {
  username: PropTypes.string,
  userID: PropTypes.string,
  logout: PropTypes.func,
};

export default Home;

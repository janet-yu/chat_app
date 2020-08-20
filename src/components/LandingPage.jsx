import React from "react";
import gql from "graphql-tag";
import { Query } from "@apollo/client/react/components";
import { useAuth0 } from "@auth0/auth0-react";
import Home from "./Home";
import styled from "styled-components";
import LoadingDots from "./common/LoadingDots";

const StyledMainContainer = styled.main`
  width: 100%;
  max-width: 1000px;
`;

const StyledLoginButton = styled.button`
  background: ${(props) => props.theme.primary};
  border-radius: 40px;
  padding: 20px 40px;
  font-size: 18px;
  color: #fff;
  border: none;
  margin-top: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #fff;
    color: ${(props) => props.theme.primary};
  }
`;

const GET_USERNAME_QUERY = gql`
  query getUserID($id: String!) {
    users(where: { id: { _eq: $id } }) {
      id
      username
      last_seen
    }
  }
`;

const LandingPage = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <StyledMainContainer>
      {!isAuthenticated ? (
        <React.Fragment>
          <h1 style={{ color: "#244874" }}>Start Chatting!</h1>
          <h2 style={{ fontWeight: "normal", color: "#244874" }}>
            And make new friends!
          </h2>
          <StyledLoginButton onClick={() => loginWithRedirect({})}>
            Login/Sign Up
          </StyledLoginButton>
        </React.Fragment>
      ) : (
        <Query query={GET_USERNAME_QUERY} variables={{ id: user.sub }}>
          {({ loading, error, data }) => {
            if (error) {
              console.log(error);
              return "Sorry, we couldn't process your account information. Try again later.";
            }

            if (loading) return <LoadingDots />;

            return (
              <Home
                userID={user.sub}
                username={data.users[0].username}
                lastSeen={data.users[0].last_seen}
                logout={logout}
              />
            );
          }}
        </Query>
      )}
    </StyledMainContainer>
  );
};

export default LandingPage;

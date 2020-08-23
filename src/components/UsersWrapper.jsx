import React, { useEffect, useState } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import styled from "styled-components";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import User from "./User";

/**
 * UsersWrapper displays all the users registered with the app,
 * both offline and online
 */

const UPDATE_LASTSEEN_MUTATION = gql`
  mutation updateLastSeen($userID: String!, $now: timestamptz!) {
    update_users(where: { id: { _eq: $userID } }, _set: { last_seen: $now }) {
      returning {
        id
        username
        last_seen
      }
    }
  }
`;

const GET_USERS_SUBSCRIPTION = gql`
  subscription getUsers {
    users(order_by: { last_seen: desc }) {
      id
      username
      last_seen
    }
  }
`;

const StyledUsersWrapper = styled.div`
  height: 100%;
  overflowy: auto;
`;

const StyledUsersH2 = styled.h2`
  font-size: 16px;
  color: #6d6d72;
  font-weight: normal;
  text-align: left;
  margin: 10px 0 10px 25px;
`;

const UsersWrapper = (props) => {
  const [onlineIndicator, setOnlineIndicator] = useState(0);
  const { loggedInUser, setReceivingUser, receivingUser } = props;
  let onlineUsersList = [];
  let offlineUsersList = [];

  useEffect(() => {
    // Every 20s, run a mutation to tell the backend that you're online
    updateLastSeen();
    setOnlineIndicator(setInterval(() => updateLastSeen(), 20000));
    return () => {
      // Clean up
      clearInterval(onlineIndicator);
    };
  }, []);

  const [updateLastSeenMutation] = useMutation(UPDATE_LASTSEEN_MUTATION, {
    ignoreResults: true,
  });

  const updateLastSeen = () => {
    updateLastSeenMutation({
      variables: { userID: loggedInUser.id, now: new Date().toISOString() },
    });
  };

  const { loading, error, data } = useSubscription(GET_USERS_SUBSCRIPTION);

  if (error) {
    console.log(error);
  }

  if (data) {
    data.users.forEach((user) => {
      // Check if the user has been active within the last 20 seconds
      // (use 21 secs for subtraction to avoid flickering online indicator)
      const isOnline =
        new Date(user.last_seen).getTime() >= new Date().getTime() - 21000;

      const userComponent = (
        <User
          key={user.username}
          loggedInUser={loggedInUser}
          isReceivingUser={receivingUser.id === user.id}
          userInfo={{ username: user.username, id: user.id, isOnline }}
          setReceivingUser={setReceivingUser}
        />
      );

      if (isOnline) {
        onlineUsersList.push(userComponent);
      } else {
        offlineUsersList.push(userComponent);
      }
    });
  }

  const renderUsers = () => {
    if (loading) {
      return <p>Loading users...</p>;
    } else {
      return (
        <React.Fragment>
          <StyledUsersH2>Online Users</StyledUsersH2>
          {onlineUsersList}
          {offlineUsersList.length ? (
            <React.Fragment>
              <StyledUsersH2>Offline Users</StyledUsersH2>
              {offlineUsersList}
            </React.Fragment>
          ) : (
            ""
          )}
        </React.Fragment>
      );
    }
  };

  return <StyledUsersWrapper>{renderUsers()}</StyledUsersWrapper>;
};

UsersWrapper.propTypes = {
  setReceivingUser: PropTypes.func,
  loggedInUser: PropTypes.object,
  receivingUser: PropTypes.object,
};

export default UsersWrapper;

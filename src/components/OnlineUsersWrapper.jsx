import React, { useEffect, useState } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import styled from "styled-components";
import gql from "graphql-tag";
import OnlineUser from "./OnlineUser";

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
  margin: 0 0 10px 25px;
`;

// get all the users, create the users list
const OnlineUsersWrapper = (props) => {
  const [onlineIndicator, setOnlineIndicator] = useState(0);
  const { loggedInUser, setReceivingUser, receivingUser } = props;
  let onlineUsersList;

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
    onlineUsersList = data.users.map((user) => {
      // last seen > current time - 20 seconds to see if the user was online the past 20 sec
      // Note: -21000 here to ensure that users online within the last 20 seconds
      // are displayed as "online", sometimes the green dot flickers when it's exactly 20000
      const isOnline =
        new Date(user.last_seen).getTime() >= new Date().getTime() - 21000;

      return (
        <OnlineUser
          key={user.username}
          loggedInUser={loggedInUser}
          isReceivingUser={receivingUser.id === user.id}
          userInfo={{ username: user.username, id: user.id, isOnline }}
          setReceivingUser={setReceivingUser}
        />
      );
    });
  }

  return (
    <StyledUsersWrapper>
      <StyledUsersH2>Online Users</StyledUsersH2>
      {loading ? <p>Loading users...</p> : onlineUsersList}
    </StyledUsersWrapper>
  );
};

export default OnlineUsersWrapper;
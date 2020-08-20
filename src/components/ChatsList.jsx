import React, { Component } from "react";
import Message from "./Message";
import gql from "graphql-tag";

/**
 * ChatsList renders the messages between two users
 */

// Listen for messages only after the last received msg
const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription getNewMessages(
    $user1_id: String!
    $user2_id: String!
    $last_received_id: Int!
  ) {
    messages(
      order_by: { id: asc }
      where: {
        id: { _gt: $last_received_id }
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

class ChatsList extends Component {
  componentDidMount() {
    this.prevUserId = "";
    this.renderUsername = false;
    this.unsubscribe = this.subscribe(
      this.props.loggedInUser.id,
      this.props.receivingUser.id,
      this.props.lastMsgId
    );
  }

  shouldComponentUpdate(prevProps) {
    if (
      prevProps.receivingUser.id !== this.props.receivingUser.id ||
      prevProps.lastMsgId !== this.props.lastMsgId
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.receivingUser.id !== prevProps.receivingUser.id ||
      prevProps.lastMsgId !== this.props.lastMsgId
    ) {
      if (this.unsubscribe) {
        // Note: when you don't unsubscribe, you subscribe to
        // multiple times to the same sub, which then
        // results in updateQuery being called the # of times you
        // previously subscribed
        this.unsubscribe();
      }
      // subscribe to the subscription listening for messages between
      // the two users

      this.unsubscribe = this.subscribe(
        this.props.loggedInUser.id,
        this.props.receivingUser.id,
        this.props.lastMsgId
      );
    }

    // every time we update, the component will re render the messages,
    // thus we have to reset the tracker variable prevUserId
    this.prevUserId = "";
  }

  componentWillUnmount() {
    console.log("ChatsList unmounted");

    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (user1ID, user2ID, lastMsgId) =>
    this.props.subscribeToMore({
      document: NEW_MESSAGES_SUBSCRIPTION,
      variables: {
        user1_id: user1ID,
        user2_id: user2ID,
        last_received_id: lastMsgId,
      },

      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || !subscriptionData.data.messages.length)
          return prev;
        // it might fire at least once BC when we first listen
        // to the subscription, a value automatically returns
        // which is the new sub data that updatequery will
        // look at
        const newMessages = subscriptionData.data.messages;

        // at this point, we have our new message and can display it realtime
        this.props.setIsSendingMsg(false);

        return {
          messages: [...prev.messages, ...newMessages],
        };
      },
    });

  render() {
    const { chats, loggedInUser } = this.props;

    return (
      <div className="chats-list">
        {chats.map((msgDetails) => {
          const {
            userByReceiverId,
            userBySenderId,
            message_text: messageText,
            id,
          } = msgDetails;

          // prevUserId is the user id of the previous message sent
          // We want to check if we need to render the username
          // for a message or not
          if (
            this.prevUserId === "" ||
            this.prevUserId !== userByReceiverId.id
          ) {
            this.prevUserId = userByReceiverId.id;
            this.renderUsername = true;
          } else if (this.prevUserId === userByReceiverId.id) {
            this.renderUsername = false;
          }

          return (
            <Message
              key={id}
              sendingUser={userBySenderId}
              messageText={messageText}
              sentByLoggedInUser={userBySenderId.id === loggedInUser.id}
              renderUsername={this.renderUsername}
            />
          );
        })}
      </div>
    );
  }
}

export default ChatsList;

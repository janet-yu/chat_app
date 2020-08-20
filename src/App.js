import React, { useState } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ApolloProvider } from "@apollo/client";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { useAuth0 } from "@auth0/auth0-react";
import { setContext } from "@apollo/client/link/context";
import LandingPage from "./components/LandingPage";

const GRAPHQL_ENDPOINT = "thorough-beetle-82.hasura.app/v1/graphql";

const GlobalStyle = createGlobalStyle`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html,body, #root, #root>div {
      min-height: 100vh;
      position: relative;
      width: 100%;
    }

    body {
      background-color: #B7CEF0;
      font-family: "Open Sans", sans-serif;
    }

    .App {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    /*Custom scrollbar only for Chrome*/

    ::-webkit-scrollbar {
      width: 10px;
    }
    
    /* Track */
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #96A8CA;
      border-radius: 10px;
    }
    
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

  `;

function App() {
  const { isAuthenticated, getAccessTokenSilently, loading } = useAuth0();
  // when setAccessToken is called, the state changes and thus, re-renders the App component
  const [accessToken, setAccessToken] = useState("");

  if (loading) {
    return "LOADING";
  }

  const getAccessToken = async () => {
    if (isAuthenticated) {
      const token = await getAccessTokenSilently();
      setAccessToken(token);
      console.log("Fetched access token, ", token);
    }
  };

  getAccessToken();

  const authLink = setContext((_, { headers }) => {
    const token = accessToken;
    // return the headers to the context so httpLink can read them
    if (token) {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    } else {
      return {
        headers: {
          ...headers,
        },
      };
    }
  });

  const httpLink = new HttpLink({ uri: `https://${GRAPHQL_ENDPOINT}` });
  const wsLink = new WebSocketLink(
    new SubscriptionClient(`wss://${GRAPHQL_ENDPOINT}`, {
      reconnect: true,
      connectionParams: async () => {
        const token = accessToken;
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        };
      },
    })
  );

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    authLink.concat(httpLink)
  );

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  const theme = {
    primary: "#3275D9",
    primaryNameColor: "#3F3F40",
    senderMsgColor: "#3F81E2",
    receiverMsgColor: "#D3E2F9",
    selectedUser: "#EEF2F8",
  };

  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <div className="App">
          <LandingPage />
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

import React from "react";
import App from "./App";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "https://arcane-plateau-26527.herokuapp.com/",
});
const client = new ApolloClient({
  cache,
  link,
});

export default (
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <App />
    </ApolloHooksProvider>
  </ApolloProvider>
);

// ~~~~~~~~
// graph-ql
// ~~~~~~~~

import Vue from 'vue'
import VueApollo from 'vue-apollo'

import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' })

// Authenticate every graph-ql request to GitHub
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      Authorization: `bearer ${localStorage.getItem('token')}` || null
    }
  })

  return forward(operation)
})

const apolloClient = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

Vue.use(VueApollo)

export default new VueApollo({
  defaultClient: apolloClient
})

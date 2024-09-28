import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `https://${process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-Shopify-Storefront-Access-Token': process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
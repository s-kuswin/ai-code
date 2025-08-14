/*
 * @Author: shirongwei-lhq
 * @Date: 2025-08-13 11:01:08
 * @LastEditors: shirongwei-lhq
 * @LastEditTime: 2025-08-14 13:58:16
 * @Description: 
 */
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

// 创建一个自定义链接来处理错误
const errorLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    // 可以在这里处理响应或错误
    return response;
  });
});

// 创建 HTTP 链接
const httpLink = new HttpLink({
  uri: 'https://ai.kuswinnershi.top/worker/graphql', // 默认指向本地 GraphQL 端点
});

// 创建 Apollo Client
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;
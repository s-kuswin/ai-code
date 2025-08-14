/*
 * @Author: shirongwei-lhq
 * @Date: 2025-08-13 09:59:31
 * @LastEditors: shirongwei-lhq
 * @LastEditTime: 2025-08-14 14:24:37
 * @Description: 
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client'
import client from './apolloClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
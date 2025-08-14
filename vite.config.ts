/*
 * @Author: shirongwei-lhq
 * @Date: 2025-08-13 09:59:31
 * @LastEditors: shirongwei-lhq
 * @LastEditTime: 2025-08-13 15:50:55
 * @Description: 
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/graphql': {
        target: 'https://worker.kuswinnershi.top/graphql', // 替换为实际的 Cloudflare Worker 地址
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
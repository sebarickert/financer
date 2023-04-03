import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: process.env.BACKEND_URL,
  // target: 'http://localhost:4000',
  secure: false,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
    '^/auth': '/auth',
  },
});

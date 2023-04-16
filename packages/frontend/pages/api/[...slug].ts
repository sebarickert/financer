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

// eslint-disable-next-line import/no-named-export
export const config = {
  api: {
    bodyParser: false, // I added this
  },
};

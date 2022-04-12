/* eslint-disable */ 

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/health-check',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
    })
  );
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
    })
  );
};
// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/api', // Your API endpoints
    createProxyMiddleware({
      target: 'http://103.9.23.119:6611', // Your backend API URL
      changeOrigin: true,
    })
  );
};

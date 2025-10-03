const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy API requests to Backend 1
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://collectionapi.metmuseum.org/public/collection/v1/search",
      changeOrigin: true,
    })
  );

  // Proxy Auth requests to Backend 2
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:6000",
      changeOrigin: true,
    })
  );

  // Proxy Media requests to Backend 3
  app.use(
    "/media",
    createProxyMiddleware({
      target: "http://localhost:7000",
      changeOrigin: true,
    })
  );
};

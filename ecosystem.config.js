module.exports = {
  apps: [
    {
      name: "nano-server",
      script: "node server.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};

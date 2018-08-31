module.exports = {
  apps: [
    {
      name: "beta-explorer-api",
      script: "server.api.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "beta-explorer-peers",
      script: "server.peers.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "beta-explorer-top-accounts",
      script: "server.top-accounts.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "beta-explorer-tps",
      script: "server.tps.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};

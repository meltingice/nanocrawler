module.exports = {
  apps: [
    {
      name: "explorer-api",
      script: "server.api.js",
      instances: 4,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "explorer-peers",
      script: "server.peers.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "explorer-top-accounts",
      script: "server.top-accounts.js",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    },
    {
      name: "explorer-tps",
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

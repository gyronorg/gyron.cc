module.exports = {
  apps: [
    {
      name: "docs",
      exec_mode: "cluster",
      instances: "1",
      script: "./dist/server/index.js",
      args: "start",
      env: {
        PORT: "40892",
      },
    },
  ],
};

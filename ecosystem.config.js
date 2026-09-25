module.exports = {
  apps: [
    {
      name: "masjid-display-backend",
      script: "backend/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 4001
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      merge_logs: true,
      time: true
    }
  ]
};

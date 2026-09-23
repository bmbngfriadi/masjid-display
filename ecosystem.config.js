module.exports = {
  apps: [
    {
      name: 'masjid-backend',
      script: './backend/server.js',
      cwd: 'd:/dev/masjid-baitul-jannah/masjid-display',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        NODE_ENV: 'development',
        PORT: 4001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4001,
        DATABASE_URL: 'postgresql://masjid_app:PASSWORD@127.0.0.1:5432/masjid_db',
        APP_BASE_PATH: '/masjid',
        SOCKET_PATH: '/masjid/socket.io'
      }
    }
  ]
};

/**
 * PM2 Ecosystem Configuration
 * Professional production setup for christina-sings4you.com.au
 */

module.exports = {
  apps: [
    {
      name: 'sing4you-api',
      script: './dist/server/index.js',
      cwd: '/var/www/christina-sings4you',
      instances: 1,
      exec_mode: 'fork',
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // Advanced PM2 features
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Ignore watch patterns
      ignore_watch: ['node_modules', 'logs', 'uploads'],
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: '76.13.96.198',
      ref: 'origin/master',
      repo: 'git@github.com:YOUR_USERNAME/sing4you.git', // Update with your actual repo
      path: '/var/www/christina-sings4you',
      'post-deploy': 'npm ci --production && npm run build && npm run build:server && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': 'mkdir -p /var/www/christina-sings4you && mkdir -p /var/log/pm2',
      'pre-deploy-local': 'echo "Deploying to production server..."',
    },
  },
};

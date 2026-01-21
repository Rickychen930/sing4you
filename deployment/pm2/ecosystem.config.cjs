/**
 * PM2 Ecosystem Configuration
 * Professional production setup for christina-sings4you.com.au
 */

module.exports = {
  apps: [
    {
      name: 'christina-sings4you-api',
      script: './dist/server/index.js',
      cwd: '/var/www/christina-sings4you',
      instances: 2, // Use 2 instances for load balancing (adjust based on CPU cores)
      exec_mode: 'cluster',
      // Load environment variables from .env file
      env_file: '/var/www/christina-sings4you/.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Logging
      error_file: '/var/log/pm2/christina-sings4you-error.log',
      out_file: '/var/log/pm2/christina-sings4you-out.log',
      log_file: '/var/log/pm2/christina-sings4you-combined.log',
      time: true,
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
      
      // Source map support
      source_map_support: true,
      
      // Instance vars
      instance_var: 'INSTANCE_ID',
    },
  ],

  deploy: {
    production: {
      // NOTE: Update these values with your actual deployment settings
      // Consider using environment variables or a separate config file for sensitive data
      user: 'root',
      host: process.env.DEPLOY_HOST || 'YOUR_SERVER_IP', // Use environment variable
      ref: 'origin/master',
      repo: process.env.DEPLOY_REPO || 'git@github.com:YOUR_USERNAME/sing4you.git', // Use environment variable
      path: '/var/www/christina-sings4you',
      'post-deploy': 'npm install && npm run build && npm run build:server && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': '',
    },
  },
};

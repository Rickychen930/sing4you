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
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Logging - create directory if it doesn't exist
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
      
      // Interpreter
      interpreter: 'node',
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

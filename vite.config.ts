import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@client': path.resolve(__dirname, './src/client'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // OPTIMIZED: Better code splitting for performance
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@dr.pogodin/react-helmet')) {
              return 'helmet-vendor';
            }
            if (id.includes('axios')) {
              return 'axios-vendor';
            }
            // Other vendor libraries
            return 'vendor';
          }
          // Admin pages chunk (separate from public)
          if (id.includes('/pages/admin/')) {
            return 'admin-pages';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // OPTIMIZED: Better chunk size limits
    chunkSizeWarningLimit: 800,
    // Disable source maps in production for better performance
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    // Minify and optimize - using esbuild (faster and built-in)
    minify: 'esbuild',
    // Note: esbuild automatically drops console in production builds
    // OPTIMIZED: Reduced asset inlining limit
    assetsInlineLimit: 2048, // Inline assets smaller than 2kb (reduced from 4kb)
    // Report compressed size
    reportCompressedSize: true,
    // CSS code splitting
    cssCodeSplit: true,
    // Performance optimizations
    target: 'esnext',
    // OPTIMIZED: Better minification options
    cssMinify: true,
    // OPTIMIZED: Reduce asset file size
    assetsDir: 'assets',
  },
})
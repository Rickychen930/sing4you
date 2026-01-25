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
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'helmet-vendor': ['@dr.pogodin/react-helmet'],
          'axios-vendor': ['axios'],
          // Admin pages chunk (separate from public)
          'admin-pages': [
            './src/client/pages/admin/DashboardPage',
            './src/client/pages/admin/HeroManagementPage',
            './src/client/pages/admin/SectionsManagementPage',
            './src/client/pages/admin/PerformancesManagementPage',
            './src/client/pages/admin/TestimonialsManagementPage',
            './src/client/pages/admin/SEOManagementPage',
            './src/client/pages/admin/CategoriesManagementPage',
            './src/client/pages/admin/VariationsManagementPage',
          ],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional)
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    // Minify and optimize - using esbuild (faster and built-in)
    minify: 'esbuild',
    // Note: esbuild automatically drops console in production builds
    // Optimize asset inlining
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Report compressed size
    reportCompressedSize: true,
    // CSS code splitting
    cssCodeSplit: true,
    // Performance optimizations
    target: 'esnext',
  },
})
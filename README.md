# Christina Sings4U - Professional Singer Portfolio Website

A complete, production-ready full-stack website for a professional singer portfolio, built with React, TypeScript, MongoDB, and Express. Designed for the Australian market, specifically targeting Sydney and NSW.

## 🎯 Features

### Public Website
- **Hero Section** - Dynamic hero with customizable title, subtitle, background images/videos, and CTA buttons
- **Performance Sections** - Reusable sections for Solo, Duo, Trio, Band, Wedding, Corporate performances
- **Upcoming Performances** - Dynamic event listings with venue, date, time, and ticket links
- **Testimonials** - Client testimonials with ratings
- **Blog** - Full blog system with SEO-friendly URLs
- **Contact Form** - Integrated contact form with WhatsApp and Email CTAs
- **SEO Optimization** - React Helmet, OpenGraph tags, JSON-LD schemas, semantic HTML
- **Responsive Design** - Mobile-first design with TailwindCSS
- **Smooth Scrolling** - Optimized scrolling animations

### Admin Dashboard
- **Authentication** - JWT-based authentication with refresh tokens
- **Hero Management** - Update hero settings via admin panel
- **Section Management** - CRUD operations for performance sections
- **Performance Management** - Manage upcoming events and performances
- **Testimonial Management** - Add and manage client testimonials
- **Blog Management** - Full blog post management system
- **SEO Settings** - Manage default SEO metadata

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **React Router** for routing
- **Zustand** for state management
- **TailwindCSS** for styling
- **React Helmet Async** for SEO
- **Vite** for build tooling

### Backend
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose (class-based models)
- **JWT** for authentication
- **Zod** for validation
- **Cloudinary** for media management (optional)

### Architecture
- **MVC Pattern** - Clear separation of concerns
- **OOP Principles** - Class-based models and services
- **SOLID Principles** - Maintainable and scalable code
- **DRY Principles** - Reusable components and utilities

## 📁 Project Structure

```
/src
  /client              # Frontend React application
    /components        # Reusable React components
      /ui              # UI components (Button, Card, Input, etc.)
      /layout          # Layout components (Header, Footer, Layout)
      /sections        # Section components (Hero, PerformanceSection, etc.)
    /pages             # Page components
      /public          # Public pages (Home, Blog, Contact, etc.)
      /admin           # Admin pages (Dashboard, Login, etc.)
    /hooks             # Custom React hooks
    /services          # API service layer
    /stores            # Zustand stores
    /types             # TypeScript types
    /utils             # Utility functions

  /server              # Backend Express application
    /config            # Configuration files (database, cloudinary)
    /controllers       # Request handlers (MVC Controllers)
    /models            # Mongoose models (class-based)
    /routes            # Express routes
    /services          # Business logic (MVC Services)
    /middlewares       # Express middlewares (auth, error handling, validation)
    /utils             # Utility functions

  /shared              # Shared code between frontend and backend
    /interfaces        # Shared TypeScript interfaces
    /constants         # Shared constants
    /utils             # Shared utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sing4you
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   SITE_URL=https://christinasings4u.com.au

   # Database Configuration
   # MongoDB Atlas (Recommended for production)
   MONGODB_URI=mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u
   # Replace <db_password> with your actual MongoDB Atlas password
   # Local MongoDB (Alternative):
   # MONGODB_URI=mongodb://localhost:27017/christinasings4u

   # JWT Configuration
   JWT_SECRET=your-secret-key-change-in-production
   JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d

   # Cloudinary Configuration (Optional)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Frontend Configuration
   VITE_API_URL=http://localhost:3001
   VITE_SITE_URL=https://christinasings4u.com.au
   ```

4. **Configure MongoDB**
   
   **Option A: MongoDB Atlas (Recommended)**
   - Use the provided connection string: `mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u`
   - Replace `<db_password>` with your actual password
   - Add to `.env` file as `MONGODB_URI`
   - No need to start MongoDB locally
   
   **Option B: Local MongoDB**
   - Start MongoDB locally: `mongod`
   - Use: `MONGODB_URI=mongodb://localhost:27017/christinasings4u`

### Development

1. **Start development servers**
   
   This will start both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   
   Or run them separately:
   ```bash
   # Terminal 1: Frontend
   npm run dev:client

   # Terminal 2: Backend
   npm run dev:server
   ```

2. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Admin Login: http://localhost:5173/admin/login

### Creating Admin User

To create an admin user, you can use MongoDB shell or a script:

```javascript
// In MongoDB shell or via script
const bcrypt = require('bcryptjs');
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash('your-password', salt);

db.adminusers.insertOne({
  email: 'admin@example.com',
  password: hashedPassword,
  name: 'Admin User',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

Or create a script in `src/server/scripts/createAdmin.ts` and run it with `tsx`.

### Production Build

1. **Build frontend**
   ```bash
   npm run build
   ```

2. **Build backend**
   ```bash
   npm run build:server
   ```

3. **Start production server**
   ```bash
   npm run start:server
   ```

## 🔧 Configuration

### MongoDB Connection

**MongoDB Atlas (Recommended):**
Your MongoDB Atlas connection string:
```
mongodb+srv://sings4you:<db_password>@sings4you.qahkyi2.mongodb.net/christinasings4u
```

1. Replace `<db_password>` with your actual MongoDB Atlas password
2. Add the connection string to `.env` as `MONGODB_URI`
3. Make sure your MongoDB Atlas cluster allows network access from your IP
4. Ensure the database user `sings4you` has read/write permissions

**Local MongoDB (Alternative):**
For local development, you can use:
```
MONGODB_URI=mongodb://localhost:27017/christinasings4u
```

See `MONGODB_SETUP.md` for detailed setup instructions.

### Cloudinary Setup (Optional)
For media uploads, configure Cloudinary:
1. Sign up at https://cloudinary.com
2. Get your cloud name, API key, and API secret
3. Add them to `.env`

### JWT Secrets
Generate strong random secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET` in production.

## 📝 API Endpoints

### Public Endpoints
- `GET /api/hero` - Get hero settings
- `GET /api/sections` - Get all sections
- `GET /api/sections/type/:type` - Get sections by type
- `GET /api/performances` - Get all performances
- `GET /api/performances/upcoming` - Get upcoming performances
- `GET /api/testimonials` - Get all testimonials
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/slug/:slug` - Get blog post by slug
- `GET /api/seo` - Get SEO settings
- `POST /api/contact` - Submit contact form
- `GET /sitemap.xml` - Generate sitemap

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/refresh` - Refresh access token
- `POST /api/admin/auth/logout` - Admin logout
- `PUT /api/admin/hero` - Update hero settings
- `POST /api/admin/sections` - Create section
- `PUT /api/admin/sections/:id` - Update section
- `DELETE /api/admin/sections/:id` - Delete section
- `POST /api/admin/performances` - Create performance
- `PUT /api/admin/performances/:id` - Update performance
- `DELETE /api/admin/performances/:id` - Delete performance
- `POST /api/admin/testimonials` - Create testimonial
- `PUT /api/admin/testimonials/:id` - Update testimonial
- `DELETE /api/admin/testimonials/:id` - Delete testimonial
- `POST /api/admin/blog` - Create blog post
- `PUT /api/admin/blog/:id` - Update blog post
- `DELETE /api/admin/blog/:id` - Delete blog post
- `PUT /api/admin/seo` - Update SEO settings

## 🌐 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Update all environment variables for production
3. Set secure JWT secrets
4. Configure MongoDB connection string
5. Set `CLIENT_URL` and `SITE_URL` to production domains

### Deploying Frontend
- Build with `npm run build`
- Serve the `dist/client` folder with a static hosting service (Vercel, Netlify, etc.)

### Deploying Backend
- Build with `npm run build:server`
- Run `node dist/server/index.js` or use PM2 for process management
- Deploy to services like Heroku, Railway, or AWS

### MongoDB
- Use MongoDB Atlas for cloud hosting
- Update `MONGODB_URI` to your Atlas connection string

## 📖 Documentation

### Code Quality
- TypeScript strict mode enabled
- ESLint configured
- SOLID, DRY, and KISS principles applied
- Class-based models with static methods
- Reusable components

### SEO Features
- React Helmet for meta tags
- OpenGraph tags
- JSON-LD schemas (Artist, Event, Article)
- Semantic HTML structure
- Sitemap generation

### Performance
- Lazy loading for images
- Code splitting
- Smooth scrolling with requestAnimationFrame
- Optimized bundle size

## 🤝 Contributing

This is a complete, production-ready project. For any enhancements:
1. Follow existing code patterns
2. Maintain TypeScript strict mode
3. Follow SOLID principles
4. Write reusable components

## 📄 License

This project is proprietary software for Christina Sings4U.

## 🆘 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using React, TypeScript, MongoDB, and Express**
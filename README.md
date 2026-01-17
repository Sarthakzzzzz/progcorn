# ProgCorn - Programming Resources Hub

A full-stack web platform for discovering programming resources and tracking competitive programming contests with real-time data integration.

## ✨ Features

### 📚 Resource Management
- Submit and curate programming resources with categories and tags
- Upvote, comment, and report system for community moderation
- Personal collections to organize favorite resources
- Advanced search with filters and sorting options

### 🏆 Contest Integration
- Real-time contest data from 50+ platforms via Clist API
- Automated hourly synchronization with node-cron
- Platform statistics and contest tracking
- Upcoming and live contest notifications

### 👥 User System
- JWT-based authentication with bcrypt password hashing
- Role-based access control (USER/ADMIN)
- User profiles and activity tracking
- Admin dashboard for content moderation

### 🔍 Advanced Features
- Full-text search across resources and contests
- Tag-based filtering and categorization
- Statistics dashboard with platform insights
- Responsive design for all devices

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens, bcrypt hashing
- **External APIs**: Clist API for contest data
- **Scheduling**: node-cron for automated tasks
- **Security**: Helmet, CORS, input validation with Zod

## 📁 Project Structure
```
progcorn/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── collections/       # User collections
│   ├── contests/          # Contest listings
│   ├── login/             # Authentication
│   └── resources/         # Resource management
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── *.tsx             # Feature components
├── src/                   # Express.js backend
│   ├── middleware/        # Auth, validation, error handling
│   ├── routes/modules/    # API route handlers
│   ├── services/          # External API integrations
│   └── index.ts          # Server entry point
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database models
│   └── seed.ts           # Sample data
├── lib/                  # Shared utilities
└── styles/               # Global CSS
```

## ⚙️ Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Backend
PORT=4000
JWT_SECRET=your_secure_jwt_secret

# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/progcorn?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/progcorn?schema=public"

# Clist API Integration (Optional)
CLIST_USERNAME=your_clist_username
CLIST_API_KEY=your_clist_api_key
CLIST_DISABLE_SCHEDULER=false
```

## 🚀 Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Setup PostgreSQL database**
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update && sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE progcorn;
CREATE USER progcorn_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE progcorn TO progcorn_user;
\q

# Update .env with your database credentials
# Then run migrations
npx prisma generate
npx prisma migrate dev
npm run seed
```

3. **Start development servers**
```bash
npm run dev
```

**Access the application:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:4000
- 📊 Health Check: http://localhost:4000/health

**Default credentials:**
- Admin: `admin@prhub.dev` / `password123!`
- User: `user@prhub.dev` / `password123!`

### Clist Integration Notes
- Automatic contest/platform import on server start (if credentials provided)
- Hourly data synchronization via node-cron
- Manual refresh endpoints available for admins
- Set `CLIST_DISABLE_SCHEDULER=true` to disable auto-sync in development

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register     # User registration
POST   /auth/login        # User login
GET    /auth/me           # Get current user (Bearer token)
```

### Resources
```
GET    /resources         # List resources (q, tag, categoryId, sort)
GET    /resources/:id     # Get single resource
POST   /resources         # Create resource (auth)
PUT    /resources/:id     # Update resource (auth)
DELETE /resources/:id     # Soft delete resource (auth)
POST   /resources/:id/upvote    # Toggle upvote (auth)
GET    /resources/:id/comments  # Get comments
POST   /resources/:id/comments  # Add comment (auth)
POST   /resources/:id/report    # Report resource (auth)
```

### Search & Discovery
```
GET    /search           # Advanced search (query, tag, category, sort)
GET    /tags             # List all tags
GET    /tags/:name       # Get tag by name
GET    /categories       # List all categories
GET    /categories/:name # Get category by name
GET    /stats            # Platform statistics
```

### Collections
```
GET    /collections      # User collections (auth)
POST   /collections      # Create collection (auth)
GET    /collections/:id  # Get collection (auth)
POST   /collections/:id/add/:resourceId  # Add to collection (auth)
```

### Contests & Platforms
```
GET    /contests         # List contests
GET    /contests/:id     # Get contest details
POST   /contests/refresh # Refresh contest data (admin)
GET    /platforms        # List platforms (sort: contests|accounts|name)
POST   /platforms/refresh # Refresh platform data (admin)
```

### Admin
```
GET    /admin/resources  # Moderate resources (admin)
DELETE /admin/resource/:id # Delete resource (admin)
GET    /admin/reports    # View reports (admin)
```

## 🗄️ Database Schema

**Core Models:**
- `User` - Authentication and profiles
- `Resource` - Programming resources with metadata
- `Category` - Resource categorization
- `Tag` - Flexible tagging system
- `Comment` - User discussions
- `Upvote` - Community voting
- `Collection` - User-curated lists
- `Report` - Content moderation

**Contest Models:**
- `Contest` - Programming contests from Clist API
- `Platform` - Contest platforms (Codeforces, LeetCode, etc.)

**Admin Models:**
- `AdminAction` - Moderation audit log
- `Announcement` - System announcements

**Relationships:**
- Many-to-many: Resources ↔ Tags, Collections ↔ Resources
- One-to-many: User → Resources, Resources → Comments/Upvotes
- Foreign keys with cascade deletes for data integrity

## 🔍 Search Implementation

**Current:** Prisma `contains` with case-insensitive matching
**Features:**
- Full-text search across titles and descriptions
- Tag-based filtering
- Category filtering
- Sorting by newest/popular
- Multi-parameter queries

**Production Optimization:**
- Enable PostgreSQL `tsvector` + GIN indexing
- Implement fuzzy search algorithms
- Add search result ranking
- Cache frequent queries

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build command
npm run build

# Environment variables
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### Backend (Railway/Render/Heroku)
```bash
# Start command
tsx src/index.ts

# Environment variables
PORT=4000
DATABASE_URL=your_database_url
JWT_SECRET=your_production_secret
CLIST_USERNAME=your_clist_username
CLIST_API_KEY=your_clist_api_key

# Database setup
npx prisma generate
npx prisma db push
npm run seed
```

### Database Options
- **Development:** PostgreSQL (recommended)
- **Production:** PostgreSQL, managed database services
- **Migrations:** Automatic with Prisma

## 🔧 Development Scripts

```bash
npm run dev          # Start both frontend and backend
npm run dev:web      # Frontend only
npm run dev:api      # Backend only
npm run build        # Production build
npm run typecheck    # TypeScript validation
npm run lint         # Code linting
npm run seed         # Populate database
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using Next.js, Express.js, and Prisma**

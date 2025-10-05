# Civic Issue Management System - Deployment Guide

## Overview
A production-ready full-stack civic issue tracking platform with authentication, real-time notifications, analytics, and admin management capabilities.

## Features Implemented
- User Authentication (Login/Register)
- Issue Submission with Photo Upload Support
- Advanced Issue List with Filtering and Search
- Detailed Issue View with Comments
- Admin Dashboard with Statistics
- Analytics Dashboard with Visual Charts
- Real-time Notifications System
- Responsive Design with Animated Background

## Project Structure
```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── AdminDashboard.tsx
│   ├── Analytics.tsx
│   ├── AnimatedBackground.tsx
│   ├── IssueCard.tsx
│   ├── IssueDetail.tsx
│   ├── IssueForm.tsx
│   ├── IssueList.tsx
│   ├── Navbar.tsx
│   └── NotificationPanel.tsx
├── contexts/
│   └── AuthContext.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Color Palette
- **Primary (Royal Blue)**: #2A4D8F
- **Accent (Champagne Gold)**: #D4AF37
- **Highlight (Emerald)**: #3DDC97
- **Neutral (Light Grey)**: #F5F5F5

## Environment Setup

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Environment Variables
The application currently uses mock data. When integrating with Supabase:

Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Options

### Option 1: Netlify
1. Connect your Git repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

### Option 2: Vercel
1. Import your Git repository
2. Framework preset: Vite
3. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

### Option 3: GitHub Pages
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Update vite.config.ts for correct base path

4. Deploy:
   ```bash
   npm run deploy
   ```

## Database Integration (Future)

### Supabase Schema
When ready to integrate with Supabase, create these tables:

#### profiles
- id (uuid, references auth.users)
- full_name (text)
- role (text: 'citizen' | 'admin')
- created_at (timestamptz)

#### issues
- id (uuid, primary key)
- user_id (uuid, references profiles)
- title (text)
- description (text)
- category (text)
- location (text)
- status (text)
- priority (text)
- photo_urls (text[])
- created_at (timestamptz)
- updated_at (timestamptz)
- resolved_at (timestamptz, nullable)

#### comments
- id (uuid, primary key)
- issue_id (uuid, references issues)
- user_id (uuid, references profiles)
- content (text)
- is_official (boolean)
- created_at (timestamptz)

#### notifications
- id (uuid, primary key)
- user_id (uuid, references profiles)
- issue_id (uuid, references issues)
- type (text)
- message (text)
- read (boolean)
- created_at (timestamptz)

### Row Level Security (RLS)
Enable RLS on all tables with appropriate policies:
- Users can view all issues (public visibility)
- Users can only edit their own issues
- Admins have elevated permissions
- Users can only view their own notifications

## Demo Accounts
- **Admin**: admin@civic.com (any password)
- **Citizen**: citizen@civic.com (any password)

## Technology Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend (Future)**: Node.js + Supabase

## Features by User Role

### Citizens
- Report new issues with photos
- View all civic issues
- Filter and search issues
- Comment on issues
- Receive notifications
- View analytics

### Admins
- All citizen features
- Admin dashboard with statistics
- Update issue status
- Official comments (marked with badge)
- Manage urgent issues

## Performance Optimizations
- Code splitting with React lazy loading
- Optimized animations with CSS transforms
- Efficient state management
- Image optimization recommendations
- Responsive design for all devices

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements
- Real-time updates with WebSockets
- Map integration for location visualization
- Email notifications
- File upload to cloud storage
- Advanced reporting features
- Mobile application

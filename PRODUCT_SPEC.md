# Blog Torch - Product Specification Document

## Overview

**Product Name:** Blog Torch  
**Version:** 0.1.0  
**Last Updated:** February 18, 2026  
**Document Type:** Product Specification

### Executive Summary

Blog Torch is a premium developer-focused blogging platform that combines technical writing, code presentation, and storytelling into a unified, notebook-style experience. It bridges the gap between traditional blogging platforms and interactive developer notebooks, making it ideal for showcasing ML experiments, technical tutorials, project narratives, and developer portfolios.

---

## Product Vision & Purpose

### Vision Statement
"Where Code Meets Storytelling" - Blog Torch empowers developers to share their technical work through narrative-driven posts that seamlessly integrate code, outputs, visualizations, and prose.

### Target Audience
- Software developers and engineers
- Machine learning practitioners and researchers
- Data scientists
- Technical writers and educators
- DevOps engineers
- Open source contributors
- Anyone documenting technical projects or experiments

### Key Differentiators
1. **Block-based architecture** - Flexible content composition with multiple block types
2. **Notebook-style presentation** - Familiar to developers, combines code + outputs
3. **Developer-first UX** - Syntax highlighting, code blocks, markdown support
4. **Social features** - Built-in community engagement through likes, comments, follows
5. **Modern tech stack** - Next.js 16, React 19, TypeScript, MongoDB, Clerk authentication

---

## Core Features

### 1. User Management & Authentication

#### 1.1 Authentication System
- **Provider:** Clerk authentication
- **Sign-up/Sign-in:** Secure authentication flows with social providers
- **Webhook Integration:** Real-time user synchronization via Clerk webhooks
- **Session Management:** Persistent authentication across the platform

#### 1.2 User Profiles
Each user profile includes:
- **Basic Information:**
  - Unique username
  - Display name
  - Profile image
  - Bio/description
  - Location

- **Social Links:**
  - Personal website URL
  - GitHub profile
  - Twitter/X profile

- **User Role System:**
  - `USER` - Standard user with posting and interaction capabilities
  - `ADMIN` - Administrative privileges

- **Profile Statistics:**
  - Number of posts
  - Followers count
  - Following count
  - Total likes received

### 2. Content Creation - Block-Based Editor

#### 2.1 Editor Interface
The editor is the heart of Blog Torch, featuring:
- **Drag-and-drop reordering** - Intuitive block organization using `@dnd-kit`
- **Real-time preview** - See content as you write
- **Auto-save to drafts** - Prevent content loss
- **Responsive design** - Works seamlessly on desktop and mobile

#### 2.2 Block Types

**MARKDOWN Block**
- Rich text formatting using Markdown syntax
- Support for GitHub Flavored Markdown (GFM)
- Typography optimized for technical writing
- Inline code, links, lists, tables, blockquotes
- Rendered with `react-markdown` and `remark-gfm`

**CODE Block**
- Syntax highlighting powered by Shiki
- Multi-language support (JavaScript, Python, TypeScript, etc.)
- Line numbers
- Copy-to-clipboard functionality
- Theme-aware (adapts to light/dark mode)
- Language detection and display
- Configurable through `rehype-pretty-code`

**OUTPUT Block**
- Display code execution results
- Multiple MIME type support:
  - Plain text output
  - Image output (PNG, JPEG, SVG)
  - Base64 encoded data
- Styled output containers
- Useful for showing terminal outputs, logs, results

**IMAGE Block**
- Upload and display images
- Image URL support
- Alt text for accessibility
- Optional captions
- Lazy loading for performance
- Responsive image sizing

**EMBED Block**
- Embed external content
- YouTube video embeds
- Generic URL embeds
- Responsive iframe containers
- Security: referrer policies and sandboxing

**DIVIDER Block**
- Visual section separators
- Improve content readability
- Customizable styling

**CALLOUT Block**
- Highlighted information boxes
- Draw attention to important notes
- Support for different callout types (info, warning, tip, etc.)

#### 2.3 Editor Actions
- **Save Draft** - Save work-in-progress without publishing
- **Publish Post** - Make content publicly visible
- **Update Published Post** - Edit and republish
- **Delete Blocks** - Remove individual content blocks
- **Add Blocks** - Insert new blocks at any position
- **Reorder Blocks** - Drag and drop to rearrange content

#### 2.4 Post Metadata
- **Title** - Post headline (required)
- **Excerpt** - Brief summary for cards and previews
- **Cover Image** - Featured image URL
- **Tags** - Categorization and discovery
- **Primary Languages** - Array of programming languages featured
- **Slug** - Unique URL identifier (auto-generated or custom)
- **Source** - Track content origin (`EDITOR` or `IPYNB_IMPORT`)

### 3. Content Discovery & Browsing

#### 3.1 Home Page
- **Hero Section** - Branded introduction with CTAs
- **Latest Posts Grid** - Display 9 most recent published posts
- **Post Cards** - Include:
  - Title
  - Excerpt
  - Author information
  - Tags (first 3)
  - Like count
  - View count
  - "Read" button

#### 3.2 Explore Page
- **Search Functionality** - Search posts by title, content, tags
- **Filter Options** (planned):
  - By tags
  - By programming languages
  - By popularity (likes, views)
  - By recency
- **Grid Layout** - Responsive 3-column grid (desktop)
- **Pagination** - Load more posts dynamically

#### 3.3 Post View Page
- **Clean Reading Experience** - Typography optimized for technical content
- **Sequential Block Rendering** - Content flows naturally
- **Syntax Highlighting** - Code blocks with proper highlighting
- **Social Interactions** - Like, comment, bookmark buttons
- **Author Card** - Quick access to author profile
- **Related Posts** (planned) - Discover similar content
- **View Tracking** - Increment view count on page load
- **Share Functionality** (planned) - Social media sharing

### 4. Social Features

#### 4.1 Engagement System

**Likes**
- One-click appreciation for posts
- Like counter on posts
- Aggregated like counts
- User can like each post once
- Remove like (unlike)

**Comments**
- Threaded comment system
- Parent-child comment relationships
- Display comment threads under posts
- Edit and delete own comments
- Comment count displayed on posts
- Real-time comment updates

**Bookmarks**
- Save posts for later reading
- Personal bookmark collection
- Quick access to saved posts
- Bookmark/unbookmark toggle

#### 4.2 Follow System
- Follow other users
- View follower/following lists
- Activity feed from followed users (planned)
- Follower notifications (planned)

### 5. Tagging & Categorization

#### 5.1 Tag System
- **Tag Model** - Unique tags with name and slug
- **Post-Tag Relationship** - Many-to-many association
- **Tag Display** - Badges on post cards
- **Tag-based Discovery** - Filter posts by tags
- **Tag Creation** - Automatic or manual tag creation
- **Tag Analytics** (planned) - Popular tags, trending topics

#### 5.2 Language Tracking
- **Primary Languages** - Array field on posts
- **Language Badges** - Display featured programming languages
- **Language Filtering** - Discover posts by language

### 6. Content Analytics

Each post tracks:
- **View Count** - Total page views
- **Like Count** - Total likes received
- **Comment Count** - Total comments and replies
- **Timestamp Data:**
  - Created at
  - Updated at
  - Published at

### 7. User Interface & Design

#### 7.1 Design System
- **Component Library** - Built with Radix UI primitives
- **Styling** - Tailwind CSS (v4) with custom configuration
- **Typography** - `@tailwindcss/typography` for article styling
- **Icons** - Lucide React icon library
- **Animations** - Framer Motion for smooth transitions

#### 7.2 Theme System
- **Light/Dark Mode** - System-aware theme switching
- **Theme Toggle** - Manual theme override
- **Persistent Preference** - Theme saved to user preferences
- **Provider** - `next-themes` integration

#### 7.3 Layout Components
- **Navbar** - Persistent navigation with:
  - Logo/brand
  - Navigation links (Home, Explore, New Post)
  - User menu (Profile, Sign out)
  - Theme toggle
  
- **Responsive Design** - Mobile-first approach
- **Card Components** - Consistent post presentation
- **Form Components** - Input, textarea, buttons with validation

#### 7.4 User Experience
- **Toast Notifications** - Non-intrusive feedback using Sonner
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - Graceful error messages
- **Accessibility** - ARIA labels, keyboard navigation, semantic HTML

### 8. Data Management

#### 8.1 Database Architecture
- **Provider:** MongoDB
- **ORM:** Prisma
- **Schema Models:**
  - User
  - Post
  - Block
  - Tag
  - PostTag (junction table)
  - Like
  - Comment
  - Bookmark
  - Follow

#### 8.2 Data Operations
- **CRUD Operations** - Full create, read, update, delete for all entities
- **Relationships** - Proper foreign key constraints
- **Cascade Deletes** - Clean up related data on deletion
- **Indexing Strategy** - Optimized queries on:
  - Author + creation date
  - Published status + published date
  - Like count (for trending)
  - Post blocks by order

#### 8.3 Database Scripts
- `prisma:generate` - Generate Prisma Client
- `db:push` - Push schema changes to database
- `db:studio` - Launch Prisma Studio for data inspection

### 9. State Management

#### 9.1 Client State
- **Zustand** - Lightweight state management
- **Local State** - React hooks (useState, useReducer)
- **Form State** - Controlled components

#### 9.2 Server State
- **Next.js Server Actions** - Form submissions and mutations
- **Server Components** - Data fetching in React Server Components
- **Optimistic Updates** (planned) - Immediate UI feedback

### 10. Security & Validation

#### 10.1 Authentication Security
- **Clerk Integration** - Industry-standard auth
- **Protected Routes** - Middleware-based route protection
- **API Route Protection** - Server-side auth checks
- **Webhook Validation** - Svix signature verification

#### 10.2 Data Validation
- **Zod Schemas** - Runtime type validation
- **Input Sanitization** - XSS prevention with `rehype-sanitize`
- **SQL Injection Protection** - Prisma parameterized queries
- **CSRF Protection** - Next.js built-in protection

#### 10.3 Content Security
- **User Roles** - Role-based access control
- **Ownership Checks** - Users can only edit own content
- **Admin Controls** - Elevated permissions for admins
- **Rate Limiting** (planned) - Prevent abuse

---

## Technical Architecture

### Tech Stack

#### Frontend
- **Framework:** Next.js 16 (App Router)
- **React Version:** 19.2.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Animation:** Framer Motion
- **Form Handling:** React Hook Form (implied)
- **Markdown Rendering:** react-markdown with remark-gfm
- **Code Highlighting:** Shiki + rehype-pretty-code

#### Backend
- **Runtime:** Node.js (Next.js server)
- **API:** Next.js API Routes and Server Actions
- **Database:** MongoDB
- **ORM:** Prisma 6.16.0
- **Authentication:** Clerk

#### Developer Tools
- **Linting:** ESLint
- **Type Checking:** TypeScript strict mode
- **Package Manager:** npm/yarn/pnpm
- **Build Tool:** Next.js bundler

### Project Structure

```
blog/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── editor/            # Post editor pages
│   │   ├── explore/           # Discovery page
│   │   ├── p/[slug]/          # Post view page
│   │   ├── sign-in/           # Authentication
│   │   └── sign-up/
│   ├── components/            # React components
│   │   ├── blocks/           # Content block renderers
│   │   ├── layout/           # Layout components
│   │   ├── providers/        # Context providers
│   │   └── ui/               # UI primitives
│   ├── lib/                  # Utilities
│   └── server/               # Server-side modules
│       ├── auth.ts           # Authentication logic
│       ├── db.ts             # Database client
│       ├── posts.ts          # Post queries
│       └── users.ts          # User queries
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

### Key Technical Decisions

1. **App Router** - Leveraging Next.js 16 App Router for improved performance
2. **Server Components** - Default to server components for better initial load
3. **MongoDB** - Flexible schema for block-based content
4. **Clerk** - Outsourced auth for security and ease of use
5. **Block Architecture** - Extensible system for new content types
6. **TypeScript** - Type safety across the entire stack

---

## User Workflows

### Workflow 1: Creating and Publishing a Post

1. User clicks "Start writing" or "New post"
2. System creates a new draft post
3. User redirected to editor page
4. User adds title and excerpt
5. User adds content blocks:
   - Click "+" button to add block
   - Select block type from menu
   - Fill in block content
   - Drag blocks to reorder
6. User clicks "Save Draft" (auto-saves periodically)
7. User previews how post will look
8. User clicks "Publish" when ready
9. System validates post (requires title)
10. Post becomes publicly visible
11. User redirected to published post view

### Workflow 2: Discovering and Reading Content

1. User lands on home page
2. User browses latest posts in grid
3. User clicks "Explore" for more posts
4. User optionally uses search/filters
5. User clicks "Read" on interesting post
6. System displays post with all blocks rendered
7. View count incremented
8. User can like, comment, or bookmark
9. User can click author to view profile
10. User can click tags to find related posts

### Workflow 3: Engaging with Community

1. User reads a post they enjoy
2. User clicks "Like" button (heart icon)
3. Like count increments
4. User scrolls to comments section
5. User writes comment in text field
6. User submits comment
7. Comment appears with user's profile info
8. User can reply to other comments
9. User follows post author
10. User bookmarks post for later

### Workflow 4: Building a Profile

1. User signs up/signs in
2. User completes profile information:
   - Username
   - Display name
   - Bio
   - Profile picture
   - Social links
3. User publishes first post
4. Other users discover and follow
5. User gains followers
6. User's profile shows stats and post list
7. Profile becomes portfolio of work

---

## Future Enhancements (Roadmap)

### Phase 2: Enhanced Discovery
- Advanced search with full-text indexing
- Filter by multiple tags simultaneously
- Sort by trending, popular, recent
- Personalized recommendations
- Tag pages with tag descriptions
- Author pages with full profile

### Phase 3: Collaboration Features
- Co-authoring posts
- Post drafts with multiple contributors
- Commenting with mentions (@username)
- Comment likes and threading improvements
- Direct messaging between users

### Phase 4: Notebook Import
- Jupyter Notebook (.ipynb) import
- Automatic conversion to blocks
- Preserve code + output structure
- Support for notebook metadata
- Batch import multiple notebooks

### Phase 5: Analytics Dashboard
- Post performance metrics
- Audience demographics
- Traffic sources
- Engagement trends over time
- Export analytics data

### Phase 6: Monetization (Optional)
- Premium memberships
- Paid posts/gated content
- Newsletter subscriptions
- Donation/tip functionality
- Sponsored posts

### Phase 7: Advanced Editor
- Collaborative real-time editing
- Version history with rollback
- AI-assisted writing suggestions
- Template library
- Custom CSS per post
- Math equation support (LaTeX)
- Diagram support (Mermaid)

### Phase 8: Community Features
- Topic-based communities
- Moderation tools
- Reporting and flagging
- User reputation system
- Badges and achievements

### Phase 9: Mobile Apps
- iOS native app
- Android native app
- Offline reading
- Push notifications

---

## Success Metrics

### User Growth
- Monthly Active Users (MAU)
- Sign-up conversion rate
- User retention rate (30-day, 90-day)

### Content Creation
- Posts published per week
- Average blocks per post
- Draft-to-publish ratio
- Time spent in editor

### Engagement
- Average session duration
- Posts read per session
- Like rate (likes / views)
- Comment rate (comments / views)
- Bookmark rate

### Community Health
- Follow relationships formed
- Average followers per user
- Comment thread depth
- User-to-user interactions

---

## Compliance & Legal

### Data Privacy
- GDPR compliance for EU users
- CCPA compliance for California users
- User data export functionality
- Right to deletion (account removal)
- Privacy policy clearly displayed

### Content Policy
- Terms of Service agreement required
- Content moderation guidelines
- DMCA takedown process
- Abuse reporting mechanism

### Accessibility
- WCAG 2.1 Level AA compliance target
- Screen reader compatibility
- Keyboard navigation support
- Color contrast requirements

---

## Support & Documentation

### User Documentation
- Getting started guide
- Editor tutorial with examples
- Block type reference
- Markdown syntax guide
- FAQs

### Developer Documentation
- API documentation (if public API)
- Database schema documentation
- Component library docs
- Contribution guidelines

### Help Resources
- In-app help tooltips
- Support email
- Community forum (planned)
- Video tutorials

---

## Conclusion

Blog Torch represents a modern approach to technical blogging that respects the developer's workflow while providing powerful storytelling tools. By combining notebook-style content blocks with social features and a beautiful, accessible interface, Blog Torch aims to become the premier platform for developers to share their work, build their brand, and engage with a technical community.

The platform is built with scalability, extensibility, and user experience as core priorities, ensuring it can grow alongside its community while maintaining the quality and performance users expect.

---

## Appendix

### A. Database Schema Overview

```prisma
User (id, clerkId, username, displayName, bio, imageUrl, role, social links)
├── Posts (authored posts)
├── Comments (authored comments)
├── Likes (liked posts)
├── Bookmarks (bookmarked posts)
├── Followers (users following this user)
└── Following (users this user follows)

Post (id, slug, title, excerpt, coverImageUrl, published, featured)
├── Author (User reference)
├── Blocks (ordered content blocks)
├── Tags (associated tags)
├── Likes (users who liked)
├── Comments (post comments)
└── Bookmarks (users who bookmarked)

Block (id, type, order, data as JSON)
└── Post reference

Tag (id, name, slug)
└── Posts (via PostTag)

Comment (id, body, parentId for threading)
├── Author (User reference)
├── Post reference
└── Replies (child comments)

Like, Bookmark, Follow (junction tables with user and target references)
```

### B. Environment Variables Required

```env
# Database
DATABASE_URL=mongodb://...

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Optional
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### C. Color Palette & Branding

Primary accent colors:
- Orange: `#F97316` (from-orange-500)
- Pink: `#EC4899` (to-pink-500)

The gradient branding reflects energy, creativity, and the "torch" metaphor - illuminating code and ideas.

### D. Performance Targets

- **Time to First Byte:** < 200ms
- **Largest Contentful Paint:** < 2.5s
- **First Input Delay:** < 100ms
- **Cumulative Layout Shift:** < 0.1
- **Lighthouse Score:** > 90 (all categories)

---

**Document Status:** Living Document  
**Maintained By:** Product & Engineering Team  
**Review Cycle:** Quarterly or as major features are added

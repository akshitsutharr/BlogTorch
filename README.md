<div align="center">

# 🔥 BlogTorch 

### Where Code Meets Storytelling

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**A premium developer-focused blogging platform that combines technical writing, code presentation, and storytelling into a unified, notebook-style experience.**

[Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

[![Check This Out](https://vercel.com/button)](https://blogtorch.vercel.app/)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Block Types](#-block-types)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**BlogTorch** is a modern, full-stack blogging platform designed specifically for developers, engineers, and technical writers. It bridges the gap between traditional blogging platforms and interactive developer notebooks, enabling you to create rich, narrative-driven posts that seamlessly integrate code, outputs, visualizations, and prose.

### Why BlogTorch?

- **🧩 Block-Based Architecture** - Compose content with flexible, reorderable blocks
- **📓 Notebook-Style Presentation** - Familiar interface for developers showcasing code and results
- **🎨 Developer-First UX** - Syntax highlighting, markdown support, and code-focused design
- **🤝 Built-in Social Features** - Engage with the community through likes, comments, and follows
- **⚡ Modern Tech Stack** - Built with the latest web technologies for optimal performance

### Perfect For

- 👨‍💻 Software developers sharing tutorials and insights
- 🤖 ML practitioners documenting experiments and results
- 📊 Data scientists showcasing analyses and visualizations
- 📚 Technical educators creating learning content
- 🚀 DevOps engineers documenting workflows
- 💡 Open source contributors building their portfolio

---

## ✨ Key Features

### 🎨 **Rich Content Editor**

- **Multiple Block Types**: Markdown, Code, Output, Image, Embed, Divider, Callout
- **Drag & Drop Reordering**: Intuitive content organization with `@dnd-kit`
- **Real-time Preview**: See your content as you write
- **Auto-save to Drafts**: Never lose your work
- **Syntax Highlighting**: Powered by Shiki with multi-language support

### 👥 **Social Engagement**

- **Like System**: One-click appreciation for posts
- **Threaded Comments**: Rich discussion with parent-child relationships
- **Bookmarks**: Save posts for later reading
- **Follow System**: Build your network and stay updated
- **User Profiles**: Showcase your work and statistics

### 🔍 **Content Discovery**

- **Explore Page**: Browse and search all published posts
- **Tag-based Navigation**: Find content by topics and technologies
- **Language Filtering**: Discover posts by programming language
- **View & Like Tracking**: See what's trending
- **Author Profiles**: Connect with content creators

### 🔐 **Authentication & Security**

- **Clerk Integration**: Industry-standard authentication
- **Role-based Access**: User and Admin roles
- **Protected Routes**: Middleware-based protection
- **Input Validation**: Zod schemas for runtime type safety
- **Content Sanitization**: XSS prevention with `rehype-sanitize`

### 🎭 **Theme System**

- **Light/Dark Mode**: System-aware theme switching
- **Persistent Preferences**: Theme saved automatically
- **Smooth Transitions**: Framer Motion animations
- **Accessible Design**: WCAG 2.1 Level AA compliance target

---

## 🛠 Tech Stack

### **Frontend**

<div align="center">

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js) | 16.1.6 | React framework with App Router |
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | 19.2.3 | UI library with latest features |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 5.0+ | Type-safe development |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | 4.0 | Utility-first CSS framework |
| ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radix-ui&logoColor=white) | Latest | Accessible component primitives |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | 12.34.1 | Animation library |

</div>

### **Backend & Database**

<div align="center">

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | 20+ | Server runtime |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | Latest | NoSQL database |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | 6.16.0 | Type-safe database ORM |
| ![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white) | 6.37.5 | Authentication & user management |

</div>

### **Content Processing**

<div align="center">

| Package | Purpose |
|---------|---------|
| `react-markdown` | Markdown rendering |
| `remark-gfm` | GitHub Flavored Markdown support |
| `shiki` | Syntax highlighting |
| `rehype-pretty-code` | Enhanced code block styling |
| `rehype-sanitize` | XSS protection |

</div>

### **State & UI Management**

- **Zustand** - Lightweight state management
- **@dnd-kit** - Drag and drop functionality
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **next-themes** - Theme management
- **Zod** - Schema validation

---

## 🏗 Architecture

BlogTorch is built on a modern, scalable architecture leveraging Next.js 16's App Router for optimal performance.

### **Core Architecture Principles**

1. **Server Components First** - Default to server components for better initial load
2. **Progressive Enhancement** - Works without JavaScript, enhanced with it
3. **Type Safety** - TypeScript across the entire stack
4. **Block-Based Content** - Extensible system for new content types
5. **Optimistic Updates** - Immediate UI feedback for better UX

### **Database Design**

The MongoDB database uses Prisma ORM with the following core models:

```
User → Posts → Blocks
  ↓      ↓       ↓
Follows Tags  (Ordered content)
  ↓      ↓
Likes  PostTag
  ↓
Comments
  ↓
Bookmarks
```

### **Key Technical Decisions**

- ✅ **Next.js App Router** - Improved performance and developer experience
- ✅ **MongoDB + Prisma** - Flexible schema for block-based content
- ✅ **Clerk Authentication** - Outsourced auth for security and ease
- ✅ **Server Actions** - Type-safe server mutations
- ✅ **Edge Runtime** - Fast, globally distributed responses

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 20.x or higher
- **npm** / **yarn** / **pnpm**
- **MongoDB** database (local or cloud)
- **Clerk** account for authentication

### **Installation**

1. **Clone the repository**

```bash
git clone https://github.com/akshitsutharr/BlogTorch.git
cd BlogTorch
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/blogtorch"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Optional
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Generate Prisma Client**

```bash
npm run prisma:generate
```

5. **Push database schema**

```bash
npm run db:push
```

6. **Run the development server**

```bash
npm run dev
```

7. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
BlogTorch/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── api/              # API routes
│   │   │   └── webhooks/     # Clerk webhooks
│   │   ├── editor/           # Post editor pages
│   │   │   └── [id]/
│   │   ├── explore/          # Discovery page
│   │   ├── p/                # Post view pages
│   │   │   └── [slug]/
│   │   ├── profile/          # User profiles
│   │   │   └── [username]/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── blocks/          # Content block renderers
│   │   │   ├── markdown-block.tsx
│   │   │   ├── code-block.tsx
│   │   │   ├── output-block.tsx
│   │   │   ├── image-block.tsx
│   │   │   └── embed-block.tsx
│   │   ├── editor/          # Editor components
│   │   │   ├── block-editor.tsx
│   │   │   └── add-block-menu.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── navbar.tsx
│   │   │   └── footer.tsx
│   │   ├── providers/       # Context providers
│   │   │   ├── theme-provider.tsx
│   │   │   └── clerk-provider.tsx
│   │   └── ui/              # UI primitives (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   ├── lib/                 # Utility functions
│   │   ├── utils.ts         # Helper functions
│   │   └── constants.ts     # App constants
│   ├── server/              # Server-side modules
│   │   ├── auth.ts          # Authentication helpers
│   │   ├── db.ts            # Prisma client
│   │   ├── posts.ts         # Post queries
│   │   └── users.ts         # User queries
│   └── middleware.ts        # Next.js middleware
├── .env                     # Environment variables
├── .gitignore
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── package.json
├── postcss.config.mjs       # PostCSS configuration
├── README.md
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🧩 Block Types

BlogTorch supports multiple content block types for rich, flexible storytelling:

### **1. MARKDOWN Block**

Rich text formatting with GitHub Flavored Markdown support.

```typescript
{
  type: "MARKDOWN",
  data: {
    content: "# Hello World\n\nThis is **markdown** content."
  }
}
```

**Features:**
- Inline code, links, lists, tables, blockquotes
- GitHub Flavored Markdown extensions
- Typography optimized for technical writing

### **2. CODE Block**

Syntax-highlighted code with multi-language support.

```typescript
{
  type: "CODE",
  data: {
    language: "typescript",
    code: "const greeting = 'Hello, World!';"
  }
}
```

**Features:**
- 50+ programming languages
- Line numbers
- Copy-to-clipboard
- Theme-aware highlighting
- Language badges

### **3. OUTPUT Block**

Display code execution results and terminal outputs.

```typescript
{
  type: "OUTPUT",
  data: {
    mimeType: "text/plain",
    content: "Hello, World!"
  }
}
```

**Supported MIME Types:**
- `text/plain` - Plain text output
- `image/png`, `image/jpeg`, `image/svg+xml` - Image outputs
- Base64 encoded data

### **4. IMAGE Block**

Embed images with captions and alt text.

```typescript
{
  type: "IMAGE",
  data: {
    url: "https://example.com/image.png",
    alt: "Description",
    caption: "Optional caption"
  }
}
```

### **5. EMBED Block**

Embed external content like YouTube videos.

```typescript
{
  type: "EMBED",
  data: {
    url: "https://youtube.com/watch?v=..."
  }
}
```

### **6. DIVIDER Block**

Visual section separators for better content organization.

### **7. CALLOUT Block**

Highlighted information boxes for important notes.

```typescript
{
  type: "CALLOUT",
  data: {
    type: "info", // info, warning, tip, danger
    content: "Important information here"
  }
}
```

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/blogtorch?retryWrites=true&w=majority"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_XXXXXXXXXXXXXXXX"
CLERK_SECRET_KEY="sk_test_XXXXXXXXXXXXXXXX"
CLERK_WEBHOOK_SECRET="whsec_XXXXXXXXXXXXXXXX"

# App Configuration (Optional)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### **Getting Clerk Credentials**

1. Sign up at [Clerk.com](https://clerk.com)
2. Create a new application
3. Copy the API keys from the dashboard
4. Set up a webhook endpoint for user synchronization

---

## 🗄 Database Schema

### **Core Models**

#### **User**
```prisma
model User {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  clerkId     String   @unique
  username    String?  @unique
  displayName String?
  bio         String?
  imageUrl    String?
  role        UserRole @default(USER)
  
  // Social links
  websiteUrl  String?
  githubUrl   String?
  twitterUrl  String?
  
  // Relations
  posts       Post[]
  comments    Comment[]
  likes       Like[]
  bookmarks   Bookmark[]
  followers   Follow[] @relation("followers")
  following   Follow[] @relation("following")
}
```

#### **Post**
```prisma
model Post {
  id            String     @id @default(auto()) @map("_id") @db.ObjectId
  slug          String     @unique
  title         String
  excerpt       String?
  coverImageUrl String?
  published     Boolean    @default(false)
  source        PostSource @default(EDITOR)
  
  // Relations
  authorId      String     @db.ObjectId
  author        User       @relation(fields: [authorId], references: [id])
  blocks        Block[]
  tags          PostTag[]
  
  // Engagement
  likes         Like[]
  comments      Comment[]
  bookmarks     Bookmark[]
  likeCount     Int        @default(0)
  viewCount     Int        @default(0)
  commentCount  Int        @default(0)
}
```

#### **Block**
```prisma
model Block {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  postId    String    @db.ObjectId
  type      BlockType
  order     Int
  data      Json      // Flexible JSON data for each block type
  
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  @@index([postId, order])
}
```

---

## 💻 Development

### **Available Scripts**

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run prisma:generate  # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
```

### **Code Style**

- **ESLint** - Code linting with Next.js config
- **TypeScript** - Strict mode enabled
- **Prettier** - Code formatting (recommended)

### **Conventions**

- Use **Server Components** by default
- Mark client components with `'use client'`
- Co-locate components with their usage
- Use **TypeScript interfaces** for props
- Follow the **feature-based** folder structure

---


### **Environment Setup**

Make sure to configure all environment variables in your deployment platform:

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

---

## 🗺 Roadmap

### **Phase 1: Core Platform** ✅

- [x] User authentication with Clerk
- [x] Block-based editor with drag & drop
- [x] Post publishing and viewing
- [x] Social features (likes, comments, follows)
- [x] Tag system
- [x] Theme switching

### **Phase 2: Enhanced Discovery** 🚧

- [ ] Advanced search with full-text indexing
- [ ] Multi-tag filtering
- [ ] Trending posts algorithm
- [ ] Personalized recommendations
- [ ] Author pages with full stats

### **Phase 3: Collaboration** 📋

- [ ] Co-authoring posts
- [ ] Comment mentions (@username)
- [ ] Direct messaging
- [ ] Post sharing to social media

### **Phase 4: Notebook Import** 📋

- [ ] Jupyter Notebook (.ipynb) import
- [ ] Automatic conversion to blocks
- [ ] Preserve code + output structure

### **Phase 5: Analytics** 📋

- [ ] Post performance metrics
- [ ] Audience demographics
- [ ] Traffic sources dashboard
- [ ] Export analytics data

### **Phase 6: Advanced Editor** 📋

- [ ] Real-time collaborative editing
- [ ] Version history with rollback
- [ ] AI-assisted writing
- [ ] Math equation support (LaTeX)
- [ ] Diagram support (Mermaid)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### **How to Contribute**

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Keep PRs focused and small

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Akshit Suthar**

- GitHub: [@akshitsutharr](https://github.com/akshitsutharr)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication made easy
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Vercel](https://vercel.com/) - Deployment platform

---

## 📞 Support

If you have any questions or need help, feel free to:

- Open an issue on GitHub
- Star ⭐ this repository if you find it helpful!

---

<div align="center">

**Built with ❤️ by developers, for developers**

</div>

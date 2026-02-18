# Blog Torch

**Where Code Meets Storytelling.**

Blog Torch is a premium, design-first blogging platform built for developers, data scientists, and engineers. It offers a rich, notebook-style editor that bridges the gap between technical documentation and storytelling, wrapped in a modern, highly-polished interface.

**Author:** Akshit Suthar

---

## 🚀 Features

### ✍️ Rich Block-Based Editor
- **Notebook-Style Interface**: Drag-and-drop blocks to organize your thoughts.
- **Markdown Support**: Full support for GFM (GitHub Flavored Markdown).
- **Code Blocks**: Syntax highlighting for Python, JavaScript, TypeScript, C++, Java, SQL, and more.
- **Jupyter Notebook Support**: Import `.ipynb` files directly; cells are automatically converted to Markdown and Code blocks.
- **Interactive Elements**: Callouts, Dividers, Images, and Embeds.
- **Auto-Save**: Drafts are automatically saved locally to prevent data loss.

### 🎨 Premium Design System
- **Modern UI**: Heavily rounded corners, glassmorphism effects, and smooth transitions.
- **Theming**: Fully supported **Light**, **Dark**, and custom **Light Grey** themes.
- **Animations**: Subtle micro-interactions powered by `tailwindcss-animate`.

### 📊 Analytics & Dashboard
- **View Counting**: Accurate post view tracking.
- **Visual Analytics**: Interactive bar charts powered by `recharts` to visualize engagement.
- **Content Management**: Easy-to-use dashboard to manage drafts and published posts.

### 🛡️ Secure & Scalable
- **Authentication**: Secure user management via [Clerk](https://clerk.com/).
- **Database**: Robust data persistence using PostgreSQL/MongoDB (via Prisma ORM).
- **SEO Optimized**: Built on Next.js App Router with proper metadata and semantic HTML.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `tailwindcss-animate`
- **Database**: [Prisma ORM](https://www.prisma.io/) (with MongoDB)
- **Authentication**: [Clerk](https://clerk.com/)
- **Markdown**: `react-markdown`, `remark-gfm`, `rehype-sanitize`
- **Charts**: `recharts`
- **Icons**: `lucide-react`
- **Utilities**: `nanoid`, `clsx`, `tailwind-merge`

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm
- MongoDB Database (URL)
- Clerk API Keys

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/blog-torch.git
    cd blog-torch
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL="your_mongodb_connection_string"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Push Database Schema:**
    ```bash
    npx prisma db push
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── dashboard/      # Analytics and post management
│   ├── editor/         # Block-based editor
│   ├── explore/        # Public post discovery
│   └── p/[slug]/       # Public post view
├── components/         # Reusable UI components
│   ├── blocks/         # Editor blocks (Markdown, Code, etc.)
│   ├── layout/         # Navbar, ThemeToggle
│   └── ui/             # Primitives (Button, Input, Card)
├── lib/                # Utilities and helpers
├── server/             # Server actions and database access
└── styles/             # Global styles
```

---

## 📄 License

This project is proprietary and created by **Akshit Suthar**. All rights reserved.

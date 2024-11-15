# AI Kids Education App - Technical Documentation

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Development Setup](#development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Code Quality & Standards](#code-quality--standards)
6. [UI Framework](#ui-framework)
7. [Database Setup](#database-setup)

## 1️⃣ Project Overview

A Next.js based educational application for children using AI technologies. The application is structured as a monolithic application with modular architecture for scalability.

## 2️⃣ Folder Structure

### Root Level Directory

```
project-root/
├── app/               # Next.js 13+ App Router
├── core/              # Core functionality
├── modules/           # Feature modules
├── packages/          # Shared packages
└── config files      # (.env, .eslintrc, etc.)
```

### Detailed Breakdown

#### `/app` Directory

```
app/
├── api/              # Internal API routes
│   └── speech/       # Speech-related endpoints
├── layout.tsx        # Root layout
└── page.tsx          # Entry point
```

**Purpose:**

- Next.js 13+ file-based routing
- API endpoints management
- Core application layout
- Clean UI/business logic separation

#### `/core` Directory

```
core/
├── ui/              # Foundational UI components
├── utils/           # Core utilities
└── hooks/           # Reusable hooks
```

**Design Principles:**

- Application-agnostic logic
- Zero external dependencies
- High reusability
- Comprehensive testing

#### `/packages` Directory

```
packages/
├── asset/           # Shared assets
├── client/          # API clients
├── component/       # Shared components
├── constant/        # Global constants
├── helper/          # Utility functions
├── provider/        # Context providers
├── service/         # Service layer
├── store/           # State management
└── type/           # TypeScript types
```

#### `/modules` Directory

```
modules/
└── speech/          # Speech feature module
    ├── asset/       # Module assets
    ├── component/   # Module components
    ├── store/       # Module state
    ├── type/       # Module types
    └── view/        # Module views
```

## 3️⃣ Development Setup

### Prerequisites

- Node.js 18.0.0+
- Yarn
- MongoDB
- OpenAI API key
- ElevenLabs API key

### Installation Steps

1. **Clone Repository**

```bash
git clone [repository-url]
```

2. **Install Dependencies**

```bash
yarn install
```

3. **Setup Environment**

```bash
cp .env.example .env.local
```

4. **Database Setup**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Start Prisma Studio
npx prisma studio
```

5. **Start Development**

```bash
yarn dev
```

## 4️⃣ Environment Configuration

### Environment Files

```
Development:
├── .env              # Base config
├── .env.local        # Local overrides
└── .env.dev         # Development config

Production:
├── .env              # Base config
└── .env.prod        # Production config
```

### Required Variables

```env
# Deployment
NEXT_PUBLIC_DEPLOY_ENV=
NEXT_PUBLIC_DEPLOY_URL=

# Database
MONGO_DB_URL=

# API Keys
OPENAI_API_KEY=
ELEVEN_LABS_API_KEY=
```

## 5️⃣ Code Quality & Standards

### ESLint Configuration

```javascript
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ]
}
```

### Commit Lint

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

### Prettier Configuration

```javascript
{
  "semi": false,
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 90
}
```

## 6️⃣ UI Framework - Radix UI

### Key Features

1. **Accessibility**

   - WAI-ARIA compliance
   - Keyboard navigation
   - Screen reader support

2. **Customization**

   - Unstyled components
   - Flexible theming
   - Custom styling API

3. **Performance**
   - Minimal bundle size
   - Tree-shaking support
   - Efficient rendering

### Implementation

```typescript
import * as RadixUI from '@radix-ui/themes'

// Theme Setup
const theme = {
  colors: {
    primary: {...},
    secondary: {...}
  },
  space: {...},
  radii: {...}
}

// Usage
<RadixUI.ThemeProvider theme={theme}>
  <RadixUI.Button>Click Me</RadixUI.Button>
</RadixUI.ThemeProvider>
```

## 7️⃣ Database Setup

### Prisma Configuration

1. **Initial Setup**

```bash
npx prisma generate
npx prisma migrate dev
```

2. **Database Management**

```bash
# Access database GUI
npx prisma studio

# Update schema
npx prisma migrate dev --name what_changed
```

### Development Commands

```bash
# Code quality
yarn lint             # Run ESLint
yarn format          # Run Prettier
yarn typescript-check # Type checking

# Database
npx prisma studio    # Database GUI
npx prisma generate  # Update client

# Development
yarn dev             # Start server
yarn build           # Production build
```

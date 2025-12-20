# I AM MAIL

## Overview

I AM MAIL is a "Superhuman-class" AI Email Client designed to integrate with a Sales CRM. The application provides a premium, minimalist email experience with AI-powered features including semantic search, email summarization, task extraction, and intelligent triage. Key differentiators include embedded live calendar grids, dynamic quote cards, internal team comments ("The Whisper"), and an AI-powered gatekeeper for spam filtering ("The Shield").

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with a strict slate color theme (minimalist, dense, high-end aesthetic)
- **Design System**: Inter font family, maximum border radius of 12px, slate-based color palette

### Layout Structure
The UI follows a 3-pane architecture:
1. **Left Sidebar (260px fixed)**: Navigation with folders (Inbox, Sent, Drafts, The Shield) and Video Room status toggle
2. **Middle Pane (380px)**: Scrollable email list with AI triage tabs (Focus/Other) and status indicators
3. **Right Pane (flexible)**: Email reading view with AI Analyst bar, Whisper panel for internal comments

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful endpoints under `/api/` prefix
- **Development Server**: Vite dev server with HMR proxied through Express
- **Production Build**: esbuild bundles server code, Vite builds client assets

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Tables**: Users, Emails, Comments (for internal Whisper feature)
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Fallback**: MemStorage class provides in-memory storage with mock data for development

### Key Features Architecture
- **Command Bar**: Floating bottom-center component for AI semantic search and compose action
- **Composer**: Modal-based email composition with AI drafting, calendar embedding, and quote insertion
- **Whisper Panel**: Side drawer overlay for internal team comments on email threads
- **AI Analyst Bar**: Collapsible toolbar with Summarize and Extract Tasks actions

### Build Configuration
- **Path Aliases**: `@/*` maps to `client/src/*`, `@shared/*` maps to `shared/*`
- **PWA Support**: Manifest configured for standalone display with white theme
- **Scripts**: `dev` for development, `build` for production, `db:push` for database migrations

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage with PostgreSQL

### UI Framework
- **Radix UI**: Complete primitive component set (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-built component library using Radix primitives
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration

### State & Data Fetching
- **TanStack React Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database queries and migrations
- **Zod**: Runtime validation for API requests

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **TypeScript**: Full type coverage across client, server, and shared code

### Additional Libraries
- **date-fns**: Date formatting and manipulation
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel functionality
- **react-day-picker**: Calendar component
- **vaul**: Drawer component
# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

WorkerHelper is a React-based health management system designed for construction and industrial workers. It provides personal health records, risk assessments, health center location services, and health trend analytics with Supabase backend integration.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server (runs on port 4028)
npm start

# Build for production (outputs to ./build)
npm run build

# Preview production build
npm run serve
```

### Working with Vite Dev Server
- Server runs on port 4028 by default
- Accessible at http://localhost:4028
- Supports hot module replacement (HMR)
- Configure in `vite.config.mjs`

## Architecture Overview

### Technology Stack
- **Build Tool**: Vite 5.0.0 with React plugin
- **Framework**: React 18.2 with React Router v6
- **Styling**: TailwindCSS with custom component library
- **State Management**: Redux Toolkit (configured but not actively used)
- **Backend**: Supabase for data persistence
- **UI Components**: Custom components with Radix UI primitives
- **Forms**: React Hook Form for form management
- **Animations**: Framer Motion
- **QR Code**: qrcode.react for generating worker health IDs

### Project Structure
```
src/
├── components/        # Shared UI components
│   └── ui/           # Base UI components (buttons, cards, etc.)
├── pages/            # Route-based page components
│   ├── about-us/
│   ├── health-centers-locator/
│   ├── health-trends/
│   ├── homepage/
│   ├── personal-health-record/  # Main form with Supabase integration
│   └── predictive-risk-assessment/
├── styles/           # Global styles and Tailwind configuration
├── utils/
│   └── supabase.js  # Supabase client and helper functions
├── App.jsx          # Root application component
├── Routes.jsx       # Route definitions
└── index.jsx        # Application entry point
```

### Routing Architecture
- Uses React Router v6 with BrowserRouter
- Routes defined in `src/Routes.jsx`
- Current routes:
  - `/` - About Us page (default)
  - `/homepage` - Main landing page
  - `/personal-health-record` - Worker health registration
  - `/health-centers-locator` - Find nearby health centers
  - `/health-trends` - Health analytics dashboard
  - `/predictive-risk-assessment` - Risk assessment tools
  - `/about-us` - About the platform

### Supabase Integration

The application uses Supabase for backend services:

#### Environment Configuration
Required environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Database Schema
Main table: `workers`
- Stores worker health records
- Includes personal info, health data, and QR codes
- See `SUPABASE_SETUP.md` for complete schema

#### Key Functions in `src/utils/supabase.js`:
- `supabase` - Configured Supabase client instance
- `generateWorkerHealthId()` - Creates unique worker IDs
- `generateQRCodeDataURL()` - Prepares data for QR code generation

### Component Architecture

#### Page Components
Each page follows a modular structure:
```
pages/[page-name]/
├── index.jsx           # Main page component
└── components/         # Page-specific components
```

#### UI Components
Located in `src/components/ui/`:
- Built with class-variance-authority (CVA) for variant management
- Uses Tailwind classes with custom design tokens
- Composable with Radix UI primitives

### Styling System

#### TailwindCSS Configuration
- Custom color palette using CSS variables
- Design tokens for consistency:
  - Colors: primary, secondary, accent, destructive, muted
  - Shadows: card, interactive, modal
  - Spacing and typography scales
- Plugins: @tailwindcss/forms for form styling

#### CSS Variables
Defined in `src/styles/` for theme customization:
- `--color-primary`, `--color-secondary`, etc.
- Enables easy theme switching

### Build Configuration

#### Vite Configuration (`vite.config.mjs`)
- Output directory: `./build`
- Chunk size limit: 2000KB
- Plugins:
  - React plugin for JSX transformation
  - vite-tsconfig-paths for path aliases
  - @dhiwise/component-tagger for component analysis
- Dev server on port 4028 with network access

### Adding New Features

#### Creating a New Page
1. Create directory in `src/pages/[page-name]/`
2. Add `index.jsx` with page component
3. Create `components/` subdirectory for page-specific components
4. Add route in `src/Routes.jsx`

#### Adding Database Tables
1. Define schema in Supabase dashboard
2. Update `SUPABASE_SETUP.md` with new schema
3. Add helper functions in `src/utils/supabase.js`
4. Create form components using React Hook Form

#### Integrating New UI Components
1. Add base component in `src/components/ui/`
2. Use CVA for variant management
3. Apply Tailwind classes with design tokens
4. Export from component directory index

### Development Best Practices

#### Code Organization
- Keep page-specific logic within page directories
- Share reusable components via `src/components/`
- Use absolute imports with path aliases
- Maintain consistent file naming (PascalCase for components)

#### State Management
- Redux Toolkit is available but prefer local state when possible
- Use React Hook Form for complex forms
- Supabase real-time subscriptions for live data

#### Error Handling
- ErrorBoundary wrapper in Routes.jsx
- Form validation with React Hook Form
- Supabase error handling in try-catch blocks

### Critical Dependencies
These packages are marked as critical in package.json:
- React & React DOM
- Redux Toolkit & Redux
- React Router DOM
- Vite & build tools
- TailwindCSS & PostCSS

**Warning**: Do not remove or modify these without careful consideration.

### Deployment Notes
- Production build outputs to `./build` directory
- Source maps included in production build
- Environment variables must be set for Supabase
- Configure hosting to serve SPA (client-side routing)
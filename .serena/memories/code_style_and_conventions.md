# Code Style and Conventions

## TypeScript Configuration
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx
- **Strict Mode**: Enabled
- **Unused Variables**: Not allowed (noUnusedLocals, noUnusedParameters)
- **Type Checking**: Strict with skipLibCheck enabled

## ESLint Configuration
- Uses typescript-eslint recommended config
- React Hooks plugin with recommended-latest rules
- React Refresh plugin for Vite integration
- Targets browser globals
- ECMAVersion 2020

## File Structure Conventions
- Source code in `src/` directory
- Assets in `src/assets/`
- Public files in `public/`
- TypeScript config split into app and node configs
- ES modules with .tsx/.ts extensions

## Import/Export Style
- ES6 modules
- Default exports for React components
- Named imports for utilities and hooks

## Component Conventions
- Functional components with React hooks
- PascalCase for component names
- camelCase for variables and functions
- Type annotations for all props and complex objects
# Project Structure

```
vietnamese-staff-email-creator/
├── .serena/                    # Serena configuration
├── .claude/                    # Claude Code configuration
├── public/
│   └── vite.svg               # Public assets
├── src/
│   ├── assets/
│   │   └── react.svg          # React logo
│   ├── App.tsx                # Main App component (template)
│   ├── App.css                # App styles
│   ├── main.tsx               # Entry point
│   ├── index.css              # Global styles
│   └── vite-env.d.ts          # Vite environment types
├── eslint.config.js           # ESLint configuration
├── tsconfig.json              # TypeScript root config
├── tsconfig.app.json          # TypeScript app config
├── tsconfig.node.json         # TypeScript node config
├── vite.config.ts             # Vite configuration
├── package.json               # Package dependencies and scripts
├── package-lock.json          # Lock file
├── index.html                 # HTML template
├── README.md                  # Project documentation
└── .gitignore                 # Git ignore rules
```

## Key Files
- **package.json**: Defines dependencies and npm scripts
- **vite.config.ts**: Vite build configuration with React SWC plugin
- **tsconfig.app.json**: TypeScript configuration for application code
- **eslint.config.js**: Linting rules and configurations
- **src/main.tsx**: Application entry point
- **src/App.tsx**: Main React component (currently template code)
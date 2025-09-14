# Task Completion Checklist

When completing development tasks, run these commands in order:

## 1. Code Quality Checks
```bash
npm run lint
```
- Fix any ESLint errors and warnings
- Ensure code follows project conventions

## 2. Type Checking
```bash
npm run build
```
- This runs `tsc -b && vite build`
- Ensures TypeScript compilation succeeds
- Verifies production build works

## 3. Testing (when tests are added)
Currently no test framework is configured. Consider adding:
- Jest + React Testing Library, or
- Vitest (Vite's test runner)

## 4. Development Server Check
```bash
npm run dev
```
- Verify the application starts correctly
- Test functionality in browser
- Check for runtime errors

## 5. Preview Production Build
```bash
npm run preview
```
- Test production build locally
- Verify all features work in production mode

## Git Workflow
```bash
git add .
git commit -m "descriptive commit message"
git push
```

## Notes
- Always fix linting errors before committing
- Ensure TypeScript compilation passes
- Test both development and production builds
- Follow conventional commit message format
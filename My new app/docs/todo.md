# Refactor React Admin Dashboard - Remove Mocha and Integrate Spring Boot Backend

## Completed Tasks

- [x] Analyze codebase and identify Mocha dependencies
- [x] Create refactoring plan
- [x] Remove Mocha dependencies from package.json (@getmocha/vite-plugins, @getmocha/users-service)
- [x] Update vite.config.ts to remove Mocha plugins
- [x] Update knip.json to remove Mocha ignoreDependencies
- [x] Create src/shared/api.ts for centralized backend API calls
- [x] Refactor AdminDashboard.tsx:
  - [x] Replace mock data with state management (issues, loading, error)
  - [x] Add useEffect to fetch issues from GET /api/issues
  - [x] Implement status update with PUT /api/issues/{id} and confirmation
  - [x] Add filters (status, priority, category)
  - [x] Add search functionality (issueId, category, description)
  - [x] Update summary cards to use real data
  - [x] Preserve all UI features and behaviors
- [x] Run npm install to update dependencies
- [x] Test app with npm run dev
- [x] Verify backend integration with Spring Boot at localhost:8080
- [x] Test all features: fetching, updating, filtering, searching

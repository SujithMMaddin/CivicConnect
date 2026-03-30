# Civic Reporting System - Project Context and Current State

## 📋 Project Overview

**Project Name**: CivicConnect (Crowdsourced Civic Issue Reporting & Resolution System)

**Description**: A full-stack application for citizens to report local civic issues (e.g., water leaks, garbage, roads) via mobile/web apps. Admins manage issues via dashboard. Features duplicate detection (location-based), priority assignment, status updates.

**Platforms**:

- **Mobile**: React Native Expo app (CivicConnectApp) - report issues with GPS, camera, maps.
- **Web Dashboard**: React Vite app (CivicReport) - view/manage issues, stats, profile.
- **Backend**: Spring Boot Java REST API (civic-backend) - PostgreSQL, issue CRUD.
- **Admin Web**: Static HTML/JS (admin-web).
- **Experimental**: 'My new app' (Vite React admin dashboard prototype).

**Development Stage**: Active development. Mobile/web fronts advanced with many screens/components implemented, backend API core ready, integrations/TODOs ongoing.

**Base URL (Dev)**: Backend `http://localhost:8080/api/issues`

## 🏗️ Architecture

```
[Citizens] Mobile (RN Expo) ─┐
                           ├─ REST APIs ─ [Spring Boot Backend] ─ PostgreSQL
[Admins] Web (React+Vite) ─┘     (duplicate detect, priority rules)
                     ↓
                Static Admin Web + Prototypes
```

- **Key Features**:
  - Issue report: category, desc, GPS lat/lng, photo.
  - Duplicate: <100m same category → escalate priority.
  - Priority: 'Water'→High, else Medium.
  - Status: Pending → In Progress → Resolved.
- **API Contract**: See civic-backend/API_Contract.md for endpoints (POST/GET/PUT /api/issues).

## 🛠️ Tech Stacks

### Backend (civic-backend)

- Spring Boot 3.2.0 (Java 21)
- Spring Web, Data JPA
- PostgreSQL driver
- Maven build
- Run: `cd civic-backend && mvn spring-boot:run`

### Mobile (CivicConnectApp)

- React Native 0.81 + Expo SDK 54
- React Navigation, Maps, Camera, Location, Image Picker
- TypeScript
- Run: `cd CivicConnectApp && npx expo start`

### Web (CivicReport)

- React 19 + Vite
- Tailwind CSS, shadcn/ui (Radix primitives), Lucide icons
- Hono/Cloudflare Workers (wrangler.toml)
- Run: `cd CivicReport && npm run dev`

### Others

- admin-web: Vanilla HTML/CSS/JS
- My new app: Vite React + Tailwind

## 📁 Complete File Inventory (Excluding Ignorables: Builds, Locks, Binaries, Caches)

### Root Directory (d:/SUJITH/UNIVERSITY_PROJECT/)

- .gitignore
- PROJECT_CONTEXT.md
- TODO.md

### admin-web/

- index.html
- script.js
- style.css
- TODO.md

### civic-backend/

- .gitattributes
- .gitignore
- API_Contract.md
- mvnw
- mvnw.cmd
- pom.xml
- PROJECT_STRUCTURE.md
- TODO.md
- src/main/java/com/civic/backend/ (all .java files: controllers like IssueController.java, services like IssueService.java, models like Issue.java, main app class)
- src/main/resources/application.properties
- src/test/java/com/civic/backend/ (test classes)

### CivicConnectApp/

- .gitignore
- app.json
- App.tsx
- index.ts
- package.json
- tsconfig.json
- android/app/src/main/AndroidManifest.xml (key config)
- android/gradle/wrapper/gradle-wrapper.properties
- assets/adaptive-icon.png, assets/favicon.png, assets/icon.png, assets/logo.png (icons only)
- src/api/config.ts
- src/api/issues.ts
- src/api/supabase.ts
- src/components/IssueCard.tsx
- src/components/StatCard.tsx
- src/navigation/AppNavigator.tsx
- src/screens/AboutScreen.tsx
- src/screens/AdminDashboardScreen.tsx
- src/screens/CivicDataInsightsScreen.tsx
- src/screens/ContactSupportScreen.tsx
- src/screens/HomeScreen.tsx
- src/screens/IssueDetailScreen.tsx
- src/screens/IssuesScreen.tsx
- src/screens/LandingPage.tsx
- src/screens/LoginPage.tsx
- src/screens/MyReportsScreen.tsx
- src/screens/PersonalInfoScreen.tsx
- src/screens/ProfileScreen.tsx
- src/screens/ReportIssueScreen.tsx
- src/screens/SignupPage.tsx
- src/screens/SplashScreen.tsx
- src/styles/colors.ts
- src/styles/theme.ts
- src/types.ts
- src/utils/stats.ts
- TODO.md

### CivicReport/

- .gitignore
- eslint.config.js
- index.html
- knip.json
- package.json
- postcss.config.js
- README.md
- tailwind.config.js
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- tsconfig.worker.json
- vite.config.ts
- wrangler.json
- docs/todo.md
- public/robots.txt
- src/react-app/App.tsx
- src/react-app/index.css
- src/react-app/main.tsx
- src/react-app/vite-env.d.ts
- src/react-app/components/IssueCard.tsx
- src/react-app/components/StatCard.tsx
- src/react-app/components/layout/MobileLayout.tsx
- src/react-app/components/ui/ (all primitives: accordion.tsx, alert-dialog.tsx, avatar.tsx, badge.tsx, button.tsx, card.tsx, checkbox.tsx, collapsible.tsx, dialog.tsx, dropdown-menu.tsx, field.tsx, input-group.tsx, input.tsx, label.tsx, popover.tsx, progress.tsx, radio-group.tsx, scroll-area.tsx, select.tsx)
- src/react-app/data/issues.ts
- src/react-app/lib/utils.ts
- src/react-app/pages/Home.tsx
- src/react-app/pages/IssueDetail.tsx
- src/react-app/pages/Issues.tsx
- src/react-app/pages/Profile.tsx
- src/react-app/pages/Report.tsx
- src/shared/types.ts
- src/worker/index.ts

### My new app/

- .gitignore
- eslint.config.js
- index.html
- knip.json
- package.json
- postcss.config.js
- README.md
- tailwind.config.js
- TODO.md
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- tsconfig.worker.json
- vite.config.ts
- wrangler.json
- docs/todo.md
- src/react-app/App.tsx
- src/react-app/index.css
- src/react-app/main.tsx
- src/react-app/vite-env.d.ts
- src/react-app/pages/AdminDashboard.tsx
- src/react-app/pages/Home.tsx
- src/shared/api.ts
- src/shared/types.ts
- src/worker/index.ts

## 🎯 Current State & Till-Date Updates

### VSCode Focus (Active Development Areas)

Heavy emphasis on CivicConnectApp screens (AdminDashboardScreen, HomeScreen, IssuesScreen, ProfileScreen, ReportIssueScreen, CivicDataInsightsScreen, MyReportsScreen), backend Issue\* (Controller/Service/Model), CivicReport pages (Issues, Home, Report, Profile).

### TODO Progress

- **civic-backend/TODO.md**: Issue creation null-safety ✅; rebuild/test pending ⏳
- **admin-web/TODO.md**: Pinterest UI redesign complete ✅
- **My new app/TODO.md**: Cleanup/rename complete ✅; issue.id fixes in AdminDashboard ✅
- **Root TODO.md**: Frontend ID fixes (issue.issueId → issue.id) in progress ⏳
- **CivicReport/docs/todo.md**: Maps/animations pending ⏳
- **CivicConnectApp/TODO.md**: Various screens/components updated.

### Recent/Updated Code Highlights (Till Date)

- Backend: Null-safety in IssueService.createIssue(), core Issue model/controller.
- admin-web: Full responsive Pinterest-inspired redesign (CSS, JS).
- My new app: Renamed to civic-admin-dashboard prototype, AdminDashboard.tsx with stats/API integration, Home.tsx.
- CivicConnectApp: Comprehensive screens (Splash→Landing→Auth→Home/Issues/Report/Profile/Insights/Admin), navigation, API layers (Supabase config, issues.ts), components (IssueCard, StatCard), theme/styles.
- CivicReport: Full UI primitives (shadcn), pages (Home/Issues/Detail/Profile/Report), responsive MobileLayout, data mocks, utils.

**Integration Status**: Frontends ready for backend API calls; testing duplicate/priority logic next.

## 🚀 Quick Start Commands

1. **Backend**: `cd civic-backend && mvn clean spring-boot:run`
2. **Mobile**: `cd CivicConnectApp && npx expo start`
3. **CivicReport Web**: `cd CivicReport && npm install && npm run dev`
4. **My new app**: `cd \"My new app\" && npm install && npm run dev`
5. **Admin**: Open `admin-web/index.html`

## 🔗 Key Reference Files

- API: civic-backend/API_Contract.md, PROJECT_STRUCTURE.md
- Types: CivicConnectApp/src/types.ts, CivicReport/src/shared/types.ts, My new app/src/shared/types.ts

**Last Updated**: Current as of latest environment scan. Full source control via Git.
_Share this with AI agents for complete project context._

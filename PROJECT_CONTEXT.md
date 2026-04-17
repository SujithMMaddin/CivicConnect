# Civic Reporting System - Project Context and Current State

## 📋 Project Overview

**Project Name**: CivicConnect (Crowdsourced Civic Issue Reporting & Resolution System)

**Description**: A full-stack application for citizens to report local civic issues (e.g., water leaks, garbage, roads) via mobile/web apps. Admins manage issues via dashboard. Features duplicate detection (location-based), priority assignment, status updates.

**Platforms**:

- **Mobile**: React Native Expo app (CivicConnectApp) - report issues with GPS, camera, maps.
- **Web Dashboard**: React Vite app (\"My new app\" - civic-admin-dashboard prototype) - view/manage issues, stats, profile.
- **Backend**: Spring Boot Java REST API (civic-backend) - PostgreSQL, issue CRUD.
- **Admin Web**: Static HTML/JS (admin-web).
- **Experimental**: Additional Vite React prototypes.

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

### Web (\"My new app\" / civic-admin-dashboard)

- React 19 + Vite
- Tailwind CSS 3.4.17, shadcn/ui (Radix primitives), Lucide icons
- Hono/Cloudflare Workers (wrangler.toml)
- Run: `cd \"My new app\" && npm run dev`

### Others

- admin-web: Vanilla HTML/CSS/JS

## 📁 Complete File Inventory (Excluding Ignorables: Builds, Locks, Binaries, Caches)

### Root Directory (d:/SUJITH/UNIVERSITY_PROJECT/)

- .gitignore
- PROJECT_CONTEXT.md
- TODO.md
- TODO_PLAN.md

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
- assets/ (icons, logo)
- src/api/config.ts, src/api/issues.ts, src/api/supabase.ts
- src/components/ (IssueCard.tsx, StatCard.tsx)
- src/navigation/AppNavigator.tsx
- src/screens/ (HelpCenterScreen.tsx, IssuesScreen.tsx, LandingPage.tsx, LoginPage.tsx, MyReportsScreen.tsx, PersonalInfoScreen.tsx, PrivacyPolicyScreen.tsx, PrivacySecurityScreen.tsx, ProfileScreen.tsx, ReportIssueScreen.tsx, SignupPage.tsx, SplashScreen.tsx, TermsOfServiceScreen.tsx)
- src/styles/ (colors.ts, theme.ts)
- src/types.ts
- src/utils/stats.ts

### My new app/ (civic-admin-dashboard prototype)

- .gitignore
- eslint.config.js
- index.html
- knip.json
- package.json
- postcss.config.js
- tailwind.config.js
- TODO_PLAN.md, TODO.md
- tsconfig\*.json
- vite.config.ts
- wrangler.json
- src/react-app/ (App.tsx, pages/AdminDashboard.tsx, Home.tsx, components/ui/\* shadcn primitives)
- src/shared/ (api.ts, types.ts)
- src/worker/index.ts

## 🎯 Current State & Till-Date Updates

### VSCode Focus (Active Development Areas)

- **Visible**: PROJECT_CONTEXT.md, TODO_PLAN.md
- **Open Tabs**: Backend Issue.java/service/controller.java; My new app TODO_PLAN.md/postcss.config.js/api.ts/AdminDashboard.tsx/vite.config.ts/TODO.md; CivicConnectApp LoginPage.tsx/api/config.ts/ProfileScreen.tsx.

Heavy work on backend Issue impl, admin dashboard (My new app), RN auth/screens/api.

### TODO Progress

- **Root**: PROJECT_CONTEXT.md update ✅
- **civic-backend/TODO.md**: Issue null-safety ✅; rebuild/test/stability pending (JVM crashes: hs_err_pid\*.log) ⏳
- **admin-web/TODO.md**: Pinterest UI ✅
- **My new app/TODO_PLAN.md/TODO.md**: Cleanup/rename ✅, AdminDashboard stats/API
- **CivicConnectApp/TODO\*.md**: Screens complete, Supabase/API integration ⏳

### Recent/Updated Code Highlights

- Backend: Issue model/service/controller (open tabs).
- My new app: AdminDashboard.tsx with stats/API (shared/api.ts), vite/postcss configs updated.
- CivicConnectApp: Login/Profile screens, api/config.ts (BASE_URL: localhost:8080).

**Integration Status**: Frontends ready for API; test duplicate/priority next.

## 🚀 Quick Start Commands

1. **Backend**: `cd civic-backend && mvn clean spring-boot:run`
2. **Mobile**: `cd CivicConnectApp && npx expo start`
3. **Web Admin**: `cd \"My new app\" && npm install && npm run dev`
4. **Admin**: Open `admin-web/index.html`

## 🔗 Key Reference Files

- API: civic-backend/API_Contract.md, PROJECT_STRUCTURE.md
- Types: Various src/types.ts, shared/types.ts
- Configs: package.json/pom.xml, api/config.ts, vite.config.ts

**Last Updated**: VSCode environment scan - PROJECT*CONTEXT.md refreshed for accuracy. Full source via Git.
\_Share with AI agents for context.*

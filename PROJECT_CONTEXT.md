# Civic Reporting System - Project Context and Current State

## 📋 Project Overview

**Project Name**: CivicConnect (Crowdsourced Civic Issue Reporting & Resolution System)

**Description**: A full-stack application for citizens to report local civic issues (e.g., water leaks, garbage, roads) via mobile/web apps. Admins manage issues via dashboard. Features duplicate detection (location-based), priority assignment, status updates.

**Platforms**:

- **Mobile**: React Native Expo app (CivicConnectApp) - report issues with GPS, camera, maps.
- **Web Dashboard**: React Vite app (CivicReport) - view/manage issues, stats, profile.
- **Backend**: Spring Boot Java REST API (civic-backend) - PostgreSQL, issue CRUD.
- **Admin Web**: Static HTML/JS (admin-web).
- **Experimental**: 'My new app' (another Vite React).

**Development Stage**: Active development. Mobile/web fronts mostly implemented, backend API ready with TODOs.

**Base URL (Dev)**: Backend `http://localhost:8080/api/issues`

## 🏗️ Architecture

```
[Citizens] Mobile (RN Expo) ─┐
                           ├─ REST APIs ─ [Spring Boot Backend] ─ PostgreSQL
[Admins] Web (React+Vite) ─┘     (duplicate detect, priority rules)
                     ↓
                Static Admin Web
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
- Structure: Controllers (IssueController), Services (IssueService), Models (Issue.java)

### Mobile (CivicConnectApp)

- React Native 0.81 + Expo SDK 54
- React Navigation, Maps, Camera, Location, Image Picker
- TypeScript
- Run: `cd CivicConnectApp && npx expo start`
- Screens: Home, Issues, Report, Profile, Landing, Insights

### Web (CivicReport)

- React 19 + Vite
- Tailwind CSS, shadcn/ui (Radix primitives), Lucide icons
- Hono (backend?), Cloudflare Workers (wrangler)
- Components: IssueCard, StatCard, UI primitives
- Pages: Home, Issues, IssueDetail, Profile, Report
- Run: `cd CivicReport && npm run dev`

### Others

- admin-web: Vanilla HTML/CSS/JS
- My new app: Vite React prototype (AdminDashboard, etc.)

## 📁 File Structure Summary (Key Dirs)

```
d:/SUJITH/UNIVERSITY_PROJECT/
├── civic-backend/          # Java Spring Boot API
│   ├── pom.xml
│   ├── src/main/java/com/civic/backend/
│   │   ├── CivicBackendApplication.java
│   │   ├── controller/IssueController.java
│   │   ├── service/IssueService.java
│   │   └── model/Issue.java
│   ├── PROJECT_STRUCTURE.md
│   └── API_Contract.md
├── CivicConnectApp/        # RN Expo Mobile
│   ├── package.json
│   ├── App.tsx
│   ├── src/screens/        # HomeScreen, IssuesScreen, etc.
│   ├── src/api/            # config.ts, issues.ts
│   └── android/
├── CivicReport/            # React Web Dashboard
│   ├── package.json
│   ├── src/react-app/
│   │   ├── pages/          # Home.tsx, Issues.tsx, etc.
│   │   └── components/     # IssueCard.tsx, StatCard.tsx, ui/
│   └── vite.config.ts
├── admin-web/              # Static admin
│   └── index.html
└── My new app/             # Prototype
    └── src/react-app/pages/AdminDashboard.tsx
```

**Full recursive list**: Use VSCode explorer or `tree /f` in cmd.

## 🎯 Current State & TODOs

### Open Tabs (VSCode Focus)

- CivicConnectApp: App.tsx, screens (Home/Issues/Profile/Report), api/issues.ts, components (IssueCard/StatCard)
- CivicReport: pages (Home/Issues/IssueDetail/Profile/Report), components (IssueCard/StatCard/layout)

### TODO Status

- **CivicConnectApp/TODO.md** ✅ _AdminDashboardScreen filter fixed_ (category filter, empty states).
- **civic-backend/TODO.md** ⏳ _Issue Creation Fix_:
  1. ✅ Null checks in IssueService.createIssue()
  2. ⏳ Rebuild/restart backend
  3. ⏳ Test submission
  4. ⏳ Verify DB

**Recent Work**: Frontend filtering, backend null-safety fixes. Ready for integration testing.

## 🚀 Quick Start / Run Commands

1. **Backend**: `cd civic-backend && mvn clean spring-boot:run` (port 8080)
2. **Mobile**: `cd CivicConnectApp && npx expo start` (scan QR or android)
3. **Web**: `cd CivicReport && npm install && npm run dev` (localhost:5173)
4. **Admin**: Open `admin-web/index.html` in browser.

## 🔗 Key Files for AI Agents

- Backend API: civic-backend/API_Contract.md, PROJECT_STRUCTURE.md
- Mobile types: CivicConnectApp/src/types.ts
- Web types: CivicReport/src/shared/types.ts

**Last Updated**: $(date)
_Share this file with other AIs for instant project context._

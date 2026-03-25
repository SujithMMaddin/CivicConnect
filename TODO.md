# Frontend Fix for Undefined ID Error

## Progress

1. [x] Audit: Found `issue.issueId` only in My new app/src/react-app/pages/AdminDashboard.tsx

## Remaining Steps

1. [x] Edited My new app/src/react-app/pages/AdminDashboard.tsx: Replaced `issue.issueId` → `issue.id`
2. [ ] CivicConnectApp/src/api/issues.ts: Add getIssueById function with id validation, strengthen update guard to check !id || id === 'undefined' || isNaN(Number(id))
3. [ ] Add missing navigation guards in IssueCard onClick (check if (issue?.id))
4. [ ] Disable/remove update functionality in AdminDashboardScreen.tsx
5. [ ] Test all flows, verify no /issues/undefined calls
6. [ ] attempt_completion

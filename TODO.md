# Loading Performance Fix TODO

## Plan Steps (React Native CivicConnectApp)

- [ ] **Step 1**: Create project-level TODO.md ✅ **(Current step)**
- [x] **Step 2**: Edit `CivicConnectApp/src/screens/LandingPage.tsx` ✅
  - Conditional `setLoading(true)` in `loadIssues`
  - `fetchIssues(true)` in `onRefresh`
- [x] **Step 3**: Edit `CivicConnectApp/src/screens/MyReportsScreen.tsx` ✅
  - Conditional `if (issues.length === 0) setLoading(true);` in `useFocusEffect`
- [x] **Step 4**: Edit `CivicConnectApp/src/screens/ProfileScreen.tsx` ✅
  - Conditional `if (myIssues.length === 0) setLoading(true);` in `useFocusEffect`
- [x] **Step 5**: Edit `CivicConnectApp/src/screens/IssuesScreen.tsx` ✅
  - Add conditional `setLoading(true)` in `loadIssues`
  - `fetchIssues(true)` in `onRefresh`
- [ ] **Step 6**: Verify no linter errors
- [ ] **Step 7**: Test with `cd CivicConnectApp && npx expo start --clear`
- [ ] **Step 8**: Update TODO.md as completed and attempt_completion

**Next**: Proceed to Step 2 after confirmation.

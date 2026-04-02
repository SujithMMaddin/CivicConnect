# TODO: Remove Google OAuth Authentication

## Approved Plan Steps (Breakdown):

### 1. Create this TODO.md [✅ COMPLETED]

### 2. Edit CivicConnectApp/src/screens/LoginPage.tsx [✅ COMPLETED]

- Removed Google-specific imports (WebBrowser, makeRedirectUri)
- Removed `WebBrowser.maybeCompleteAuthSession()`
- Deleted entire `handleGoogleSignIn` function
- Removed Google button TouchableOpacity from socialContainer
- Removed divider "OR SECURE LOGIN WITH" section
- Updated to biometricContainer with centered single biometric button (width: 200)
- Cleaned unused imports (MaterialCommunityIcons)
- Verified email/password + biometric login preserved

### 3. Validate no other Google references [✅ COMPLETED - search_files returned 0 results]

### 4. Package cleanup (optional)

- Run search_files again to confirm zero matches

### 4. Package cleanup (optional)

- Remove expo-auth-session, expo-web-browser if unused project-wide
- Run `npx expo install --fix`

### 5. Test app

- `npx expo start`
- Test email/password login
- Test biometric login (if enabled)
- Verify clean UI layout
- No compilation errors/warnings

### 6. attempt_completion

**Status: Ready for Step 2 - LoginPage.tsx edit**

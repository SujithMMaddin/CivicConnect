# CivicConnectApp Downloadable APK Build Plan

## Steps:

[✅ COMPLETED]

- npm install -g @expo/eas-cli (if needed)
- npx eas --version: 18.4.0

### 2. Expo Login [✅ COMPLETED]

- Already logged in as sujithmmaddin

### 3. Optional Cleanup unused deps [✅ COMPLETED]

- npm uninstall expo-auth-session expo-web-browser (removed 7 packages)
- npx expo install --fix (skipped)

### 4. Validate setup [RUNNING]

- npx expo-doctor installing/running

### 5. Build Preview APK [FIXING GRADLE ERROR]

- Gradle can't access gradle-wrapper.jar (corrupt?)
- Deleted android/ dir to let EAS prebuild clean
- Rerun build (will generate fresh native code)
- Dashboard: https://expo.dev/accounts/sujithmmaddin/projects/CivicConnectApp/builds
- Prev: 5e0491c4-e016-4ea2-ac69-ff0cadf14f04

### 6. Test [PENDING]

- npx expo start

**Downloadable APK link will be provided after build 5.**

Updated when step completed.

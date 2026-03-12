# Cloudinary Image Upload Implementation Plan - ReportIssueScreen

## Steps to Complete:

### 1. [PENDING] Create TODO.md (Current step - done)

### 2. [PENDING] Edit ReportIssueScreen.tsx

- Add Cloudinary constants (CLOUD_NAME: 'drhzct1u1', UPLOAD_PRESET: 'civicconnect_upload')
- Add isUploading state
- Add uploadToCloudinary function (FormData/fetch)
- Update handleSubmit: sequential upload → collect imageUrls → backend POST
- Update UI: combined loading state for submit button

### 3. [PENDING] Test implementation

- Run `npx expo start`
- Capture 1-3 images
- Submit → verify uploads to Cloudinary, backend receives imageUrls

### 4. [PENDING] Handle edge cases

- Upload errors
- No images (empty array)
- Network failures

### 5. [DONE] Attempt completion

Progress: 1/5 steps complete.

**Instructions**: After each step completion, I will update this file. Confirm step 2?\*\*

# Mobile Conversion Strategy: Research Project

This document outlines the recommended approach, technical considerations, and roadmap for transforming your current React/Vite web application into a high-performance mobile app.

## Summary of Insights

Since your project heavily utilizes **Shadcn/UI**, **Framer Motion**, and a specialized **WebGL 360° Viewer**, the most efficient path to mobile is using **Capacitor.js**.

### Why Capacitor?
*   **Maximum Code Reuse:** You keep 95%+ of your existing React logic and UI components.
*   **Native Performance:** It provides a thin bridge to native APIs (Camera, Filesystem, Biometrics) that PWAs cannot easily access.
*   **Web-First DX:** You continue developing in your familiar Vite environment with "live reload" on actual devices.

---

## Technical Recommendations

### 1. The Core Bridge: Capacitor.js
Rather than rewriting in React Native (which would require replacing all Tailwind/HTML elements), Capacitor wraps your web app in a native WebView.
*   **Command:** `npm install @capacitor/core @capacitor/cli`
*   **Platforms:** Add iOS and Android targets using `@capacitor/ios` and `@capacitor/android`.

### 2. UI/UX Adjustments
Your current design is responsive, but a "Native Feel" requires specific tweaks:
*   **Safe Area Insets:** Handle "notches" and home indicators on modern phones.
*   **Touch Optimizations:** Swap some hover-based interactions for long-press or tap-to-expand (especially for 360° hotspots).
*   **Navigation:** Consider implementing a `BottomNavigationBar` for mobile-only users to follow native patterns.

### 3. 360° Viewer Optimization
Mobile GPUs are powerful but memory-constrained.
*   **Texture Management:** Use smaller resolution images (e.g., 4k instead of 8k or 16k) for mobile devices to prevent crashes.
*   **Gyroscope Support:** Leverage Capacitor's Motion plugin to allow users to "look around" the 360° view by physically moving their phone.

### 4. Authentication & Data (Supabase)
*   **Deep Linking:** You will need to configure custom URL schemes (e.g., `researchproject://`) so that Supabase authentication redirects back into your app instead of a web browser.
*   **Persistence:** Ensure Supabase session persistence works correctly within the native storage layer.

---

## Proposed Roadmap

### Phase 1: Preparation (Web-Side)
- [ ] Implement `SafeArea` padding in `App.tsx`.
- [ ] Optimize 360° image assets for mobile delivery.
- [ ] Refine `useIsMobile` hooks to prioritize touch-friendly layouts.

### Phase 2: Native Integration
- [ ] Initialize Capacitor in the project root.
- [ ] Build the web project (`npm run build`) and sync to platforms (`npx cap sync`).
- [ ] Test 360° viewer performance on physical iOS/Android devices.

### Phase 3: Native Features
- [ ] Add Gyroscope/Accelerometer support for the Panorama Viewer.
- [ ] Implement Push Notifications (if needed for research updates).
- [ ] Configure App Store/Play Store assets and deployment.

## Verification Plan

### Automated Tests
*   **Vite Build Check:** Ensure `npm run build` generates a Capacitor-compatible `dist` folder.
*   **Lighthouse Mobile Audit:** Run a mobile performance audit to ensure core vitals are met before wrapping.

### Manual Verification
*   **Physical Device Testing:** Verify that the 360° viewer's touch rotation feels smooth on an actual phone.
*   **Auth Flow:** Test a full login/logout cycle using deep links on a simulator or device.

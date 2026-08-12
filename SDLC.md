# Software Development Life Cycle (SDLC) - VOICE Service Cycle

This document outlines the Software Development Life Cycle (SDLC) followed for the **VOICE Service Cycle** application. It serves as a comprehensive overview of how the project evolved from initial requirements to a deployed cross-platform application.

---

## 1. Planning & Requirements Analysis

**Objective:** To automate and manage the daily service assignments for community members, moving away from manual tracking.

**Key Requirements Gathered:**
*   **Automated Rotation:** A 12-day cycle engine to automatically assign members to specific services.
*   **Manager Control:** A dashboard for managers to handle exceptions (absences, replacements).
*   **Immediate Synchronization:** The UI must reflect changes instantly when a member's status is updated.
*   **Communication:** Ability to export the daily roster in a formatted text suitable for WhatsApp announcements.
*   **Cross-Platform Availability:** The system needs to be accessible via the web and as a standalone Android application.

## 2. System Design & Architecture

**Objective:** Define the technical stack, database schema, and overall architecture to meet the project requirements.

**Technology Stack Selection:**
*   **Frontend:** React (for component-based UI), TypeScript (for type safety), and Tailwind CSS (for rapid UI development).
*   **Backend/Database:** Supabase (PostgreSQL) for reliable data persistence and real-time capabilities.
*   **Mobile Wrapper:** Capacitor to package the web application into a native Android APK.

**Database Schema Design:**
*   `members`: Tracks user details, active status, and cycle order.
*   `services`: Defines available daily services, descriptions, and timings.
*   `assignment_overrides`: A critical table handling manual interventions—recording absences (daily or continuous) and replacements, overriding the default cycle engine.

## 3. Implementation & Coding

**Objective:** Transform the design into a functional application.

**Key Development Milestones:**
*   **Core Engine (`cycleEngine.ts`):** Developed the algorithm that calculates daily assignments by combining the fixed `cycleOrder` with the current date, while factoring in the `assignment_overrides` table.
*   **Manager Dashboard:** Built the UI to allow managers to interact with the cycle engine. Implemented complex logic to handle "Continuous Absences" vs. "Daily Overrides" to ensure data consistency.
*   **WhatsApp Export:** Created a utility to format the day's data into a readable string with emojis (🟢, 🟠, 🔴) for easy sharing by the manager.
*   **PWA & Capacitor Integration:** Configured `vite-plugin-pwa` for offline capabilities and initialized Capacitor for native Android compilation. Replaced standard emojis with custom brand assets (`voice_logo.png`).

## 4. Testing & Quality Assurance

**Objective:** Ensure the application functions correctly across different scenarios and devices.

**Testing Phases Conducted:**
*   **Logic Verification:** Tested the `cycleEngine` extensively to ensure members rotate correctly over a 12-day period.
*   **Override Conflict Resolution:** Tested edge cases, such as marking a member continuously absent and ensuring previously set daily overrides are correctly deleted or ignored.
*   **UI/UX Testing:** Ensured immediate UI updates without page reloads after saving an override.
*   **Mobile Build Testing:** Compiled the Android APK multiple times (`app-debug.apk`) to verify mobile responsiveness, splash screens, and app icons.

## 5. Deployment & Release

**Objective:** Deliver the application to end-users.

**Deployment Steps Taken:**
*   **Web Deployment Preparation:** Ensured Vite build process (`npm run build`) outputs optimized static assets.
*   **Android Packaging:** Used `@capacitor/assets` to generate native Android icons and splash screens.
*   **APK Generation:** Successfully ran Gradle build scripts (`./gradlew assembleDebug`) to generate the `app-debug-v7.apk` for the user to install directly on their Android devices.

## 6. Maintenance & Future Iterations

**Objective:** Support the application post-release and plan for future enhancements.

**Current State & Planned Features:**
*   **Ongoing Support:** Resolving minor UI glitches and refining database override logic as reported by users.
*   **Future - Push Notifications:** Scheduled the integration of Capacitor Local Notifications (or OneSignal) to send daily alerts (e.g., at 8:00 PM) to members regarding their next day's service.
*   **Future - UI Overhaul:** Planned updates to enhance the visual aesthetics of the application to a more premium standard.

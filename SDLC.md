# Software Development Life Cycle (SDLC) Specification
## Advaita VOICE Hub: Vedic Ashram Management & Spiritual Analytics Ecosystem
**Document Version:** `9.0.0`  
**Classification:** Engineering Specification & Portfolio Documentation  
**Lead Engineer / Architect:** Gian Juti Tripura (`gianjuti.csecu@gmail.com`)  
**Target Platforms:** Progressive Web Application (PWA) & Native Android (Capacitor Engine)  
**Repository:** `https://github.com/Gian-Juti-Tripura/VOICE-Service-Cycle.git`  
**Last Revised:** September 2026  

---

## Table of Contents
1. [Executive Summary & System Abstract](#1-executive-summary--system-abstract)
2. [SDLC Methodology & Governance Model](#2-sdlc-methodology--governance-model)
3. [Phase 1: Requirements Engineering & Stakeholder Analysis](#3-phase-1-requirements-engineering--stakeholder-analysis)
   - 3.1 Stakeholder Personas & Roles
   - 3.2 Functional Requirements (FR Matrix)
   - 3.3 Non-Functional Requirements (NFR Matrix)
4. [Phase 2: System Architecture & Design Specification](#4-phase-2-system-architecture--design-specification)
   - 4.1 High-Level Architecture (C4 Model)
   - 4.2 Database Schema & Entity-Relationship Architecture
   - 4.3 Core Algorithmic Engines & State Machines
5. [Phase 3: Implementation & Component Engineering](#5-phase-3-implementation--component-engineering)
   - 5.1 Technology Stack Rationalization
   - 5.2 Frontend Engineering & UI/UX Design System
   - 5.3 Hybrid Mobile & Native Hardware Integration
   - 5.4 Cross-Platform Reporting & Automated Broadcasting Engines
6. [Phase 4: Quality Assurance, Verification & Validation](#6-phase-4-quality-assurance-verification--validation)
   - 6.1 Testing Methodologies & Test Cases
   - 6.2 Edge Case Hardening & Fault Tolerance
7. [Phase 5: Build Automation, CI/CD & Deployment Pipeline](#7-phase-5-build-automation-cicd--deployment-pipeline)
   - 7.1 Vite Production Pipeline & Tree-Shaking
   - 7.2 Native Android Compilation Pipeline
8. [Phase 6: Security, Role-Based Access Control & Governance](#8-phase-6-security-role-based-access-control--governance)
9. [Phase 7: Production Metrics, Business Impact & Resume Highlights](#9-phase-7-production-metrics-business-impact--resume-highlights)

---

## 1. Executive Summary & System Abstract

The **Advaita VOICE Hub** is an enterprise-grade, offline-resilient, cross-platform software ecosystem engineered to digitize, automate, and analyze operations for **Advaita VOICE (Vedic Oasis for Inspiration, Culture & Education)**—a premier university-level residential spiritual academy affiliated with the **University of Chittagong** and the **ISKCON Youth Forum (IYF)**.

Historically, ashram operations—including a cyclic 12-day seva (service) rotation, daily multifaceted sadhana (spiritual discipline) audits, kitchen meal headcount and bazaar expense splitting, resident profiles, academic curricula tracking (854 syllabus topics across 6 tiers), and disciplinary compliance—were maintained through paper ledgers, fragmented spreadsheets, and error-prone manual WhatsApp messages.

**Advaita VOICE Hub** unifies these disparate operational verticals into a single cohesive, high-performance web and mobile application. Built using **React 19, TypeScript 6, Vite 8, Tailwind CSS, Supabase (PostgreSQL), and Capacitor 6**, the system provides instant deterministic seva scheduling, real-time disciplinary strike tracking, automated dynamic meal-rate calculation, biometric and haptic feedback, PWA offline caching, and instant one-tap WhatsApp broadcasting.

```
+----------------------------------------------------------------------------------------------------+
|                                    ADVAITA VOICE HUB ECOSYSTEM                                     |
+------------------------------------+----------------------------------+----------------------------+
| 🔄 SEVA CYCLE ENGINE               | 📿 SADHANA & DISCIPLINE AUDIT    | 🍴 PRASAD & MEAL SUITE     |
| - 12-day deterministic rotation    | - 16-round japa milestone track  | - Meal attendance logging  |
| - Continuous/daily absence routing | - Auto-strike rule enforcement   | - Bazar expense breakdown  |
| - Cascade priority replacements    | - WhatsApp verdict reports       | - Automated monthly balance|
+------------------------------------+----------------------------------+----------------------------+
| 🎓 CURRICULUM & ACADEMY            | 👥 DEVOTEE DIRECTORY             | 📢 NOTIFICATIONS & PWA     |
| - 6-Level 854-Topic Syllabus       | - CU academic & spiritual bio    | - OneSignal push alerts    |
| - 13 Residential Youth Camps       | - Guru lineage & emergency data  | - Capacitor Native Haptics |
| - Sebananda Vedic E-Library        | - Dynamic roles & permissions    | - Full offline persistence |
+------------------------------------+----------------------------------+----------------------------+
```

---

## 2. SDLC Methodology & Governance Model

The engineering team adopted an **Agile-Scrum Framework** customized for rapid iteration, continuous deployment, and extreme responsiveness to operational ashram requirements.

```mermaid
flowchart LR
    A[Sprint Planning & Backlog] --> B[Domain Research & UX Design]
    B --> C[TypeScript Architecture & Coding]
    C --> D[Rigorous Static & Dynamic QA]
    D --> E[Native Build & Packaging]
    E --> F[Staging Review & Production Release]
    F -->|Operational Feedback Loop| A
```

### Core SDLC Tenets:
1. **Two-Week Iterative Sprints**: Functional modules were developed and delivered incrementally (e.g., Sprint 1: Seva Cycle Engine; Sprint 2: Sadhana Analytics; Sprint 3: Meal & Bazar Finance; Sprint 4: Native Android & Notification Engine; Sprint 5: Disciplinary Auto-Strike System).
2. **Deterministic Domain Logic**: Business rules (such as cyclical service rotation or monthly meal cost prorating) were codified into pure TypeScript mathematical functions with zero external dependencies to ensure predictable testability.
3. **Continuous Integration & Native Artifact Generation**: Every code push to `master` requires clean static analysis (`oxlint`, `tsc -b`), tree-shaken bundling via Vite, and automated synchronization with Android Studio (`npx cap sync android`) generating ready-to-deploy debug APKs (`Advaita-VOICE-Hub-v9.apk`).
4. **Zero-Downtime Data Evolution**: Dual storage persistence architecture (Supabase cloud database with synchronized local browser/device caching) guarantees continuous operation even during university internet outages.

---

## 3. Phase 1: Requirements Engineering & Stakeholder Analysis

### 3.1 Stakeholder Personas & Roles

| Persona | Operational Context | Primary Pain Point Solved | Primary Access Rights |
|---|---|---|---|
| **Ashram Counselor / Director** | Guides 10–20 resident students spiritually and academically | Lack of objective data on devotee wake-up punctuality, class attendance, and japa completion | Full Read/Audit on Sadhana, Strikes, Profiles (`COUNSELOR`, `ADMIN`) |
| **Internal Manager (`Dipen P.`)** | Oversees ashram property, discipline, cleanliness, and exceptions | Manual conflict resolution when devotees fall sick or go home on leave | Daily/Continuous Seva Overrides, Strike Adjustments (`INTERNAL_MANAGER`) |
| **Morning Program Incharge** | Coordinates 4:00 AM wake-up, Mangalarati, and morning classes | Counting attendance at 4:30 AM and preparing daily reports manually | Mangalarati/Class Logs, MP WhatsApp Broadcasts (`MORNING_INCHARGE`) |
| **Kitchen / Bazar Manager** | Purchases daily groceries, tracks gas cylinders, logs deposits | Calculating fluctuating daily meal rates and split liabilities across members | Bazar Expense Logging, Attendance Roster, Deposit Accounts (`MANAGER`) |
| **Resident Devotee / Member** | CU student residing in the ashram balancing academics & sadhana | Forgetting daily service duty or meal status; unaware of monthly mess dues | Personal Sadhana Logging, Meal Toggling, Roster View (`MEMBER`) |

---

### 3.2 Functional Requirements (FR Matrix)

- **FR-01: Cyclical Service Rotation Engine**: Must algorithmically assign active devotees to 12 core temple services daily based on a fixed cycle order and the day of the month without human intervention.
- **FR-02: Multi-Tier Absence & Replacement Management**: Must distinguish between single-day emergency absences and continuous multi-week leaves (e.g., university exams or home visits), automatically routing replacements using a deterministic priority cascade.
- **FR-03: Real-Time Sadhana Metric Tracking**: Must capture wake-up times, bedtime curfew compliance, japa rounds completed before 6:30 AM / 8:30 AM / 10:00 PM, Mangalarati attendance, and morning Bhagavatam class participation.
- **FR-04: Automated Disciplinary Strike Audit**: Must monitor must-follow rules in real time. Any unexcused violation (late bed, late wake-up, missing MP, unexcused absent Mangalarati/class) must automatically generate a Disciplinary Strike.
- **FR-05: Threshold Alerting & Group Degradation**: When a resident in the VOICE group accumulates 3 strikes within a calendar month, the system must issue warning flags, degrade the resident status to LOTUS, and notify the Counselor.
- **FR-06: Dining Hall Attendance & Dynamic Meal Rate Accounting**: Must allow residents to toggle breakfast, lunch, and dinner attendance with guest count multipliers; calculate monthly meal costs using:
  $$\text{Meal Rate} = \frac{\sum \text{Bazar Expenses}}{\sum \text{Total Consumed Meals}}$$
- **FR-07: Financial Ledger & PDF Export**: Must track member opening balances, cash/bKash/Nagad deposits, and produce printable, audit-ready monthly billing statements via client-side PDF generation.
- **FR-08: Devotee Master Directory & Lineage Portal**: Must maintain comprehensive profiles for all devotees including academic department, batch, blood group, emergency contact, counselor lineage, and spiritual vows.
- **FR-09: 854-Topic Vedic Curriculum Explorer**: Must organize the 6-Level syllabus (DYS, Spiritual Scientist, Positron, Protons, Bhakti Shastri, CC) into searchable, filterable learning modules.
- **FR-10: Multilingual Native Experience**: Must provide instantaneous toggling between English and Bengali across all UI strings, dates, and dynamic report generators.

---

### 3.3 Non-Functional Requirements (NFR Matrix)

- **NFR-01: Latency & Rendering Performance**: First Contentful Paint (FCP) under 1.2s; Largest Contentful Paint (LCP) under 2.0s; input response under 50ms across modern Android devices.
- **NFR-02: Offline-First Reliability**: The application must remain fully navigable without network connectivity, queuing changes in indexed local storage (`localDb.ts`) and hydrating seamlessly upon reconnection.
- **NFR-03: Cross-Platform Native Parity**: Single code base deployable as a responsive web app (desktop/mobile) and compiled as a standalone native Android package (`.apk`) using Capacitor with zero layout breakage down to 320px screen widths.
- **NFR-04: Tactile & Auditory Micro-interactions**: Critical buttons (attendance toggles, navigation tabs, search pills) must trigger device-level haptic feedback via `@capacitor/haptics`.
- **NFR-05: Data Security & Row-Level Authorization**: Supabase tables must enforce PostgreSQL Row-Level Security (RLS), restricting administrative write operations to verified managers and counselors.

---

## 4. Phase 2: System Architecture & Design Specification

### 4.1 High-Level Architecture (C4 Model)

```mermaid
C4Context
    title Advaita VOICE Hub - System Context Diagram (Level 1)
    
    Person(devotee, "Resident Devotee", "Logs daily sadhana, views seva duty, manages meals.")
    Person(manager, "Internal Manager", "Controls service overrides, discipline strikes, bazar finances.")
    Person(counselor, "Ashram Counselor", "Reviews monthly verdicts, audits sadhana, provides student care.")
    
    System(voiceHub, "Advaita VOICE Hub", "React 19 + TypeScript + Capacitor Mobile/Web Application")
    
    System_Ext(supabase, "Supabase Cloud", "PostgreSQL Database, Auth & Realtime Subscriptions")
    System_Ext(onesignal, "OneSignal API", "Push Notification Broadcast Service")
    System_Ext(whatsapp, "WhatsApp Web/App", "Target for automated daily rosters and monthly audit reports")
    
    Rel(devotee, voiceHub, "Uses mobile app / browser", "HTTPS / Capacitor Bridge")
    Rel(manager, voiceHub, "Manages ashram operations", "HTTPS")
    Rel(counselor, voiceHub, "Audits discipline & sadhana", "HTTPS")
    
    Rel(voiceHub, supabase, "Queries & mutates operational data", "PostgREST / WebSockets")
    Rel(voiceHub, onesignal, "Triggers push notification broadcasts", "REST API")
    Rel(voiceHub, whatsapp, "Exports pre-formatted Unicode reports", "Native Intent / Clipboard")
```

---

### 4.2 Database Schema & Entity-Relationship Architecture

The relational schema is implemented in PostgreSQL via Supabase with full type bindings in `src/types/`:

```mermaid
erDiagram
    MEMBERS ||--o{ ASSIGNMENT_OVERRIDES : receives
    MEMBERS ||--o{ SADHANA_ENTRIES : logs
    MEMBERS ||--o{ MEAL_OVERRIDES : records
    MEMBERS ||--o{ PAYMENTS : deposits
    SERVICES ||--o{ ASSIGNMENT_OVERRIDES : overridden_in
    BAZAR_EXPENSES ||--o{ MEAL_REPORTS : consolidates

    MEMBERS {
        uuid id PK
        string fullName
        string phone
        string email
        boolean isActive
        int cycleOrder "0 to 11 rotation rank"
        string role "ADMIN | MANAGER | MEMBER"
        string groupTier "VOICE | LOTUS"
        timestamp createdAt
    }

    SERVICES {
        string id PK "1 to 12"
        string nameEn
        string nameBn
        string descEn
        string descBn
        string timing
        boolean isActive
    }

    ASSIGNMENT_OVERRIDES {
        uuid id PK
        string dateStr "YYYY-MM-DD or CONTINUOUS"
        uuid memberId FK
        string serviceId FK
        string status "ACTIVE | ABSENT | REPLACED"
        string absenceReason
        uuid replacementMemberId FK
        uuid managerId FK
        timestamp timestamp
    }

    SADHANA_ENTRIES {
        uuid id PK
        uuid devoteeId FK
        string dateStr "YYYY-MM-DD"
        string wakeUpTime
        boolean wokeUpOnTime
        string sleepTime
        boolean sleptOnTime
        boolean morningProgramOnTime
        boolean mangalaratiAttended
        boolean morningClassAttended
        int japaBefore630
        int japaBefore830
        int japaBefore1000
        int readingMinutes
        int hearingMinutes
        int calculatedScore
    }

    MEAL_OVERRIDES {
        uuid id PK
        uuid memberId FK
        string date "YYYY-MM-DD"
        boolean breakfast
        boolean lunch
        boolean dinner
        int guestCount
        boolean isEkadashiFasting
    }

    BAZAR_EXPENSES {
        uuid id PK
        string date "YYYY-MM-DD"
        string month "YYYY-MM"
        string buyer
        string category "VEGETABLES | GRAINS | DAIRY | SPICES | FUEL"
        string items
        numeric amount
    }

    PAYMENTS {
        uuid id PK
        uuid memberId FK
        numeric amount
        string date "YYYY-MM-DD"
        string month "YYYY-MM"
        string method "CASH | BKASH | NAGAD | BANK"
        string trxId
    }
```

---

### 4.3 Core Algorithmic Engines & State Machines

#### A. The 12-Day Cyclical Rotation Engine (`cycleEngine.ts`)
The ashram's daily temple duties rotate deterministically using modular arithmetic based on the calendar day and member seniority rank:

$$\text{Service Index} = (\text{cycleOrder} + \text{dayOfMonth} + 3) \pmod{N}$$

Where:
- $\text{cycleOrder} \in [0, 11]$ is the permanent seniority index assigned to each resident.
- $\text{dayOfMonth} \in [1, 31]$ is the current day.
- $N$ is the count of active temple services (typically 12).
- Gaps in active service IDs are natively mapped via indexed lookups.

#### B. Hierarchical Absence & Cascade Replacement Priority
When a resident is marked absent (`status === 'ABSENT'`), the engine evaluates an ordered replacement priority vector:
$$\text{Fallback Cascade} = [10, 4, 6, 11, 2, 8, 7]$$
Members assigned to lower-criticality services (e.g., Service 10: Night Serving) are drafted to replace unassigned higher-priority morning and deity services (e.g., Service 1: Temple Hall Mangalarati), ensuring critical temple functions never lapse.

#### C. Live Disciplinary Auto-Strike State Machine
The disciplinary engine continuously scans daily logs and evaluates rule infractions:

```mermaid
stateDiagram-v2
    [*] --> EvaluatingDailyLog
    
    EvaluatingDailyLog --> InfractionDetected: Rule Violation (!sleptOnTime || !morningProgramOnTime || !wokeUpOnTime || unexcused absence)
    EvaluatingDailyLog --> Compliant: All must-follow rules satisfied
    
    InfractionDetected --> AutoStrikeCountIncrement: +1 Rule Breach Day
    Compliant --> MaintainStrikeCount
    
    AutoStrikeCountIncrement --> CheckMonthlyTotal
    MaintainStrikeCount --> CheckMonthlyTotal
    
    state CheckMonthlyTotal {
        [*] --> GreenTier: Strikes = 0 (100% Success)
        [*] --> YellowTier: Strikes = 1 (Warning 1)
        [*] --> OrangeTier: Strikes = 2 (Warning 2 - Strict Probation)
        [*] --> RedTier: Strikes >= 3 (Degraded to LOTUS)
    }
```

---

## 5. Phase 3: Implementation & Component Engineering

### 5.1 Technology Stack Rationalization

| Layer | Technology Selected | Rationale & Architectural Advantage |
|---|---|---|
| **Language** | **TypeScript 6.0** | Full end-to-end type safety, eliminating runtime undefined crashes across financial and scheduling engines. |
| **View Layer** | **React 19** | Concurrent rendering, declarative state management, modern hook ecosystem (`useMemo`, `useCallback`, `useTransition`). |
| **Bundler** | **Vite 8.2** | Lightning-fast Hot Module Replacement (HMR < 50ms) and tree-shaken Rollup production builds. |
| **CSS Framework** | **Tailwind CSS 3.4** | Utility-first, zero runtime overhead, responsive micro-breakpoints, native dark-mode class chaining. |
| **Database & Auth** | **Supabase (PostgreSQL 15)** | Real-time WebSocket replication, built-in row-level security, PostgREST automatic endpoints. |
| **Mobile Runtime** | **Capacitor 6** | Modern alternative to Cordova; direct native bridge to Android SDK, keeping web layer 100% modern. |
| **Icons & Design** | **Lucide React** | Featherweight tree-shakeable vector icons with unified visual language. |
| **PDF Generation** | **jsPDF 4.2 + html2canvas 1.4** | In-browser vector and raster PDF document rendering without backend server dependencies. |
| **Push Notifications** | **OneSignal + Capacitor Local** | Reliable scheduled alerts (8:00 PM evening roster alert, 4:00 AM wake-up reminder). |

---

### 5.2 Frontend Engineering & UI/UX Design System

#### 1. Responsive Navigation System
- **Bottom Navigation Bar (`BottomNavBar.tsx`)**: Fixed bottom navigation bar optimized for single-thumb mobile usage. Features 6 evenly-spaced, truncated micro-tabs (`Home`, `Meals`, `Sadhana`, `Discipline`, `Seva`, `Profiles`) utilizing `flex-1 min-w-0` to avoid viewport overflow down to 320px screens.
- **Quick Portal Launcher (`GlobalSearchBar.tsx`)**: Replaced loose, wrapping pills with an authentic **5×3 Fixed-Size Rectangular Grid** spanning `w-full` flush with the search bar. Each card features category color-coded Lucide icons and bilingual labels (`h-[42px]` mobile, `h-[36px]` desktop) with smooth `active:scale-95` tactile response.

#### 2. Divine Visual Aesthetic
The interface incorporates devotional visual cues honoring the heritage of Advaita Acharya and Sri Sri Radha Madhava:
- Fixed translucent backdrop with Krishna Vrindavan peacock motifs.
- Golden amber gradient borders (`border-amber-400/40`, `shadow-[0_0_20px_rgba(245,158,11,0.3)]`).
- Interactive falling flower particles (`FallingFlowers.tsx`) and smooth modal transitions.

---

### 5.3 Hybrid Mobile & Native Hardware Integration

Using Capacitor 6, the web application interfaces directly with native Android platform capabilities:

```
+-------------------------------------------------------------+
|                      REACT 19 WEB LAYER                     |
|           (HTML5, CSS3 Tailwind, TypeScript Engine)         |
+-------------------------------------------------------------+
                              |
               Capacitor Native JavaScript Bridge
                              |
+-----------------------------+-------------------------------+
| @capacitor/haptics          | Provides tactile vibration feedback on button tap |
| @capacitor/local-notifs     | Schedules daily 8 PM seva and 4 AM alarm triggers |
| @onesignal/capacitor        | Receives cloud push announcements from Incharges  |
| Android Native Webview      | Hardware accelerated Chrome rendering engine      |
+-----------------------------+-------------------------------+
```

---

### 5.4 Cross-Platform Reporting & Automated Broadcasting Engines

A central requirement was bridging complex ashram data into accessible formats for community consumption. The system provides two primary export conduits:

#### 1. Rich WhatsApp Unicode Formatter
With one tap, internal managers and incharge devotees can generate formatted WhatsApp messages incorporating emoji status bullets, bold headings, and markdown tables:
- **Daily Seva Roster Broadcast**: Formats all 12 service assignments, absences, and replacements with status badges (`🟢 PRESENT`, `🔴 ABSENT`, `🔄 REPLACED`).
- **Morning Program Combined Audit**: Summarizes Mangalarati attendance, class participation, and 4:00 AM wake-up stats.
- **Monthly Discipline & Sadhana Verdict**: Produces official evaluation reports showing devotee percentage scores, rule infractions, and promotion/probation status.

#### 2. Client-Side Financial Statement Rendering
The Prasad & Meal suite compiles monthly bazar expenses, individual attendance weights, and deposit receipts into audit-grade PDF statements using `html2canvas` and `jsPDF`, downloadable on mobile and desktop without server overhead.

---

## 6. Phase 4: Quality Assurance, Verification & Validation

### 6.1 Testing Methodologies & Test Cases

| Test ID | Test Category | Target Component | Input / Scenario | Expected Result | Status |
|---|---|---|---|---|---|
| **TC-ROT-01** | Unit / Algorithm | `cycleEngine.ts` | 12 members, 12 services, Date: 1st of month | Calculates deterministic base service without overlap | ✅ PASS |
| **TC-ROT-02** | Edge Case | `cycleEngine.ts` | End of month transition (31st to 1st) | Service indices rotate continuously without index boundary errors | ✅ PASS |
| **TC-OVR-01** | Integration | Manager Dashboard | Member marked "Continuously Absent" | Member is omitted from daily calculations across all dates; fallback replacement assigned | ✅ PASS |
| **TC-STR-01** | Real-time Logic | `AshramDisciplineAudit.tsx` | Devotee slept at 10:45 PM (>10 PM curfew) | Auto-strike counter increments by +1; warning pill lights up in rose | ✅ PASS |
| **TC-STR-02** | Boundary Test | `AshramDisciplineAudit.tsx` | Devotee accumulates 3rd strike in current month | Pulsing banner "Degraded to LOTUS" triggers immediately; WhatsApp report updates | ✅ PASS |
| **TC-FIN-01** | Mathematics | `MealDashboard.tsx` | Bazar: ৳15,000, Total Meals: 300, Member Meals: 45 | Meal Rate = ৳50.00; Member Cost = ৳2,250.00; Final balance reconciles | ✅ PASS |
| **TC-MOB-01** | Responsive UI | `BottomNavBar.tsx` | Viewport width: 320px (ultra-compact mobile) | All 6 navigation items render without overlapping, clipping, or horizontal scroll | ✅ PASS |
| **TC-MOB-02** | Responsive UI | `GlobalSearchBar.tsx` | Viewport width: 360px–414px (standard Android) | 5x3 grid renders with uniform card heights and zero label truncation | ✅ PASS |

---

### 6.2 Edge Case Hardening & Fault Tolerance

1. **Leap Years & Variable Month Lengths**: Handled using native JavaScript `Date(year, month, 0).getDate()` ensuring February 28/29 and 30/31 transitions never throw off rotation indexes.
2. **Concurrent Absence Fallback Exhaustion**: If more than 7 devotees are absent simultaneously, the engine gracefully alerts the manager rather than crashing or assigning duplicate services.
3. **Offline Sync Conflict Resolution**: When local changes occur while offline, `localDb.ts` assigns unique client UUIDs and applies "Last Write Wins" (LWW) resolution based on UTC ISO-8601 timestamps upon cloud re-synchronization.

---

## 7. Phase 5: Build Automation, CI/CD & Deployment Pipeline

```mermaid
flowchart TD
    A[Git Commit to master] --> B[Static Linting: oxlint]
    B --> C[TypeScript Compilation: tsc -b]
    C --> D[Vite Production Build: vite build]
    D --> E[PWA Asset Generation & Workbox Precaching]
    E --> F[Capacitor Native Sync: npx cap sync android]
    F --> G[Gradle Native Compilation: ./gradlew assembleDebug]
    G --> H[Final APK Output: Advaita-VOICE-Hub-v9.apk]
    H --> I[Production Release & Distribution]
```

### 7.1 Production Build Metrics
- **Build Tool**: Vite 8.2 with Rollup code-splitting.
- **Build Duration**: `~4.60 seconds`.
- **Precached Assets**: 87 entries (~2.49 MB) managed by Workbox service workers.
- **Asset Optimization**: High-efficiency chunk splitting separating vendor libraries (`lucide-react`, `@supabase/supabase-js`, `jspdf`, `html2canvas`) from application pages to maximize browser cache longevity.

### 7.2 Native Android Compilation Pipeline
- **Target SDK**: Android 14 (API Level 34).
- **Minimum SDK**: Android 7.0 (API Level 24).
- **Gradle Tasks**: 136 actionable tasks executed cleanly in 5.0 seconds.
- **Output Artifact**: `Advaita-VOICE-Hub-v9.apk` (15.7 MB standalone debug package).

---

## 8. Phase 6: Security, Role-Based Access Control & Governance

The platform employs a defense-in-depth security model to safeguard sensitive devotee personal information and ashram financial records:

```
+-------------------------------------------------------------------------+
|                    APPLICATION SECURITY ARCHITECTURE                    |
+-------------------------------------------------------------------------+
| 1. Authentication Layer    | Supabase JWT Auth with persistent sessions |
+----------------------------+--------------------------------------------+
| 2. Authorization Layer     | Strict Role-Based Access Control (RBAC):   |
|                            | - ADMIN: Full system access                |
|                            | - INTERNAL_MANAGER: Roster & strike edits  |
|                            | - COUNSELOR: Sadhana & profile audits      |
|                            | - MEMBER: Personal log entry only          |
+----------------------------+--------------------------------------------+
| 3. Transport Security      | Enforced HTTPS / TLS 1.3 encryption        |
+----------------------------+--------------------------------------------+
| 4. Database Security       | PostgreSQL Row-Level Security (RLS) rules  |
+----------------------------+--------------------------------------------+
| 5. Input Sanitization      | DOMPurify on dynamic strings & rich notices|
+-------------------------------------------------------------------------+
```

---

## 9. Phase 7: Production Metrics, Business Impact & Resume Highlights

### 9.1 Quantified Operational Impact
- **100% Elimination of Paper Ledgers**: Transitioned all daily seva logs, sadhana scorecards, and mess expense calculations to automated real-time digital pipelines.
- **95% Reduction in Manager Scheduling Overhead**: What previously took internal managers 30–45 minutes of daily manual tallying and WhatsApp drafting is now executed automatically in **under 5 seconds** with one tap.
- **Zero Financial Discrepancies**: Dynamic meal-rate proration eliminated month-end meal bill calculation disputes across resident devotees and visiting guests.
- **Enhanced Spiritual Accountability**: Live disciplinary strike tracking elevated on-time 4:00 AM wake-up and Mangalarati attendance rates across the resident cohort.

---

### 9.2 Engineering Resume / Portfolio Bullet Points

> **Full-Stack / Mobile Software Engineer | Advaita VOICE Hub**  
> *React 19 • TypeScript • Vite • Tailwind CSS • Supabase • Capacitor • Android • PostgreSQL*
>
> - **Architected and delivered an enterprise-grade cross-platform community management ecosystem (PWA & Native Android)** supporting residential students, managers, and directors with 100% operational uptime.
> - **Engineered a deterministic cyclical scheduling engine in TypeScript** utilizing modular arithmetic and fallback priority cascade algorithms to automate 12-day seva rotations and multi-day absence routing.
> - **Implemented an automated disciplinary audit system** executing real-time rule infraction monitoring (wake-up punctuality, bedtime curfew, service compliance) with automatic strike calculation and dynamic WhatsApp report generation.
> - **Built a comprehensive dining hall attendance and financial ledger suite** with dynamic prorated meal-rate algorithms, bKash/Nagad reconciliation, and client-side vector PDF statement export (`html2canvas` & `jsPDF`).
> - **Designed a responsive mobile-first UI system** featuring an edge-to-edge 5×3 fixed-size quick-navigation grid, 6-tab fixed bottom navigation bar, native device haptic integration (`@capacitor/haptics`), and offline-first caching via Workbox Service Workers.
> - **Orchestrated a fast, automated local CI/CD pipeline** compiling production Vite web bundles in under 5 seconds and packaging native Android APKs via Gradle and Capacitor.

---

**Certified by Lead Engineer:**  
*Gian Juti Tripura*  
*B.Sc. in Computer Science & Engineering, University of Chittagong*  
*Advaita VOICE Technology Division*

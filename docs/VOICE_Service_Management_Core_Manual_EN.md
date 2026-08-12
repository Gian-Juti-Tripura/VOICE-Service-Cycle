# VOICE Service Management: Core System Manual

This manual provides a comprehensive overview of the technical architecture, mathematical logic, and automation systems powering the VOICE Service Management application.

---

## 1. System Overview & Architecture
The VOICE Service Management app is a modern web application designed to eliminate the need for physical service charts. 

* **Frontend:** React with TypeScript, providing a fast, type-safe user interface. TailwindCSS is used for responsive, glassmorphism-inspired UI design.
* **Backend / Database:** Supabase (PostgreSQL), storing members, services, and daily assignment overrides. 
* **State Management:** All complex assignment logic happens in real-time on the client using the `cycleEngine.ts`. The server only stores the foundational definitions.

---

## 2. The Core Logic: Deterministic Rotation Engine
The most powerful aspect of this system is that **it does not store daily schedules in the database**. Storing a new schedule every day for years would bloat the database and make modifications extremely difficult.

Instead, the system uses a **Deterministic Mathematical Engine**. 

### The Formula
To determine exactly which service a member is doing on *any* given day, the system uses this modulo equation:
```typescript
const activeServicesCount = services.length; 
const rawServiceNum = ((member.cycleOrder + dayOfMonth + 3) % activeServicesCount) + 1;
```
### How it works:
1. **Cycle Order:** Every member is assigned a permanent `cycleOrder` (e.g., 0 to 12, representing all 13 members).
2. **Day Offset:** The system looks at the current day of the month (`dayOfMonth`).
3. **Modulo Math (`%`):** By adding the member's order to the day of the month and wrapping it around the total number of active services (`activeServicesCount`), the system guarantees that everyone shifts forward by exactly one slot every single night at midnight.
4. **Dynamic Scaling:** Because the math uses the *dynamic* count of active services, you can add or remove services at any time, and the engine will instantly adapt the rotation without breaking.

---

## 3. Absence Management & Overrides
While the base schedule is purely mathematical, the real world requires exceptions. This is handled via the `assignment_overrides` database table.

When a Manager marks a member as "Absent", a record is created in the database containing:
* `date`: The specific day of the absence.
* `memberId`: The person who is absent.
* `status`: "ABSENT".

When the application loads, it generates the mathematical base schedule, and then **overlays** the database overrides on top of it to identify who is missing today.

---

## 4. Automation & Edge-Case Handling (The Dynamic Shift Algorithm)

When people are absent, their critical services must still be performed. The system automates this delegation without requiring manual manager input.

### The Fallback Priority List
The system maintains a strict priority order of services that are designated as "Fallback Candidates" (meaning the people assigned to these services have lighter duties and can take on extra work).
* **Priority Order:** `[Service 10, Service 4, Service 6, Service 11, Service 2, Service 8, Service 7]`

### Handling Cascading Absences
The most complex edge case occurs when a designated fallback person is *also* absent (a "cascading absence"). For example, if the 1st Absent person is supposed to be covered by the person on Service 10, but the person on Service 10 is *also* absent, who covers the 1st Absent person?

To solve this, the engine uses the **Dynamic Shift Algorithm**:

1. **Identify Missing Services:** The engine gathers a list of all services that were supposed to be performed by the absent members.
2. **Build the Available Replacements Pool:** The engine scans the Fallback Priority List. It explicitly **filters out** anyone who is absent today. The remaining people form the "Available Replacements" pool.
3. **Dynamic Assignment Execution:** 
   * The 1st missing service is assigned to the 1st person in the Available Replacements pool.
   * The 2nd missing service is assigned to the 2nd person in the pool.
   * This continues until all missing services are covered.

**Result:** The system acts like a fluid pipeline. If a backup person is missing, the system simply shifts the extra duties down to the next available backup person, guaranteeing that no critical service is ever dropped.

---

## 5. Member Account Linking (Self-Selection)
When a new user signs into the app via authentication (e.g., Google or Email), their auth account is initially disconnected from their physical member profile in the database.

**The Solution:**
When an unlinked user accesses the Member Dashboard, the system identifies that they have no linked profile. It then queries the database for all member profiles that do not yet have an associated `userId`. 
The user is presented with a dropdown list of these unlinked names. When they select their name and click "Link Account", the system permanently binds their authentication ID to that specific member row in the Supabase database. From then on, they instantly see their personalized dashboard upon login.

-- ==============================================================================
-- ADVAITA VOICE DIGITAL HUB - PRODUCTION POSTGRESQL SCHEMA (SUPABASE)
-- University of Chittagong & ISKCON Nandankanan
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Members & Devotee Profiles Table
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    dob TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'INTERNAL_MANAGER', 'ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    cycle_order INTEGER NOT NULL DEFAULT 0,
    counselor_name TEXT,
    scale_id INTEGER DEFAULT 2 CHECK (scale_id IN (1, 2, 3, 4)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Safely ensure ALL columns exist even if table was created in an older schema version
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS spiritual_name TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS institute TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS guardian_number TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS national_id TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS role_badge TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS nectar_drops JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'MEMBER';
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS cycle_order INTEGER DEFAULT 0;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS counselor_name TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS scale_id INTEGER DEFAULT 2;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- 3. Services Table (12 Seva Slots)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    desc_bn TEXT,
    desc_en TEXT,
    timing TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Assignment Overrides Table (Service Cycle Replacements & Absences)
CREATE TABLE IF NOT EXISTS public.assignment_overrides (
    id TEXT PRIMARY KEY,
    date_str TEXT NOT NULL, -- YYYY-MM-DD or 'CONTINUOUS'
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'ABSENT', 'REPLACED')),
    absence_reason TEXT,
    replacement_member_id TEXT REFERENCES public.members(id) ON DELETE SET NULL,
    manager_id TEXT,
    timestamp BIGINT NOT NULL DEFAULT extract(epoch from now())::bigint
);

-- 5. Sadhana Logs Table (Scales 1-4 Daily Logs)
CREATE TABLE IF NOT EXISTS public.sadhana_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    member_id TEXT REFERENCES public.members(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    scale_id INTEGER NOT NULL DEFAULT 2,
    
    -- Scores & Breakdown
    body_score INTEGER NOT NULL DEFAULT 0,
    body_avg INTEGER NOT NULL DEFAULT 0,
    soul_score INTEGER NOT NULL DEFAULT 0,
    soul_avg INTEGER NOT NULL DEFAULT 0,
    seva_score INTEGER NOT NULL DEFAULT 0,
    others_score INTEGER NOT NULL DEFAULT 0,
    grand_total INTEGER NOT NULL DEFAULT 0,
    percentage INTEGER NOT NULL DEFAULT 0,
    
    -- Detailed Metrics
    to_bed_time TEXT,
    wake_up_time TEXT,
    day_sleep_min INTEGER,
    japa_finish_time TEXT,
    sp_book_reading_min INTEGER,
    lecture_hearing_min INTEGER,
    study_academic_min INTEGER,
    cleaning_done BOOLEAN DEFAULT true,
    follow_up_count INTEGER DEFAULT 0,
    btg_count INTEGER DEFAULT 0,
    
    notes TEXT,
    counselor_feedback TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, log_date)
);

-- 6. Personal Study Notes (Linked to 854 Syllabus Items)
CREATE TABLE IF NOT EXISTS public.study_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    topic_title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, topic_id)
);

-- 7. Department Action Tasks (Study Care, Kitchen, Festivals, Preaching)
CREATE TABLE IF NOT EXISTS public.department_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id TEXT NOT NULL, -- 'study_care', 'kitchen', 'festivals', 'preaching'
    title TEXT NOT NULL,
    description TEXT,
    incharge_name TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT false,
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -- 8. Announcements & Notifications (Top Navbar Feed)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    desc_bn TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'ANNOUNCEMENT' CHECK (type IN ('SEVA', 'EKADASHI', 'STUDY', 'ANNOUNCEMENT')),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Daily Meal Attendance & Guest Overrides
CREATE TABLE IF NOT EXISTS public.meal_overrides (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    date_str DATE NOT NULL,
    breakfast BOOLEAN NOT NULL DEFAULT true,
    lunch BOOLEAN NOT NULL DEFAULT true,
    dinner BOOLEAN NOT NULL DEFAULT true,
    is_guest BOOLEAN NOT NULL DEFAULT false,
    guest_count INTEGER NOT NULL DEFAULT 0,
    is_ekadashi_fasting BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(member_id, date_str)
);

-- 10. Daily & Monthly Bazar Expenses
CREATE TABLE IF NOT EXISTS public.bazar_entries (
    id TEXT PRIMARY KEY,
    date_str DATE NOT NULL,
    month_str TEXT NOT NULL, -- YYYY-MM
    buyer_name TEXT NOT NULL,
    buyer_member_id TEXT REFERENCES public.members(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('VEGETABLES', 'GRAINS_DAL', 'DAIRY_GHEE', 'SPICES_OIL', 'GAS_FUEL', 'CLEANING', 'FEAST_SPECIAL', 'OTHER')),
    items_detail TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    receipt_image_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Devotee Meal Deposits & Payments
CREATE TABLE IF NOT EXISTS public.meal_payments (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    date_str DATE NOT NULL,
    month_str TEXT NOT NULL, -- YYYY-MM
    payment_method TEXT NOT NULL DEFAULT 'CASH' CHECK (payment_method IN ('CASH', 'BKASH', 'NAGAD', 'BANK', 'OTHER')),
    trx_id TEXT,
    note TEXT,
    received_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Devotee Balance Adjustments (Surplus/Due carry-forwards)
CREATE TABLE IF NOT EXISTS public.balance_adjustments (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('CREDIT', 'DEBIT')),
    date_str DATE NOT NULL,
    month_str TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Student Ashram Discipline Registry (VOICE & Lotus Groups)
CREATE TABLE IF NOT EXISTS public.discipline_students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    group_type TEXT NOT NULL CHECK (group_type IN ('VOICE', 'LOTUS')),
    phone TEXT,
    cycle_order INTEGER DEFAULT 0,
    monthly_strikes INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'WARNED', 'DEMOTION_DUE', 'DISMISSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Daily Morning Wake-up & Program Discipline Logs
CREATE TABLE IF NOT EXISTS public.daily_discipline_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES public.discipline_students(id) ON DELETE CASCADE,
    date_str DATE NOT NULL,
    slept_on_time BOOLEAN NOT NULL DEFAULT true,
    woke_up_on_time BOOLEAN NOT NULL DEFAULT true,
    morning_program_on_time BOOLEAN NOT NULL DEFAULT true,
    reason TEXT,
    is_emergency BOOLEAN DEFAULT false,
    reported_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, date_str)
);

-- 15. DYS Course Enrollments & Certifications
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    member_id TEXT REFERENCES public.members(id) ON DELETE SET NULL,
    course_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'CERTIFIED')),
    completed_sessions INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 6,
    exam_score NUMERIC(5, 2),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

-- 16. Residential Youth Camps & Retreat Registrations
CREATE TABLE IF NOT EXISTS public.camp_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    member_id TEXT REFERENCES public.members(id) ON DELETE SET NULL,
    camp_id TEXT NOT NULL,
    devotee_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    blood_group TEXT,
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'SPONSORED')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sadhana_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bazar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balance_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_discipline_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_registrations ENABLE ROW LEVEL SECURITY;

-- Read policies: Public read for ashram residents
DROP POLICY IF EXISTS "Public read for members" ON public.members;
CREATE POLICY "Public read for members" ON public.members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for services" ON public.services;
CREATE POLICY "Public read for services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for overrides" ON public.assignment_overrides;
CREATE POLICY "Public read for overrides" ON public.assignment_overrides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for announcements" ON public.announcements;
CREATE POLICY "Public read for announcements" ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for department tasks" ON public.department_tasks;
CREATE POLICY "Public read for department tasks" ON public.department_tasks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for meal overrides" ON public.meal_overrides;
CREATE POLICY "Public read for meal overrides" ON public.meal_overrides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for bazar entries" ON public.bazar_entries;
CREATE POLICY "Public read for bazar entries" ON public.bazar_entries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for meal payments" ON public.meal_payments;
CREATE POLICY "Public read for meal payments" ON public.meal_payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for balance adjustments" ON public.balance_adjustments;
CREATE POLICY "Public read for balance adjustments" ON public.balance_adjustments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for discipline students" ON public.discipline_students;
CREATE POLICY "Public read for discipline students" ON public.discipline_students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for discipline logs" ON public.daily_discipline_logs;
CREATE POLICY "Public read for discipline logs" ON public.daily_discipline_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for course enrollments" ON public.course_enrollments;
CREATE POLICY "Public read for course enrollments" ON public.course_enrollments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for camp registrations" ON public.camp_registrations;
CREATE POLICY "Public read for camp registrations" ON public.camp_registrations FOR SELECT USING (true);

-- Authenticated write policies: Members can update their own data
DROP POLICY IF EXISTS "Users can manage own sadhana logs" ON public.sadhana_logs;
CREATE POLICY "Users can manage own sadhana logs" ON public.sadhana_logs FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own study notes" ON public.study_notes;
CREATE POLICY "Users can manage own study notes" ON public.study_notes FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own course enrollments" ON public.course_enrollments;
CREATE POLICY "Users can manage own course enrollments" ON public.course_enrollments FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own camp registrations" ON public.camp_registrations;
CREATE POLICY "Users can manage own camp registrations" ON public.camp_registrations FOR ALL USING (auth.uid() = user_id);

-- General authenticated/manager writes
DROP POLICY IF EXISTS "Manage overrides" ON public.assignment_overrides;
CREATE POLICY "Manage overrides" ON public.assignment_overrides FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage members" ON public.members;
CREATE POLICY "Manage members" ON public.members FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage services" ON public.services;
CREATE POLICY "Manage services" ON public.services FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage department tasks" ON public.department_tasks;
CREATE POLICY "Manage department tasks" ON public.department_tasks FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage announcements" ON public.announcements;
CREATE POLICY "Manage announcements" ON public.announcements FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage meal overrides" ON public.meal_overrides;
CREATE POLICY "Manage meal overrides" ON public.meal_overrides FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage bazar entries" ON public.bazar_entries;
CREATE POLICY "Manage bazar entries" ON public.bazar_entries FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage meal payments" ON public.meal_payments;
CREATE POLICY "Manage meal payments" ON public.meal_payments FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage balance adjustments" ON public.balance_adjustments;
CREATE POLICY "Manage balance adjustments" ON public.balance_adjustments FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage discipline students" ON public.discipline_students;
CREATE POLICY "Manage discipline students" ON public.discipline_students FOR ALL USING (true);

DROP POLICY IF EXISTS "Manage discipline logs" ON public.daily_discipline_logs;
CREATE POLICY "Manage discipline logs" ON public.daily_discipline_logs FOR ALL USING (true);

-- ==============================================================================
-- REALTIME REPLICATION (Instant WebSocket Push to Devotee Phones)
-- ==============================================================================

DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.assignment_overrides;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.department_tasks;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.meal_overrides;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.bazar_entries;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.meal_payments;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.balance_adjustments;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.discipline_students;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_discipline_logs;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.course_enrollments;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.camp_registrations;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- ==============================================================================
-- INITIAL SEED DATA (Advaita VOICE Chittagong University)
-- ==============================================================================

-- Initial 12 Services (Physical Seva Chart)
INSERT INTO public.services (id, name_bn, name_en, desc_bn, desc_en, timing) VALUES
('1', 'আরতি এবং শৃঙ্গার নিবেদন', 'Offering Arati & Sringer', 'আরতি এবং শৃঙ্গার নিবেদন।', 'Offering Arati & Sringer', '6:00 AM'),
('2', 'ভোগ নিবেদন (+ সেবা ৫ অনুপস্থিত)', 'Offering Bhogo (+ 5th Absent)', 'ভোগ নিবেদন (সেবা ৫ এর অবর্তমানে)', 'Offering Bhogo (Fallback for Service 5)', 'Complete before 8 AM'),
('3', 'রাতে বাসন মাজা + মঙ্গল আরতি কীর্তন + রুম পরিষ্কার', 'Cleaning utensils at night + Mangal Arati Kirton + Room', 'রাতে বাসন মাজা + মঙ্গল আরতি কীর্তন + রুম পরিষ্কার', 'Cleaning utensils at night + Mangal Arati Kirton + Room cleaning', 'Night'),
('4', 'আগামী সকালের জন্য রাতে সবজি প্রস্তুত করা (+ সেবা ২ অনুপস্থিত)', 'Preparing veg at night for morning (+ 2nd Absent)', 'আগামী সকালের জন্য রাতে সবজি প্রস্তুত করা (সেবা ২ এর অবর্তমানে)', 'Preparing vegetables at night for next morning (Fallback for Service 2)', 'Night'),
('5', 'বাসন মাজা + প্রসাদ হল পরিষ্কার + প্রাতরাশ', 'Cleaning utensils + Prasad hall + Breakfast', 'বাসন মাজা + প্রসাদ হল পরিষ্কার + প্রাতরাশ সেবা', 'Cleaning utensils + Prasad hall cleaning + Breakfast service', 'Before 8:00 AM'),
('6', 'আগামী সকালের জন্য রাতে সবজি কাটা + ধোয়া (+ সেবা ৩ অনুপস্থিত)', 'Making veg at night for morning + Wash (+ 3rd Absent)', 'আগামী সকালের জন্য রাতে সবজি কাটা + সবজি ধোয়া (সেবা ৩ এর অবর্তমানে)', 'Making vegetables at night for next morning + Washing veg (Fallback for Service 3)', 'Night'),
('7', 'দুপুরের প্রসাদ সেবা + বাসন সংগ্রহ', 'Lunch service + Gather utensils', 'দুপুরের প্রসাদ সেবা + বাসন সংগ্রহ', 'Lunch service + Gather utensils', '8:00 AM - 2:00 PM'),
('8', 'বারান্দা পরিষ্কার + ঠাকুর ঘর পরিষ্কার (+ সেবা ৬ অনুপস্থিত)', 'Veranda cleaning + Deities room (+ 6th Absent)', 'বারান্দা পরিষ্কার + ঠাকুর ঘর পরিষ্কার (সেবা ৬ এর অবর্তমানে)', 'Veranda cleaning + Deities room cleaning (Fallback for Service 6)', 'Before 10:00 AM'),
('9', 'সকালে রান্না করা', 'Cooking in the morning', 'সকালে রান্না করা', 'Cooking in the morning', '5:30 AM - 8:30 AM'),
('10', 'রাতের প্রসাদ সেবা + প্রসাদ হল + বাসন মাজা (+ সেবা ১ অনুপস্থিত)', 'Dinner service + Prasad hall + Utensils (+ 1st Absent)', 'রাতের প্রসাদ সেবা + প্রসাদ হল পরিষ্কার + বাসন মাজা (১ম অনুপস্থিত ব্যক্তির জন্য)', 'Dinner service + Prasad hall cleaning + Utensils cleaning (Fallback for 1st Absent)', 'Night'),
('11', 'রাতের জন্য সবজি কাটা + ধোয়া (+ সেবা ৪ অনুপস্থিত)', 'Making veg for night + Wash (+ 4th Absent)', 'রাতের জন্য সবজি কাটা + ধোয়া (সেবা ৪ এর অবর্তমানে)', 'Making vegetables for night + Wash (Fallback for Service 4)', 'Evening'),
('12', 'রাতে রান্না করা + শয়ন + নৃসিংহ আরতি কীর্তন', 'Cooking at night + Shayan + Nrisimha Arati Kirton', 'রাতে রান্না করা + শয়ন + নৃসিংহ আরতি কীর্তন', 'Cooking at night + Shayan + Nrisimha Arati Kirton', 'Enter Before 7:00 PM')
ON CONFLICT (id) DO UPDATE SET
    name_bn = EXCLUDED.name_bn,
    name_en = EXCLUDED.name_en,
    desc_bn = EXCLUDED.desc_bn,
    desc_en = EXCLUDED.desc_en,
    timing = EXCLUDED.timing,
    is_active = true;

-- Initial Active Announcements
INSERT INTO public.announcements (title_en, title_bn, desc_en, desc_bn, type, is_pinned) VALUES
('🌸 Daily Seva Roster Published', '🌸 আজকের সেবাক্রম প্রকাশিত হয়েছে', 'Please check your seva duty and timing for today in the Service Cycle.', 'সার্ভিস সাইকেলে আজকের সেবা ও সময়সূচি দেখে নিন।', 'SEVA', true),
('📅 Upcoming Ekadashi Fasting', '📅 আসন্ন একাদশী ব্রত ও পারণ', 'Annada Ekadashi is approaching. Fasting from grains & beans. Parana timings inside.', 'আসন্ন অন্নদা একাদশী ব্রত। শস্য বর্জন ও পারণ সময়সূচি জেনে নিন।', 'EKADASHI', false),
('📖 Study Care Notice (Gian Juti Tripura)', '📖 স্টাডি কেয়ার বিজ্ঞপ্তি (জ্ঞান জ্যোতি ত্রিপুরা)', 'Semester exam revision circle meeting this Saturday at 8:00 PM.', 'সেমিস্টার পরীক্ষার রিভিশন সার্কেল মিটিং আগামী শনিবার রাত ৮:০০ টায়।', 'STUDY', true)
ON CONFLICT (id) DO NOTHING;

-- Initial Study Care Tasks
INSERT INTO public.department_tasks (department_id, title, incharge_name, is_done) VALUES
('study_care', 'Finalize CU Semester Exam Revision Circles timetable', 'Gian Juti Tripura + Pranto C Das', true),
('study_care', 'Arrange BCS & Bank Job GK & Math weekly quiz', 'Gian Juti Tripura + Pranto C Das', false),
('study_care', 'Check daily university academic study attendance logs (2 hrs minimum)', 'Gian Juti Tripura + Pranto C Das', true),
('study_care', 'Provide library passes and quiet study hall schedules for devotees', 'Gian Juti Tripura + Pranto C Das', false)
ON CONFLICT (id) DO NOTHING;

-- 1. Senior Mentor & Counselor (HG Rasvihari KC Das - Not in student daily service cycle)
INSERT INTO public.members (id, full_name, spiritual_name, phone, email, dob, address, blood_group, department, institute, guardian_number, national_id, service_type, role_badge, cycle_order, role) VALUES
('dev_caretaker', 'H.G Rasvihari Krishna Chandra Das', 'Rasvihari Krishna Chandra Das', '01875835986', 'rasvihari.voice@gmail.com', '1985-04-14', 'Chittagong', 'O+', 'VOICE Caretaker & Senior Mentor', 'ISKCON Chittagong / University of Chittagong', '01875835986', '1985159823412', 'Counselor & Senior Mentor', 'VOICE Caretaker', -1, 'ADMIN')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    spiritual_name = EXCLUDED.spiritual_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    service_type = EXCLUDED.service_type,
    role_badge = EXCLUDED.role_badge,
    cycle_order = -1,
    role = 'ADMIN';

-- 2. Exactly 12 Active Student Devotees in Daily Service Cycle (cycle_order 0 to 11)
INSERT INTO public.members (id, full_name, spiritual_name, phone, email, dob, address, blood_group, department, institute, guardian_number, national_id, service_type, role_badge, cycle_order, role) VALUES
('member_0', 'UTPOL P.', 'Utpol Das', '01790839891', 'utpol.acce.cu@gmail.com', '2001-09-18', 'Rajshahi', 'A+', 'ACCE', 'University of Chittagong', '01712000000', '2001769823451', 'IYF (VOICE Coordinator)', 'VOICE Coordinator', 0, 'INTERNAL_MANAGER'),
('member_1', 'CHAITANYA P.', 'Chaitanya Das', '01331982443', 'bappi.sanskrit.cu@gmail.com', '2003-11-02', 'Panchagarh', 'A+', 'Sanskrit', 'University of Chittagong', '01331000000', '2003159876999', 'IYF', 'Youth Member', 1, 'MEMBER'),
('member_2', 'GIAN P.', 'Gianjyoti Das', '01571328549', 'gianjuti.csecu@gmail.com', '2002-11-25', 'Khagrachari', 'B+', 'CSE', 'University of Chittagong', '01550000000', '2002159823009', 'IYF (Digital & IT Incharge)', 'IT & Digital Seva', 2, 'ADMIN'),
('member_3', 'PRANTO P.', 'Pranto Krishna Das', '01609302008', 'pranto.cse.cu@gmail.com', '2003-02-14', 'Gazipur', 'AB+', 'CSE', 'University of Chittagong', '01609000000', '2003159876777', 'IYF', 'Technical Support', 3, 'MEMBER'),
('member_4', 'SANGA P.', 'Sangakara Krishna Das', '01722711849', 'sangakara.chem.cu@gmail.com', '2001-12-05', 'Jashor', 'B+', 'Chemistry', 'University of Chittagong', '01722000000', '2001159876222', 'IYF', 'Kitchen & Prasadam Seva', 4, 'MEMBER'),
('member_5', 'DIPEN P.', 'Dipendra Das', '01320903062', 'dipendra.philo.cu@gmail.com', '2002-07-08', 'Thakurgaon', 'O+', 'Philosophy', 'University of Chittagong', '01320000000', '2002159876111', 'IYF', 'Philosophical Study', 5, 'MEMBER'),
('member_6', 'ANKON P.', 'Ankan Das', '01933503979', 'ankan.socio.cu@gmail.com', '2002-01-20', 'Feni', 'O+', 'Sociology', 'University of Chittagong', '01933000000', '2002159876333', 'IYF', 'IYF Seva Member', 6, 'MEMBER'),
('member_7', 'ANTOR P.', 'Antor Das', '01704370139', 'antor.sanskrit.cu@gmail.com', '2003-04-15', 'Gaibandha', 'O+', 'Sanskrit', 'University of Chittagong', '01704000000', '2003159876444', 'IYF', 'Morning Program Seva', 7, 'MEMBER'),
('member_8', 'ROTON P.', 'Roton Das', '01750504601', 'roton.sanskrit.cu@gmail.com', '2002-10-10', 'Rangpur', 'B+', 'Sanskrit', 'University of Chittagong', '01750000000', '2002159876666', 'IYF', 'Study Care Incharge', 8, 'MEMBER'),
('member_9', 'JOY S. P.', 'Utshab Das', '01734550288', 'utshab.joy.cu@gmail.com', '2002-08-28', 'Mymensingh', 'O+', 'Sanskrit', 'University of Chittagong', '01734000000', '2002159876555', 'IYF', 'Kirtan & Bhajan Seva', 9, 'MEMBER'),
('member_10', 'JOYKANT P.', 'Joykanto Das', '01754034183', 'joykanto.sanskrit.cu@gmail.com', '2002-06-18', 'Thakurgaon', 'B+', 'Sanskrit', 'University of Chittagong', '01754000000', '2002159876888', 'IYF', 'Temple Cleanliness Seva', 10, 'MEMBER'),
('member_11', 'BAPPI C. P.', 'Bappi Das', '01331982443', 'bappi.sanskrit.cu@gmail.com', '2003-11-02', 'Panchagarh', 'A+', 'Sanskrit', 'University of Chittagong', '01331000000', '2003159876999', 'IYF', 'Youth Member', 11, 'MEMBER')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    spiritual_name = EXCLUDED.spiritual_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    dob = EXCLUDED.dob,
    address = EXCLUDED.address,
    blood_group = EXCLUDED.blood_group,
    department = EXCLUDED.department,
    institute = EXCLUDED.institute,
    guardian_number = EXCLUDED.guardian_number,
    national_id = EXCLUDED.national_id,
    service_type = EXCLUDED.service_type,
    role_badge = EXCLUDED.role_badge,
    cycle_order = EXCLUDED.cycle_order,
    role = EXCLUDED.role;

-- Initial Discipline Students (VOICE & Lotus Groups - Matching the 12 active students)
INSERT INTO public.discipline_students (id, name, group_type, phone, cycle_order, monthly_strikes, status) VALUES
('member_0', 'UTPOL P.', 'VOICE', '+880 1790-839891', 0, 0, 'ACTIVE'),
('member_1', 'CHAITANYA P.', 'VOICE', '+880 1331-982443', 1, 0, 'ACTIVE'),
('member_2', 'GIAN P.', 'VOICE', '+8801571328549', 2, 0, 'ACTIVE'),
('member_3', 'PRANTO P.', 'LOTUS', '+880 1609-302008', 3, 0, 'ACTIVE'),
('member_4', 'SANGA P.', 'LOTUS', '+880 1722-711849', 4, 0, 'ACTIVE'),
('member_5', 'DIPEN P.', 'VOICE', '01571422381', 5, 0, 'ACTIVE'),
('member_6', 'ANKON P.', 'VOICE', '01933503979', 6, 0, 'ACTIVE'),
('member_7', 'ANTOR P.', 'VOICE', '+880 1704-370139', 7, 0, 'ACTIVE'),
('member_8', 'ROTON P.', 'VOICE', '+880 1750-504601', 8, 0, 'ACTIVE'),
('member_9', 'JOY S. P.', 'VOICE', '+880 1734-550288', 9, 0, 'ACTIVE'),
('member_10', 'JOYKANT P.', 'VOICE', '+880 1754-034183', 10, 0, 'ACTIVE'),
('member_11', 'BAPPI C. P.', 'VOICE', '+880 1799-100306', 11, 0, 'ACTIVE')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    group_type = EXCLUDED.group_type,
    phone = EXCLUDED.phone,
    cycle_order = EXCLUDED.cycle_order,
    status = EXCLUDED.status;

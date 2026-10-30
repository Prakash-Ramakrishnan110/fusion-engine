-- =====================================================
-- Fusion Engine Technology - Seed Data
-- supabase/seed.sql
-- =====================================================

-- 1. Seed 1 Super Admin Profile (User ID: admin, email: admin@portal.internal)
-- Default temporary password set with must_change_password flag
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@portal.internal',
    crypt('Admin@TempPass123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"user_id":"admin","full_name":"Super Admin"}',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, user_id, full_name, role, department, phone, must_change_password)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'Super Admin',
    'admin',
    'Executive Leadership',
    '+91 98765 43210',
    true
) ON CONFLICT (id) DO NOTHING;

-- 2. Project Templates (Restaurant Management SaaS seeded as a reusable Template, not hardcoded project)
INSERT INTO project_templates (id, name, description, default_modules, default_milestones) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Restaurant Management SaaS Template',
    'Enterprise multi-tenant restaurant automation suite: QR table ordering, live KOT sync, POS counter billing, and inventory tracking.',
    '[
        {"name": "Restaurant Onboarding & Multi-Branch Catalog", "description": "Branch setup, tax configs, menu categories", "budget_weight_pct": 15, "sort_order": 1},
        {"name": "QR-Code Table Ordering & Guest Self-Service", "description": "Dynamic encrypted table QR, digital menu, mobile order queue", "budget_weight_pct": 20, "sort_order": 2},
        {"name": "Kitchen Order Ticket (KOT) Real-Time Sync", "description": "Live socket kitchen display, station routing, acoustic alerts", "budget_weight_pct": 20, "sort_order": 3},
        {"name": "POS Counter Billing & GST Thermal Invoicing", "description": "Split billing, CGST/SGST calculations, thermal 80mm ESC/POS print", "budget_weight_pct": 20, "sort_order": 4},
        {"name": "Table Reservations & Dynamic Floorplan Map", "description": "Seating grid layout, slot reservation manager", "budget_weight_pct": 10, "sort_order": 5},
        {"name": "Inventory Control & Recipe Ingredient Tracking", "description": "Raw ingredient deductions per dish served, low-stock reorder", "budget_weight_pct": 15, "sort_order": 6}
    ]'::jsonb,
    '[
        {"name": "Milestone 1: Architecture, UI/UX & DB Schema", "percentage": 20, "review_window_days": 5},
        {"name": "Milestone 2: Backend REST/GraphQL APIs & Auth", "percentage": 30, "review_window_days": 5},
        {"name": "Milestone 3: Frontend Implementation & Workflows", "percentage": 30, "review_window_days": 5},
        {"name": "Milestone 4: E2E Testing, CI/CD & Handover", "percentage": 20, "review_window_days": 5}
    ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 3. Default Commission Rules
INSERT INTO commission_rules (trigger, amount_or_pct, is_percentage, active) VALUES
('qualified_lead', 500.00, false, true),
('demo', 1000.00, false, true),
('closed_deal', 10.00, true, true);

-- 4. Default Sales Scripts
INSERT INTO sales_scripts (title, body, type, sort_order) VALUES
('15-Second Opening Hook', 'Hello, am I speaking with the Owner or General Manager of [Restaurant Name]? My name is [Telecaller Name] from Fusion Engine Technology. We build high-speed QR table ordering and live kitchen KOT display software that cuts order wait times by 40% and saves 18-25% on POS software subscriptions.', 'pitch', 1),
('Pain Point Probe Questions', 'During peak weekend dinner hours, do your captains ever face delays in sending tickets to the kitchen, or do customers complain about having to wait just to get a physical menu card? How is your current system handling multi-branch ingredient inventory deductions?', 'probe', 2),
('Objection: "We already use Petpooja / Posist"', 'Many of our top clients switched because legacy POS charges steep yearly renewals for add-on tablets and locks you into proprietary hardware. Our QR ordering is browser-native with zero extra tablet rental costs.', 'objection', 3),
('Objection: "Customers prefer physical paper menus"', 'We support hybrid dining! Guests can browse paper or scan the table QR code to add extra drinks and desserts directly to the kitchen without waiting for busy waiters.', 'objection', 4),
('Demo Close Proposition', 'I would love to set up a quick 10-minute online screen demo with our tech team this Friday. Would 3:00 PM or 5:00 PM suit your schedule better?', 'pitch', 5);

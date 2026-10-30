# Fusion Engine Technology
## Internal Workforce, Project and Lead Management System
### Software Requirements Specification (SRS) — Version 1.0

**Organization:** Fusion Engine Technology  
**Website:** [https://fusionengine.in](https://fusionengine.in/)  
**Document Purpose:** Development handover, internal operations, freelancer recruitment, task management, sales lead tracking, compensation records, and business documentation.

---

## 1. Project Overview
Fusion Engine Technology requires a centralized internal management platform to coordinate software developers, telecallers, project managers, and administrators.

The system must support the complete workflow from recruitment and project creation to task assignment, progress verification, lead management, compensation approval, and document storage.

The platform will initially support the development of the company's flagship **Restaurant Management SaaS** and later expand to other software products and client projects.

### Primary Objectives
- Manage employees, freelancers, and telecallers from one unified dashboard.
- Assign tasks with clear requirements, deadlines, and acceptance deliverables.
- Track work progress, commit/PR evidence, and verify completed tasks.
- Manage telecaller leads and measure lead quality and conversion.
- Calculate developer project payments based on agreed milestone deliverables.
- Calculate telecaller compensation according to agreed qualified lead or conversion commission models.
- Store contracts, completed work, invoices, reports, and payment records.
- Maintain an auditable history of approvals, changes, and financial reconciliations.

---

## 2. User Roles and Access Control
The platform provides separate login credentials and granular permissions for each user role:

### 2.1 Super Admin / Founder
The founder has complete operational and administrative control over the organization.
- Create and manage user accounts.
- Approve recruitment applications and onboarding.
- Create projects and assign project managers.
- Create tasks, assign developers, and set deadlines.
- Review and approve submitted work and deliverables.
- Manage leads, lead sources, and sales targets.
- Approve compensation calculations and payments.
- Access financial reports, company registrations, and business documents.
- Configure roles, permissions, compensation rules, and system settings.
- View the complete activity and immutable audit logs.

### 2.2 Project Manager / Team Leader
- View assigned projects and team members.
- Break projects into milestones, tasks, and subtasks.
- Assign tasks to authorized team members.
- Monitor progress, blockers, and overdue work.
- Review work submissions and request revisions.
- Recommend milestone completion for admin approval.
- Generate project progress and velocity reports.
- *Restriction:* Project managers cannot approve their own financial payments unless explicitly authorized by the administrator.

### 2.3 Software Developer
- View assigned projects and tasks.
- Access requirements, designs, and technical documentation.
- Update task status and progress percentages.
- Submit GitHub pull requests, commits, screenshots, test results, and deployment URLs.
- Record work logs and report blockers.
- Submit completed milestones for review.
- View approved compensation terms and milestone payment status.
- *Restriction:* Developers cannot approve their own work or alter approved payment records.

### 2.4 Telecaller / Sales Executive
- View assigned leads and contact information required for their outreach.
- Record calls, follow-ups, objections, and customer responses.
- Update lead status (New, Contacted, Qualified, Demo Scheduled, Converted).
- Schedule callbacks and maintain pipeline notes.
- Submit leads for qualification review.
- View accepted leads, agreed compensation, and payment status.
- Access assigned pitch scripts and product collateral.
- *Restriction:* Telecallers cannot approve their own leads or change compensation rates.

### 2.5 Finance / Accounts User (Future Expansion)
- View approved payment requests.
- Record payment dates, amounts, and bank transaction references (UTR/IMPS).
- Maintain invoices, tax deduction records, and payment receipts.
- Generate payment disbursement and reconciliation reports.
- *Restriction:* Financial users cannot alter task completion or lead acceptance decisions without separate authorization.

---

## 3. Admin Dashboard
A consolidated view of company operations:
- **Project Metrics:** Active projects, projects completed, overall health.
- **Task Metrics:** Tasks pending, overdue, awaiting review, returned for revision.
- **Workforce Metrics:** Active developers, active telecallers, hours/deliverables logged.
- **Sales & Lead Metrics:** Leads assigned, qualified leads, demos scheduled, customer conversions.
- **Financial Metrics:** Milestones awaiting payment approval, approved payments pending release, total approved compensation, total paid compensation.
- **Filters:** By Date Range, Project, Team Member, Department, Task Status, Lead Status, Payment Status.

---

## 4. Employee and Freelancer Management
### Recruitment Workflow
1. Admin creates job opening.
2. Applicant submits application (via public Career Portal).
3. Admin reviews application, portfolio, GitHub, and screening notes.
4. Applicant is shortlisted or rejected.
5. Selected applicant receives offer letter or contractor agreement.
6. Required agreements (NDA, IP Assignment, Contractor Terms) are acknowledged and signed.
7. Admin creates active platform account with assigned role.

### Engagement Types
- Full-Time Employee
- Part-Time Employee
- Freelance Contractor (Deliverable-based)
- Project-Based Contractor (Milestone-based)
- Sales / Telecalling Contractor (Lead/Commission-based)

---

## 5. Initial Internal Project: Restaurant Management SaaS
- **Scope:**
  - Restaurant onboarding & branch configuration
  - Digital menu & catalog management
  - QR-code table ordering & guest self-service
  - Table reservations & seating management
  - Kitchen Order Ticket (KOT) management
  - Point-of-Sale (POS) counter billing & receipts
  - Inventory management & recipe ingredient tracking
  - Sales analytics, tax reports, and performance metrics

---

## 6. Task Assignment, Progress & Deliverable Versioning
### Task Statuses
`Backlog` -> `Assigned` -> `In Progress` -> `Blocked` -> `Submitted for Review` -> `Changes Requested` -> `Approved` -> `Completed`

### Deliverable Version History & Review Rules
- **Non-Destructive Submissions:** When a developer submits work that is returned for revisions (`Changes Requested`), the system archives **Submission v1** (PR link, commit hash, test proofs, feedback notes) and enables **Submission v2**. Historical iterations are permanently preserved to prevent scope disputes.
- **Dual-Gate Approval Process:**
  - **Gate 1 (Technical Verification):** The Technical Lead or Reviewer verifies the GitHub Pull Request, test pass results, and staging build → Marks task `Approved`.
  - **Gate 2 (Financial Disbursement):** The Founder / Admin reviews the approved milestone, verifies the written contract, generates the official voucher (`FET-MS-2026-XXXX`), and records the Bank/UPI UTR transaction reference → Marks status `Paid`.

---

## 7. Developer Compensation: Milestone-Based Model
Transparent milestone contracts agreed upon before work commences.

### Standard Percentage Milestone Breakdown
Compensation is allocated across structured deliverable gates rather than hardcoded figures:
| Milestone | Deliverable Scope | Standard Allocation | Review Window |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | Approved UI/UX designs, system architecture & database schema | **20%** | 5 Business Days |
| **Milestone 2** | Backend REST/GraphQL APIs, database migrations & authentication | **30%** | 5 Business Days |
| **Milestone 3** | Frontend implementation, core workflows, and state management | **30%** | 5 Business Days |
| **Milestone 4** | End-to-end testing, documentation, deployment & handover | **20%** | 5 Business Days |
| **Total** | **Full Scope Delivery** | **100% Agreed Salary** | **Full Handover** |

---

## 8. Telecaller Compensation: Lead & Conversion Models
### Supported Models
- **Model A (Default):** Fixed agreed incentive per accepted qualified lead.
- **Model B:** Agreed commission per converted paying customer.
- **Model C:** Base retainer plus incentive per qualified lead or conversion.

### Strict Verification Rules
- Lead must be a real, verifiable business with reachable contact details.
- Lead must meet written qualification criteria (e.g., operating restaurant/business looking for digital solutions).
- Zero payment for duplicate, invalid, or unverified leads.
- No self-approval by telecallers.

---

## 8.1 Admin CSV Lead Feeder, Contact Locking & Client Update Forms
To maximize telecalling efficiency and prevent duplicate calls to the same prospect:

### 1. Admin Bulk CSV Lead Import
- Admin can upload `.csv` or `.xlsx` lead sheets containing prospective business records (`Business Name`, `Contact Person`, `Phone Number`, `Category`, `City/District`, `Source`).
- System performs automated phone number validation and duplicate checks against the database before adding contacts to the unassigned pool.

### 2. Exclusive Contact Locking (Zero Conflict Calling)
- When a telecaller is assigned or claims a batch of contacts (e.g., 10 contacts):
- **Real-Time Lock:** As soon as a telecaller selects or opens a contact to make a call, the system places an **exclusive in-progress lock** on that contact.
- **Conflict Prevention:** Other telecallers see the contact as `Locked / In-Progress` and are unable to select or call it, preventing embarrassing duplicate outreach to the same business.

### 3. Post-Call Client Update Form
- Upon concluding the call, the telecaller completes the structured **Client Interaction Form**:
  - **Call Outcome:** `Interested` | `Callback Scheduled` | `Demo Requested` | `Not Interested` | `Invalid/Wrong Number` | `Unreachable`.
  - **Business Pain Points:** Key client requirements (e.g., needs POS billing, wants QR ordering, current software issues).
  - **Decision-Maker Verified:** Checkbox confirming contact is the Owner, General Manager, or authorized buyer.
  - **Next Follow-up:** Date and time picker for callback reminders.
  - **Qualification Request:** If qualified, the telecaller submits the lead for Admin verification, which triggers Gate 1 review and unlocks incentive eligibility upon approval.
- Submitting the form releases the lock, updates the client CRM history, and automatically advances the telecaller to the next contact.

---

## 9. Document Management & Compliance (Startup India & MSME Standards)
The system organizes documentation into:
- **Company Documents:** Udyam MSME Certificate, Startup India DPIIT recognition, GST/PAN records.
- **Recruitment Documents:** Job descriptions, offer letters, freelance contracts, NDAs, IP assignments.
- **Project Documents:** SRS, PRDs, UI designs, API documentation, repository references.
- **Financial Documents:** Milestone acceptance records, invoices, payment vouchers, transaction references.
- **Sales Documents:** Call scripts, qualified lead records, demo logs, client conversion contracts.
- **Immutable Audit Trail:** Append-only log recording actor, action, timestamp, and before/after payloads for all approvals and financial releases.

---

## 10. Implementation Roadmap
- **Phase 1:** Core Portal Shell, Authentication, Roles & Founder Persona Switcher.
- **Phase 2:** Admin Project & Task Management (Restaurant SaaS 6 modules).
- **Phase 3:** Developer Workspace, Kanban Board & Non-Destructive Versioned Submissions.
- **Phase 4:** Admin CSV Lead Feeder, Exclusive Contact Locking & Telecaller Pipeline CRM.
- **Phase 5:** Dual-Gate Milestone Approvals, Official Voucher Generator (`FET-MS-2026-XXXX`) & Incentive Payouts.
- **Phase 6:** Document Vault, Immutable Audit Logs, and Analytics Reports.

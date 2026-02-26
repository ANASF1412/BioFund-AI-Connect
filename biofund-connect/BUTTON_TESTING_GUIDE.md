# BioFund Connect - Button Testing Guide

## Overview
This guide documents all buttons in the BioFund Connect application and their expected behavior.

## Test Accounts
- **Admin** - admin@test.com / 123456
- **Investor** - investor@test.com / 123456
- **NGO** - ngo@test.com / 123456

## Database Status
✅ **Database seeded with:**
- 5 users (Admin, Investor, 3 NGOs)
- 16 projects across all categories
- Coverage: Forest, Wildlife, Water, Agriculture
- Statuses: Approved, Pending, Completed

---

## TESTING CHECKLIST

### 1. AUTHENTICATION BUTTONS
- [ ] **Register Button** (Home page)
  - Navigate to /register
  - Fill form and submit
  - Should redirect to login

- [ ] **Login Button**
  - Navigate to /login
  - Enter credentials (admin@test.com / 123456)
  - Should authenticate and redirect to dashboard

- [ ] **Logout Button** (in Navbar)
  - Click logout
  - Should clear auth and redirect to home

---

### 2. INVESTOR PAGE BUTTONS

#### Explore Projects Page (/investor/explore)
- [ ] **Fund Button** (on each approved project card)
  - Click "Fund" button
  - Should open FundingModal
  - Enter amount and submit
  - Should show success notification
  - currentAmount should increase
  - fundingCount should increment

- [ ] **Project Card Click**
  - Click on project title/card
  - Should navigate to ProjectDetail page

- [ ] **Filter Buttons**
  - Filter by Forest
  - Filter by Wildlife
  - Filter by Water
  - Filter by Agriculture
  - Should show only matching projects

- [ ] **Search/Sort** (if implemented)
  - Test search functionality
  - Test sort by funding

#### Project Detail Page (/investor/projects/:id)
- [ ] **Fund Button**
  - Enter funding amount
  - Click Fund
  - Should submit and show success

- [ ] **Download Report Button** (if funded projects show ESG report)
  - Click "Download Report"
  - Should generate/download PDF

- [ ] **Back/Navigate Button**
  - Should return to Explore Projects

#### My Investments Page (/investor/investments)
- [ ] **View Project Button**
  - Click on investment entry
  - Should navigate to project detail

- [ ] **Withdrawal/Action Buttons** (if implemented)
  - Should allow managing investments

#### Impact Tracker Page (/investor/impact)
- [ ] **View Break-down Button** (if implemented)
  - Should show impact metrics
  - Trees planted, Water saved, Wildlife protected

---

### 3. NGO PAGE BUTTONS

#### Dashboard (/ngo/dashboard)
- [ ] **Launch Campaign Button**
  - Opens modal or navigates to campaign creation
  - Should create new project

- [ ] **Edit Project Button**
  - Opens edit form for existing project
  - Should update project details

- [ ] **Delete Project Button** (if available)
  - Should remove project
  - Should ask for confirmation

---

### 4. ADMIN PAGE BUTTONS

#### Dashboard (/admin/dashboard)
- [ ] **Manage Projects Button**
  - Navigate to /admin/projects

- [ ] **Manage Users Button**
  - Navigate to /admin/users

#### Manage Projects (/admin/projects)
- [ ] **Approve Button** (Pending projects)
  - Changes status from Pending to Approved
  - Should show success notification
  - Project should appear in Investor Explore page

- [ ] **Reject Button** (Pending projects)
  - Changes status from Pending to Rejected
  - Should show confirmation
  - Project should be hidden from Investors

- [ ] **Edit Button**
  - Opens project edit form
  - Should update project

- [ ] **View Details Button**
  - Shows full project information

#### Manage Users (/admin/users)
- [ ] **Ban/Suspend Button** (if implemented)
  - Should disable user account

- [ ] **Role Change Button** (if implemented)
  - Should update user role

- [ ] **Delete User Button** (if implemented)
  - Should remove user

---

### 5. NOTIFICATION BUTTONS

- [ ] **Notification Bell Icon** (Navbar)
  - Click notification icon
  - Should show notifications dropdown
  - Should show notifications for fund transfers, approvals

- [ ] **Clear Notification Button** (if available)
  - Should mark as read or delete

- [ ] **Notification Link**
  - Should navigate to relevant page

---

### 6. UI INTERACTION BUTTONS

- [ ] **Modal Close Button (X)**
  - Should close modal and clear form

- [ ] **Modal Submit Button**
  - Should validate form
  - Should submit data
  - Should show success message

- [ ] **Cancel Button**
  - Should close modal without changes

- [ ] **Edit Button**
  - Should toggle edit mode
  - Should show save/cancel buttons

---

## EXPECTED BEHAVIORS

### Success Notifications
- Fund transfer: "Successfully funded project!"
- Project approval: "Project approved successfully"
- Project creation: "Project created successfully"

### Error Handling
- Insufficient funds: "Insufficient funds for this transaction"
- Invalid form: "Please fill all required fields"
- Duplicate email: "Email already exists"

### Navigation
- After fund: Stay on page with updated data
- After login: Redirect to dashboard
- After submit: Close modal, refresh list

---

## TEST DATA DISTRIBUTION

### Forest Projects (3 total)
1. Save the Amazon - Approved - $15k/$50k funded
2. Boreal Forest Protection - Approved - $32k/$35k funded
3. Rainforest Tech Monitoring - Pending - $5k/$55k funded

### Wildlife Projects (3 total)
1. African Elephant Conservation - Approved - $45k/$60k funded
2. Polar Bear Research - Approved - $65k/$80k funded
3. Coral Reef Restoration - Approved - $30k/$75k funded

### Water Projects (3 total)
1. Clean Ocean Initiative - Approved - $55k/$90k funded
2. River Restoration - Approved - $24k/$40k funded
3. Mangrove Forest Expansion - Pending - $8k/$45k funded
4. Wetland Conservation - Approved - $28k/$35k funded

### Agriculture Projects (4 total)
1. Sustainable Farming - Approved - $18k/$30k funded
2. Agroforestry - Approved - $15k/$25k funded
3. Renewable Energy for Schools - Completed - $20k/$20k funded
4. Desert Greening - Pending - $10k/$70k funded

---

## NOTES FOR TESTERS

1. **Admin must approve pending projects** before investors can see them
2. **Fund amounts** auto-calculate progress bar (currentAmount / goalAmount)
3. **Completed projects** show in History but have read-only status
4. **Role-based visibility**: Only admins see Approve/Reject, Only NGOs see Edit/Delete
5. **Impact metrics** should update as projects are funded
6. **ESG scores** calculated from tree, water, wildlife impacts

---

## SUCCESS CRITERIA

✅ All navigation buttons work and redirect correctly
✅ All form submissions validate and process data
✅ All status changes (Fund, Approve, Reject) reflect in database
✅ All notifications appear on action completion
✅ No console errors during any button interactions
✅ All project data displays correctly on filtered views
✅ Pagination works if data exceeds 10 items
✅ User role prevents access to unauthorized buttons

---

## QUICK TESTING FLOW

1. **Login as Investor** → Explore Projects
2. Click **Fund** button on any approved project
3. Enter amount ($1000+) and submit
4. Check **My Investments** page - should show funded project
5. Check **Impact Tracker** - should show metrics
6. **Logout** → Login as **Admin**
7. Go to **Manage Projects**
8. Click **Approve** on pending projects
9. Go to **Manage Users** - verify user list loads
10. **Logout** → Login as **NGO**
11. Go to **NGO Dashboard**
12. Check project list - should show only own projects
13. Test **Edit/Delete** if implemented

---

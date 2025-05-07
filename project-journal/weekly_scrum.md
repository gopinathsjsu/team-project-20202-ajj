# 📘 Weekly Scrum Report – BookTable Project

**Team Members:** Abdul Muqtadir Mohammed, Jainam Chhatbar  
**Project Duration:** 6 Sprints  
**Roles Implemented:** Customer, Admin  
**Roles Skipped:** Restaurant Manager (not implemented)

---

## ✅ Sprint 1 – Setup & Planning

### Abdul Muqtadir Mohammed
- **What did I complete?**
  - Set up React project structure and routing
  - Created initial wireframes for Home, Search, and Booking Confirmation pages
- **What will I do next?**
  - Implement search filters and restaurant listing UI
- **Blocked by:**
  - Waiting on backend API schema from Jainam

### Jainam Chhatbar
- **What did I complete?**
  - Set up Spring Boot backend, PostgreSQL schema, and project structure
  - Created base entities and repositories for Restaurant and Customer
- **What will I do next?**
  - Implement registration/login APIs and search endpoint
- **Blocked by:**
  - None

---

## ✅ Sprint 2 – Core Customer Features

### Abdul
- **What did I complete?**
  - Developed SearchResultsPage and RestaurantCard component
  - Implemented clickable time-slot buttons (+/- 30 min) for booking
- **What will I do next?**
  - Build BookingConfirmationPage and link to reservation flow
- **Blocked by:**
  - Booking API connection pending from backend

### Jainam
- **What did I complete?**
  - Created REST APIs for table booking and cancellation
  - Added error handling, validation, and basic auth middleware
- **What will I do next?**
  - Finalize JWT-based login and start Admin APIs
- **Blocked by:**
  - Frontend booking UI for integration

---

## ✅ Sprint 3 – Authentication & Booking Completion

### Abdul
- **What did I complete?**
  - Built RegisterPage and LoginPage UI
  - Integrated JWT flow with frontend (localStorage + redirect)
- **What will I do next?**
  - Add prefill logic for confirmation page and SMS/email simulation
- **Blocked by:**
  - None

### Jainam
- **What did I complete?**
  - Completed login/auth APIs with JWT
  - Enabled user-specific booking history retrieval
- **What will I do next?**
  - Create Admin dashboard analytics API
- **Blocked by:**
  - None

---

## ✅ Sprint 4 – Admin Functionality & Analytics

### Abdul
- **What did I complete?**
  - Final polish for customer-side UI (responsive layout, input validation)
  - Helped create UI layout for Admin dashboard charts
- **What will I do next?**
  - Assist with analytics integration, finalize email/SMS logic
- **Blocked by:**
  - None

### Jainam
- **What did I complete?**
  - Created Admin login and reservation analytics endpoint (group by day)
  - Added mock restaurant approval/delete APIs
- **What will I do next?**
  - Test admin dashboard in UI and prepare deployment setup
- **Blocked by:**
  - None

---

## ✅ Sprint 5 – AWS Deployment

### Abdul
- **What did I complete?**
  - Deployed frontend to AWS EC2 and verified with backend
  - Setup domain routing, tested search and booking flow live
- **What will I do next?**
  - Finalize README and prepare for demo
- **Blocked by:**
  - Backend HTTPS config from Jainam

### Jainam
- **What did I complete?**
  - Deployed backend and PostgreSQL on EC2
  - Setup NGINX, verified secure APIs, created backup scripts
- **What will I do next?**
  - Final backend testing, help Abdul with docs
- **Blocked by:**
  - None

---

## ✅ Sprint 6 – Final Testing & Documentation

### Abdul
- **What did I complete?**
  - Compiled UI wireframes and project screenshots
  - Documented weekly scrum logs, XP values, burndown links
  - Final polish of user flow and demo recording
- **What will I do next?**
  - Submit everything on GitHub and prep demo talking points
- **Blocked by:**
  - None

### Jainam
- **What did I complete?**
  - Final testing of Admin features and analytics display
  - Reviewed and cleaned up backend codebase
  - Helped write deployment and usage notes for README
- **What will I do next?**
  - Demo day preparation
- **Blocked by:**
  - None

---

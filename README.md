
# 🍽️ 📖 BookTable – End-to-End Restaurant Reservation System

A web-based table reservation platform inspired by OpenTable. This project allows customers to search for restaurants, book tables, view reviews, and manage their bookings. Admin users can view analytics and manage listings. The system is built using **React**, **Spring Boot**, **PostgreSQL**, and deployed to **AWS EC2**.

---

## 👥 Team

| Member                     | Major Contributions                                             |
|---------------------------|------------------------------------------------------------------|
| **Abdul Muqtadir Mohammed** | Frontend (Search UI, Booking Confirmation, Register/Login), Email/SMS flow, Final UI polish |
| **Jainam Chattbar**         | Backend (APIs for Auth, Booking, Admin Dashboard), DB schema, Deployment on AWS |

---

## 🧩 Features Implemented

### 👤 For Customers
- Search restaurants by date, time, party size, and city/zip
- View restaurant cards with clickable available time slots (±30 mins)
- Register/Login using JWT
- Book a table and receive a confirmation (email/SMS mocked)
- Cancel a reservation
- View restaurant location and reviews

### 👨‍💼 For Admins
- Admin login (JWT)
- Approve/remove restaurant listings (mock logic)
- View reservation analytics dashboard (past month)

### 🛠️ Deployment
- Spring Boot backend + PostgreSQL on AWS EC2
- React frontend on AWS EC2
- APIs exposed via public endpoints, protected with JWT

---

## 📅 Scrum Artifacts

- ✅ 6 Sprint backlogs (Google Sheets)
- ✅ 6 Sprint burndown charts (tracked per sprint tab)
- ✅ Weekly scrum reports per member
- ✅ XP values (Communication + Simplicity)

📎 [📊 Sprint Tracking Sheet (Google Sheets)](https://docs.google.com/spreadsheets/d/1zMABJQMWXGkG3-ncUaIRX_ld5xB1YDD3TeNBe9Ild4c/edit?usp=sharing)

---

## 📘 Project Journal

- [📝 Weekly Scrum Report](./project-journal/weekly_scrum.md)
- [💡 XP Core Values Summary](./project-journal/xp_core_values.md)
- [📸 Sprint Task Board Screenshot](./project-journal/sprint_taskboard.PNG)

---

## 🎨 UI Wireframes

All core UI screens are wireframed and stored in:
📁 `/docs/ui-wireframes/`
| Screen                         | Link |
|-------------------------------|----------------|
| 🔍 Search Page                | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/search_page_wireframe.png)
| 🏠 Restaurant Detail Page     | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/restaurant_detail_wireframe.png)
| ✅ Booking Confirmation Page  | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/booking_confirmation_wireframe.png)
| 🎉 Booking Success Page       | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/booking_reservation_wireframe.png)
| 🔐 Login Page                 | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/login_wireframe.png)
| 📝 Register Page              | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/register_wireframe.png)
| 🧑‍💼 Admin Dashboard          | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/admin_dashboard_wireframe.png)
| 📊 Admin Analytics            | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/admin_analytics_wireframe.png)
| 🗃️ Admin Archived View        | [View](https://github.com/gopinathsjsu/team-project-20202-ajit-main/blob/main/docs/ui-wireframes/archive_restaurants_wireframe.png)

---

---

## 🧱 Architecture Diagrams

📁 `/docs/diagrams/`
- [🧩 Component Diagram](./docs/diagrams/Component_Diagram.jpeg)
- [🌐 Deployment Diagram](./docs/diagrams/Deployment_diagram.png)

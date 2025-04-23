
# 🍽️ BookTable

BookTable is a full-stack web application for discovering and reserving tables at top restaurants — inspired by OpenTable. Built with **React**, **Spring Boot**, and **PostgreSQL**, this app enables customers to search, book, and manage reservations, while restaurant managers can control listings and view bookings.

---

## 🚀 Features

### 🔑 Authentication
- JWT-based login/register
- Role-based access: `CUSTOMER`, `MANAGER`, `ADMIN`

### 👥 Customer Portal
- Search restaurants by date, time, party size, and location/cuisine
- View restaurant details, images, and map
- Book tables (get SMS confirmation)
- Cancel bookings

### 👨‍🍳 Restaurant Manager Dashboard
- Add/edit restaurant listings
- Upload photos, description, price range
- View bookings for their restaurant

### 🛠 Admin Portal
- Approve/delete restaurants
- View all bookings

---

## 💻 Tech Stack

| Frontend       | Backend        | Database     | Other             |
|----------------|----------------|--------------|-------------------|
| React.js       | Spring Boot    | PostgreSQL   | Twilio (SMS)      |
| React Router   | Spring Security|              | Google Maps Embed |
| CSS            | JWT Auth       |              | GitHub Actions (CI/CD ready) |

---

## 🗂 Folder Structure

```
booktable-project/
│
├── frontend/          # React app
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/           # Spring Boot app
│   ├── restaurant-api/
│   └── pom.xml
```

---

## 🧪 Getting Started

### 🔧 Backend

```bash
cd backend/restaurant-api
./mvnw spring-boot:run
```

Make sure PostgreSQL is running and credentials are set in `application.properties`.

---

### 💻 Frontend

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

---

## 📷 Screenshots

> Add screenshots of:
> - Home/Search Page
> - Booking confirmation
> - Restaurant details page
> - Admin/Manager dashboard

---

## 👨‍👩‍👧‍👦 Team

- Abdul Muqtadir
- Jainam chhatbar
- Add GitHub links

---

## 🛡 License

This project is licensed under MIT.

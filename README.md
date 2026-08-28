# Student Management Projects

A collection of Student Management projects developed using **Node.js, Express.js, MySQL, HTML, CSS, and JavaScript**.

This repository contains multiple projects developed as part of internship preparation and practical backend/frontend development.

---

## 📂 Projects

### Project 1 — Student Management Backend

A RESTful backend application for managing student records using **Node.js, Express.js, and MySQL**.

#### Features

* Create a new student
* Get all students
* Get a student by ID
* Update student details
* Delete a student
* Input validation
* Duplicate email handling
* Search students by name or department
* Pagination
* Sorting
* Environment variable configuration
* Proper HTTP status codes and error handling

#### Technologies

* Node.js
* Express.js
* MySQL
* mysql2
* express-validator
* dotenv
* Postman / Thunder Client

#### Location

```text
Project-1/
```

Project-specific documentation is available in:

```text
Project-1/README.md
```

---

### Project 2 — Student Management System

An enhanced Student Management System with a **RESTful backend and frontend web interface**.

The project extends the student management functionality by adding **course management, dashboard, reports, settings, and a user-friendly frontend interface**.

#### Features

* Student management
* Course management
* Create, read, update, and delete operations
* Student search
* Course search
* Pagination
* Sorting
* Input validation
* Duplicate email handling
* Dashboard
* Reports
* Settings
* Frontend interface
* MySQL database integration
* RESTful API
* Error handling
* Environment variable configuration

#### Technologies

* Node.js
* Express.js
* MySQL
* mysql2
* express-validator
* dotenv
* HTML5
* CSS3
* JavaScript
* Postman / Thunder Client

#### Project Structure

```text
Project-2/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── studentController.js
│   ├── studentValidation.js
│   └── courseController.js
│
├── routes/
│   ├── studentRoutes.js
│   └── courseRoutes.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── students.html
│   ├── courses.html
│   ├── reports.html
│   └── settings.html
│
├── screenshots/
├── postman/
├── package.json
├── server.js
└── README.md
```

#### Location

```text
Project-2/
```

Project-specific documentation is available in:

```text
Project-2/README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/bindushri709/student-management-backend.git
```

Move into the repository:

```bash
cd student-management-backend
```

Each project has its own `package.json` and dependencies.

For example:

```bash
cd Project-2
npm install
```

Create a `.env` file inside the project and configure the MySQL connection:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=student_management
```

Start the server:

```bash
node server.js
```

The application runs on:

```text
http://localhost:5000
```

---

## 🗄️ Database

The projects use **MySQL** for storing student and course information.

Student information includes fields such as:

* ID
* Name
* Email
* Department
* Semester

Project 2 additionally includes course-related information such as:

* Course ID
* Course Name
* Course Code
* Department
* Credits

---

## 🔐 Security

Sensitive database credentials are stored using environment variables.

The following files/directories are excluded from Git:

```text
node_modules/
.env
```

---

## 📸 API Testing

API endpoints were tested using **Postman / Thunder Client**.

Testing includes:

* GET requests
* POST requests
* PUT requests
* DELETE requests
* Input validation
* Search
* Pagination
* Sorting

Screenshots are available inside the respective project folders.

---

## 👩‍💻 Author

**Bindu Shri N**

Student Management projects developed for **internship preparation and practical software development experience**.

---

## 🔗 GitHub Repository

**Student Management Backend**

https://github.com/bindushri709/student-management-backend
---

## 🚀 Project 3 – Hospital Appointment Management System

### 🏥 Project Overview

A full-stack **Hospital Appointment Management System** developed using **React.js, Node.js, Express.js, and MongoDB**.

The application helps manage patients, doctors, departments, specializations, doctor availability, and appointments.

### ✨ Key Features

#### 👤 Patient Management
- Patient registration and login
- Patient profile management
- Search available doctors by date and time
- View doctor availability
- Book appointments
- View appointments
- Cancel appointments

#### 👨‍⚕️ Doctor Management
- Doctor registration and login
- Doctor profile management
- Add and manage availability slots
- View patient appointments
- Confirm appointments
- Complete appointments

#### 📅 Availability Management
- Create doctor availability slots
- Select date, start time, and end time
- Automatically determine the day of the week
- Search doctors based on availability
- Prevent booking unavailable slots

#### 📋 Appointment Management
- Patient appointment booking
- Doctor appointment management
- Appointment confirmation
- Appointment cancellation
- Appointment completion

### 🔐 Authentication & Security

- JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization
- Protected API routes
- Input validation
- Environment variables for sensitive information

### 🛠️ Technologies Used

**Frontend:** React.js, Vite, JavaScript, HTML, CSS

**Backend:** Node.js, Express.js, MongoDB, Mongoose

**Authentication:** JWT, bcryptjs

**Tools:** Postman, Visual Studio Code, Git, GitHub

### 🔄 Appointment Workflow

```text
Doctor Creates Availability
          ↓
Patient Searches Doctor
          ↓
Patient Books Appointment
          ↓
Doctor Confirms Appointment
          ↓
Appointment Confirmed
          ↓
Appointment Completed
📚 Learning Outcomes

Through this project, I gained practical experience in:

Full-stack web development
RESTful API development
MongoDB and Mongoose
JWT authentication
Role-based authorization
CRUD operations
API validation and error handling
React.js frontend development
Frontend and backend integration
Git and GitHub
🔗 Project Links

GitHub Repository:
https://github.com/bindushri709/Codsoft-projects/tree/main/Project-3/Hospital_Appointment_API

# Student Management Backend

A RESTful backend application for managing student records using **Node.js, Express.js, and MySQL**.

## 🚀 Features

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

## 🛠️ Technologies Used

* Node.js
* Express.js
* MySQL
* mysql2
* express-validator
* dotenv
* Thunder Client / Postman
* Git & GitHub

## 📁 Project Structure

```text
Student-management/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── studentController.js
│   └── studentValidation.js
│
├── routes/
│   └── studentRoutes.js
│
├── postman/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

```bash
cd student-management-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=student_management
```

> The `.env` file is not included in the GitHub repository for security reasons.

### 5. Start the server

```bash
node server.js
```

The server runs at:

```text
http://localhost:5000
```

## 📌 API Endpoints

| Method | Endpoint                              | Description          |
| ------ | ------------------------------------- | -------------------- |
| GET    | `/api/students`                       | Get students         |
| GET    | `/api/students/:id`                   | Get student by ID    |
| POST   | `/api/students`                       | Create student       |
| PUT    | `/api/students/:id`                   | Update student       |
| DELETE | `/api/students/:id`                   | Delete student       |
| GET    | `/api/students/search?name=Rahul`     | Search by name       |
| GET    | `/api/students/search?department=ISE` | Search by department |

## 🔎 Pagination & Sorting

Example:

```text
GET /api/students?page=1&limit=5
```

Sorting example:

```text
GET /api/students?sort=name&order=asc
```

Pagination and sorting can also be combined:

```text
GET /api/students?page=1&limit=5&sort=name&order=asc
```

## ✅ Validation

The API validates:

* Name
* Email format
* Department
* Semester (1–8)

Invalid input returns a `400 Bad Request` response.

Duplicate email addresses return:

```text
409 Conflict
```

## 🗄️ Database

The project uses **MySQL** with a `students` table containing:

* `id`
* `name`
* `email`
* `department`
* `semester`

## 🔐 Security

Database credentials are stored using environment variables.

The `.env` file and `node_modules` directory are excluded using `.gitignore`.

## 👩‍💻 Author

**Bindu Shri N**

Built as a Student Management Backend project for internship preparation.

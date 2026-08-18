````markdown
# Student Management System - Project 2

A full-stack Student Management System developed as part of the CodSoft Internship Projects.

The application provides a web-based interface for managing students and courses, viewing reports, and calculating student academic performance.

## Features

### Student Management

- Add new students
- View all students
- Update student information
- Delete students
- Student validation
- Department and semester information
- Search and manage student records

### Course Management

- Add courses
- View courses
- Update course information
- Delete courses
- Manage course details through the dashboard

### Dashboard

- Student statistics
- Course information
- Quick access to major sections
- Clean and responsive dashboard interface

### Reports

- Total student count
- CSE student count
- ISE student count
- Other department student count
- Department-wise student report
- Percentage of students by department
- Semester-wise student report

### Student Grade Calculator

The Reports section also includes an academic performance calculator.

Users can enter:

- Student name
- Roll number
- Mathematics marks
- Physics marks
- Computer Science marks
- English marks
- Programming marks

The system calculates:

- Total marks out of 500
- Average percentage
- Grade
- Pass/Fail result

### Settings

- Application settings
- Global settings support
- User interface configuration

## Technologies Used

### Backend

- Node.js
- Express.js
- MySQL

### Frontend

- HTML5
- CSS3
- JavaScript

### Development and Testing

- Git
- GitHub
- Postman
- REST API

## Project Structure

```text
Project-2/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── courseController.js
│   ├── studentController.js
│   └── studentValidation.js
│
├── routes/
│   ├── courseRoutes.js
│   └── studentRoutes.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── courses.js
│   │   ├── global-settings.js
│   │   ├── reports.js
│   │   ├── settings.js
│   │   └── students.js
│   │
│   ├── courses.html
│   ├── index.html
│   ├── reports.html
│   ├── settings.html
│   └── students.html
│
├── postman/
│
├── screenshots/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
````

## API Endpoints

### Students

```text
GET    /api/students
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

### Courses

```text
GET    /api/courses
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
```

## Database

The project uses **MySQL** as the database.

The database connection is configured in:

```text
config/db.js
```

Database credentials should be stored in the `.env` file.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
PORT=5000
```

Do not commit the `.env` file to GitHub.

## Installation

Clone the repository:

```bash
git clone https://github.com/bindushri709/Codsoft-projects.git
```

Navigate to Project-2:

```bash
cd Codsoft-projects/Project-2
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure your MySQL database.

Start the server:

```bash
node server.js
```

The application runs on:

```text
http://localhost:5000
```

## Testing with Postman

The APIs can be tested using Postman.

The project includes Postman resources and screenshots demonstrating API operations such as:

* Get students
* Create student
* Update student
* Delete student
* Validation

## Screenshots

Screenshots of API testing and application functionality are available in:

```text
screenshots/
```

## Project Highlights

This project demonstrates practical experience with:

* REST API development
* CRUD operations
* Express.js routing
* MySQL database integration
* Frontend and backend integration
* Form validation
* JavaScript DOM manipulation
* Student and course management
* Report generation
* Academic performance calculation
* API testing with Postman
* Git and GitHub version control

## Author

**Bindu Shri**

CodSoft Internship Projects

GitHub:

https://github.com/bindushri709/Codsoft-projects

```
```

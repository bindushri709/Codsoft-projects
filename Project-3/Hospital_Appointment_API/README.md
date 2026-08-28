\# 🏥 Hospital Appointment Management System



A full-stack Hospital Appointment Management System developed using \*\*Node.js, Express.js, MongoDB, and React.js\*\*.



This project allows patients to register, log in, find doctors based on their availability, book appointments, and manage their appointments. Doctors can manage their profiles, create availability slots, view appointments, and update appointment statuses.



\---



\## 📌 Project Overview



The Hospital Appointment Management System is designed to simplify the process of managing doctors, patients, availability slots, and hospital appointments.



The application provides separate functionality for:



\- 👤 Patients

\- 👨‍⚕️ Doctors

\- 🔐 Authentication

\- 📅 Availability Management

\- 🏥 Departments

\- 🩺 Specializations

\- 📋 Appointment Management



The project follows a RESTful API architecture for backend communication and uses React.js for the frontend interface.



\---



\## 🚀 Features



\### 👤 Patient Management



\- Patient registration

\- Patient login

\- Patient profile management

\- View available doctors

\- Search doctors by date and time

\- View doctor availability

\- Book appointments

\- View booked appointments

\- Cancel appointments



\### 👨‍⚕️ Doctor Management



\- Doctor registration

\- Doctor login

\- Doctor profile

\- Department and specialization

\- Experience and phone details

\- Create availability slots

\- View availability slots

\- Delete available slots

\- View patient appointments

\- Confirm appointments

\- Complete appointments

\- Cancel appointments where applicable



\### 📅 Availability Management



Doctors can create availability slots by providing:



\- Date

\- Start time

\- End time



The system automatically determines the day of the week.



Patients can search for doctors who are available at a selected date and time.



\### 📋 Appointment Management



The appointment workflow supports:



```text

Available

&#x20;   ↓

Booked

&#x20;   ↓

Confirmed

&#x20;   ↓

Completed

🔐 Authentication \& Authorization



The application uses:



JWT authentication

Password hashing using bcrypt

Role-based authorization

Protected API routes



Supported roles:



Patient

Doctor

🏥 Department \& Specialization



The system supports hospital departments and medical specializations.



Examples:



Cardiology

Pediatrics

General Medicine

Cardiologist

Pediatrician



Doctors are associated with their department and specialization.



🛠️ Technologies Used

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcryptjs

dotenv

CORS

Frontend

React.js

Vite

JavaScript

HTML

CSS

Development Tools

Visual Studio Code

Git

GitHub

Postman

MongoDB

📂 Project Structure

Hospital\_Appointment\_API/

│

├── backend/

│   │

│   ├── src/

│   │   ├── config/

│   │   │   └── db.js

│   │   │

│   │   ├── controllers/

│   │   │   ├── appointmentController.js

│   │   │   ├── availabilityController.js

│   │   │   ├── departmentController.js

│   │   │   ├── doctorController.js

│   │   │   ├── patientController.js

│   │   │   ├── specializationController.js

│   │   │   └── userController.js

│   │   │

│   │   ├── middleware/

│   │   │   ├── authMiddleware.js

│   │   │   └── errorMiddleware.js

│   │   │

│   │   ├── models/

│   │   │   ├── Appointment.js

│   │   │   ├── Availability.js

│   │   │   ├── Department.js

│   │   │   ├── Doctor.js

│   │   │   ├── Patient.js

│   │   │   ├── Specialization.js

│   │   │   └── User.js

│   │   │

│   │   └── routes/

│   │       ├── appointmentRoutes.js

│   │       ├── availabilityRoutes.js

│   │       ├── departmentRoutes.js

│   │       ├── doctorRoutes.js

│   │       ├── patientRoutes.js

│   │       ├── specializationRoutes.js

│   │       └── userRoutes.js

│   │

│   ├── server.js

│   ├── package.json

│   └── package-lock.json

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── assets/

│   │   ├── services/

│   │   │   └── api.js

│   │   ├── App.jsx

│   │   ├── App.css

│   │   ├── index.css

│   │   └── main.jsx

│   │

│   ├── index.html

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

├── package.json

└── package-lock.json

⚙️ Installation \& Setup

1\. Clone the repository

git clone https://github.com/bindushri709/Codsoft-projects.git



Navigate to Project 3:



cd Codsoft-projects/Project-3/Hospital\_Appointment\_API

2\. Install Backend Dependencies

cd backend

npm install

3\. Configure Environment Variables



Create a .env file inside the backend folder.



Example:



PORT=5000

MONGO\_URI=mongodb://127.0.0.1:27017/hospital\_appointment

JWT\_SECRET=your\_secret\_key



Do not upload your real .env file or JWT secret to GitHub.



4\. Start MongoDB



Make sure MongoDB is installed and running on your system.



The backend connects to MongoDB using Mongoose.



5\. Start the Backend



Inside the backend folder:



npm run dev



or:



node server.js



The backend runs on:



http://localhost:5000

💻 Frontend Setup



Open another terminal.



Navigate to the frontend:



cd frontend



Install dependencies:



npm install



Start the React development server:



npm run dev



The frontend will normally run on:



http://localhost:5173

🔐 Authentication Flow



The application uses JWT-based authentication.



Registration



Users can register as:



Patient

Doctor



Passwords are securely hashed using bcrypt before being stored in the database.



Login



After successful login, the server generates a JWT token.



The token is used to access protected routes.



Example JWT payload:



{

&#x20;   id: user\_id,

&#x20;   role: user\_role

}

👨‍⚕️ Doctor Workflow

Doctor Registration

&#x20;       ↓

Doctor Login

&#x20;       ↓

Doctor Dashboard

&#x20;       ↓

Create Availability

&#x20;       ↓

Patient Finds Doctor

&#x20;       ↓

Patient Books Appointment

&#x20;       ↓

Doctor Views Appointment

&#x20;       ↓

Doctor Confirms Appointment

&#x20;       ↓

Appointment Completed

👤 Patient Workflow

Patient Registration

&#x20;       ↓

Patient Login

&#x20;       ↓

Patient Dashboard

&#x20;       ↓

Select Date \& Time

&#x20;       ↓

Search Available Doctors

&#x20;       ↓

View Availability

&#x20;       ↓

Book Appointment

&#x20;       ↓

View Appointment

&#x20;       ↓

Cancel Appointment if required

🧪 Testing



The application was tested using the frontend and API testing tools.



Important workflows tested include:



Patient registration

Patient login

Patient profile

Doctor registration

Doctor login

Doctor profile

Department creation and retrieval

Specialization creation and retrieval

Doctor availability

Doctor availability search

Patient appointment booking

Patient appointment listing

Doctor appointment listing

Appointment confirmation

Appointment cancellation

Appointment completion

🔎 Doctor Availability Search



Patients can select:



Date

Time



and search for doctors who are available at that particular date and time.



The system checks the doctor's availability records and displays matching doctors.



Example:



Date: 31-08-2026

Time: 16:00



The system returns doctors whose availability covers the requested time.



🗃️ Database Models



The application uses MongoDB with the following main models:



User



Stores:



Name

Email

Password

Role

Patient



Stores:



User reference

Date of birth

Gender

Phone

Address

Doctor



Stores:



User reference

Department

Specialization

Phone

Experience

Department



Stores hospital department information.



Specialization



Stores medical specialization information.



Availability



Stores:



Doctor

Date

Day of week

Start time

End time

Booking status

Appointment



Stores:



Patient

Doctor

Department

Availability

Appointment status

Appointment date/time

🔒 Security



The project implements several security measures:



Password hashing using bcrypt

JWT authentication

Protected routes

Role-based authorization

Environment variables for sensitive configuration

Input validation

Authorization checks for doctor-specific operations



Sensitive credentials such as:



.env

JWT\_SECRET

MongoDB credentials

Passwords

JWT tokens



should never be committed to GitHub.



📡 API Modules



The backend is organized into RESTful route modules:



/api/users

/api/patients

/api/doctors

/api/departments

/api/specializations

/api/availability

/api/appointments



The exact endpoints and request bodies are implemented inside the corresponding route and controller files.



📸 Screenshots

Patient Dashboard



Add your patient dashboard screenshot here.



!\[Patient Dashboard](screenshots/patient-dashboard.png)

Doctor Dashboard



Add your doctor dashboard screenshot here.



!\[Doctor Dashboard](screenshots/doctor-dashboard.png)

Doctor Availability



Add your availability screenshot here.



!\[Doctor Availability](screenshots/doctor-availability.png)

Appointment Booking



Add your appointment booking screenshot here.



!\[Appointment Booking](screenshots/appointment-booking.png)

Appointment Management



Add your appointment management screenshot here.



!\[Appointment Management](screenshots/appointment-management.png)

🎯 Project Objectives



The main objectives of this project are:



Build a practical hospital appointment management system.

Implement RESTful backend APIs.

Learn MongoDB and Mongoose.

Implement JWT authentication.

Implement role-based authorization.

Create a responsive React frontend.

Connect frontend and backend APIs.

Manage doctor availability.

Implement appointment booking and management.

Practice Git and GitHub version control.

📚 Learning Outcomes



Through this project, I practiced:



Node.js backend development

Express.js REST API development

MongoDB database management

Mongoose schemas and relationships

JWT authentication

Password hashing

Middleware

Role-based authorization

CRUD operations

API validation

Error handling

React.js frontend development

API integration

Git and GitHub

🚧 Future Improvements



Possible future improvements include:



Admin dashboard

Doctor profile editing

Patient profile editing

Appointment notifications

Email notifications

Online consultation

Payment integration

Prescription management

Hospital admin management

Advanced doctor filtering

Deployment to cloud hosting

👩‍💻 Developer



Bindu Shri N



Web Developer



GitHub:



https://github.com/bindushri709


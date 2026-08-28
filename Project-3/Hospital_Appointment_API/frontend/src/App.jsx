import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {
  // =====================================================
  // AUTH
  // =====================================================

  const [showRegister, setShowRegister] = useState(false);

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
    department: "",
    phone: "",
    experience: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  const [message, setMessage] = useState("");

  // =====================================================
  // PATIENT
  // =====================================================

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] =
    useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);

  const [loadingAvailability, setLoadingAvailability] =
    useState(false);

  const [showAvailability, setShowAvailability] =
    useState(false);

  const [bookingSlot, setBookingSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);

  const [cancellingId, setCancellingId] = useState(null);

  // =====================================================
  // SEARCH AVAILABLE DOCTORS
  // =====================================================

  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");

  const [searchedDoctors, setSearchedDoctors] = useState([]);

  const [searchingDoctors, setSearchingDoctors] =
    useState(false);

  const [searchPerformed, setSearchPerformed] =
    useState(false);

  // =====================================================
  // DOCTOR
  // =====================================================

  const [doctorProfile, setDoctorProfile] = useState(null);

  const [doctorAppointments, setDoctorAppointments] =
    useState([]);

  const [doctorAvailability, setDoctorAvailability] =
    useState([]);

  const [loadingDoctorProfile, setLoadingDoctorProfile] =
    useState(false);

  const [loadingDoctorAppointments, setLoadingDoctorAppointments] =
    useState(false);

  const [loadingDoctorAvailability, setLoadingDoctorAvailability] =
    useState(false);

  const [showAddAvailability, setShowAddAvailability] =
    useState(false);

  const [availabilityForm, setAvailabilityForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const [creatingAvailability, setCreatingAvailability] =
    useState(false);

  const [deletingAvailabilityId, setDeletingAvailabilityId] =
    useState(null);

  const [updatingAppointmentId, setUpdatingAppointmentId] =
    useState(null);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatSlotDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    if (typeof date === "string") {
      const match = date.match(
        /^(\d{4})-(\d{2})-(\d{2})/
      );

      if (match) {
        const [, year, month, day] = match;
        return `${day}-${month}-${year}`;
      }
    }

    return "Date not available";
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post(
        "/users/login",
        loginData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setUser(response.data.user);
      setLoggedIn(true);

      setMessage(
        `Login successful! Welcome ${response.data.user.name}`
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post(
        "/users/register",
        registerData
      );

      setMessage(
        response.data.message +
          " You can now login."
      );

      setShowRegister(false);

      setLoginData({
        email: registerData.email,
        password: "",
      });

      setRegisterData({
        name: "",
        email: "",
        password: "",
        role: "patient",
        specialization: "",
        department: "",
        phone: "",
        experience: "",
        dateOfBirth: "",
        gender: "",
        address: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  // =====================================================
  // GET DOCTORS
  // =====================================================

  const fetchDoctors = async () => {
    setLoadingDoctors(true);

    try {
      const response = await API.get("/doctors");

      setDoctors(
        response.data.doctors || []
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load doctors."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  // =====================================================
  // GET PATIENT APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {
    setLoadingAppointments(true);

    try {
      const response = await API.get(
        "/appointments/my"
      );

      setAppointments(
        response.data.appointments || []
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoadingAppointments(false);
    }
  };

  // =====================================================
  // SEARCH DOCTORS BY DATE + TIME
  // =====================================================

  const searchAvailableDoctors = async () => {
    if (!searchDate || !searchTime) {
      setMessage(
        "Please select both date and time."
      );
      return;
    }

    setSearchingDoctors(true);
    setSearchPerformed(true);
    setSearchedDoctors([]);
    setMessage("");

    try {
      // Get availability for selected date
      const response = await API.get(
        `/availability?date=${searchDate}`
      );

      const slots =
        response.data.availability || [];

      // Only slots that are not booked
      const freeSlots = slots.filter(
        (slot) => {
          if (slot.isBooked) {
            return false;
          }

          // Make sure selected time falls
          // inside the doctor's available slot
          return (
            searchTime >= slot.startTime &&
            searchTime < slot.endTime
          );
        }
      );

      // Match availability slots with doctors
      const results = [];

      for (const slot of freeSlots) {
        const doctor = doctors.find(
          (d) =>
            String(d._id) ===
            String(
              slot.doctor?._id ||
                slot.doctor
            )
        );

        if (doctor) {
          results.push({
            doctor,
            slot,
          });
        }
      }

      setSearchedDoctors(results);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to search available doctors."
      );
    } finally {
      setSearchingDoctors(false);
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearDoctorSearch = () => {
    setSearchDate("");
    setSearchTime("");
    setSearchedDoctors([]);
    setSearchPerformed(false);
    setMessage("");
  };

  // =====================================================
  // VIEW DOCTOR AVAILABILITY
  // =====================================================

  const viewAvailability = async (doctor) => {
    setSelectedDoctor(doctor);
    setAvailability([]);
    setShowAvailability(true);
    setLoadingAvailability(true);
    setMessage("");

    try {
      const response = await API.get(
        `/availability?doctorId=${doctor._id}`
      );

      const slots =
        response.data.availability || [];

      const availableSlots = slots.filter(
        (slot) => slot.isBooked === false
      );

      setAvailability(availableSlots);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load availability."
      );
    } finally {
      setLoadingAvailability(false);
    }
  };

  // =====================================================
  // CLOSE AVAILABILITY
  // =====================================================

  const closeAvailability = () => {
    setShowAvailability(false);
    setSelectedDoctor(null);
    setAvailability([]);
    setBookingSlot(null);
    setReason("");
  };

  // =====================================================
  // OPEN BOOKING
  // =====================================================

  const openBooking = (slot, doctor = null) => {
    if (doctor) {
      setSelectedDoctor(doctor);
    }

    setBookingSlot(slot);
    setReason("");
    setMessage("");
  };

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleBookAppointment = async () => {
    if (!bookingSlot) {
      return;
    }

    setBooking(true);
    setMessage("");

    try {
      const response = await API.post(
        "/appointments",
        {
          availability: bookingSlot._id,
          reason:
            reason || "Regular consultation",
        }
      );

      setMessage(
        response.data.message ||
          "Appointment booked successfully"
      );

      setBookingSlot(null);
      setReason("");

      await fetchAppointments();

      if (selectedDoctor) {
        await viewAvailability(
          selectedDoctor
        );
      }

      if (searchPerformed) {
        await searchAvailableDoctors();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  // =====================================================
  // CANCEL PATIENT APPOINTMENT
  // =====================================================

  const handleCancelAppointment = async (
    appointmentId
  ) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

    if (!confirmCancel) {
      return;
    }

    setCancellingId(appointmentId);
    setMessage("");

    try {
      const response = await API.patch(
        `/appointments/${appointmentId}/cancel`
      );

      setMessage(
        response.data.message ||
          "Appointment cancelled successfully"
      );

      await fetchAppointments();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to cancel appointment."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =====================================================
  // DOCTOR PROFILE
  // =====================================================

  const fetchDoctorProfile = async () => {
    setLoadingDoctorProfile(true);

    try {
      const response = await API.get(
        "/doctors/profile"
      );

      setDoctorProfile(
        response.data.doctor || null
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load doctor profile."
      );
    } finally {
      setLoadingDoctorProfile(false);
    }
  };

  // =====================================================
  // DOCTOR APPOINTMENTS
  // =====================================================

  const fetchDoctorAppointments = async () => {
    setLoadingDoctorAppointments(true);

    try {
      const response = await API.get(
        "/appointments/doctor"
      );

      setDoctorAppointments(
        response.data.appointments || []
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load doctor appointments."
      );
    } finally {
      setLoadingDoctorAppointments(false);
    }
  };

  // =====================================================
  // DOCTOR AVAILABILITY
  // =====================================================

  const fetchDoctorAvailability = async () => {
    if (!doctorProfile?._id) {
      return;
    }

    setLoadingDoctorAvailability(true);

    try {
      const response = await API.get(
        `/availability?doctorId=${doctorProfile._id}`
      );

      setDoctorAvailability(
        response.data.availability || []
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load availability."
      );
    } finally {
      setLoadingDoctorAvailability(false);
    }
  };

  // =====================================================
  // CREATE AVAILABILITY
  // =====================================================

  const handleCreateAvailability = async (e) => {
    e.preventDefault();

    if (
      !availabilityForm.date ||
      !availabilityForm.startTime ||
      !availabilityForm.endTime
    ) {
      setMessage(
        "Please enter date, start time and end time."
      );
      return;
    }

    if (
      availabilityForm.startTime >=
      availabilityForm.endTime
    ) {
      setMessage(
        "End time must be after start time."
      );
      return;
    }

    setCreatingAvailability(true);
    setMessage("");

    try {
      const response = await API.post(
        "/availability",
        availabilityForm
      );

      setMessage(
        response.data.message ||
          "Availability created successfully."
      );

      setAvailabilityForm({
        date: "",
        startTime: "",
        endTime: "",
      });

      setShowAddAvailability(false);

      await fetchDoctorAvailability();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to create availability."
      );
    } finally {
      setCreatingAvailability(false);
    }
  };

  // =====================================================
  // DELETE AVAILABILITY
  // =====================================================

  const handleDeleteAvailability = async (
    availabilityId
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this availability?"
      );

    if (!confirmDelete) {
      return;
    }

    setDeletingAvailabilityId(
      availabilityId
    );

    setMessage("");

    try {
      const response = await API.delete(
        `/availability/${availabilityId}`
      );

      setMessage(
        response.data.message ||
          "Availability deleted successfully."
      );

      await fetchDoctorAvailability();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to delete availability."
      );
    } finally {
      setDeletingAvailabilityId(null);
    }
  };

  // =====================================================
  // UPDATE APPOINTMENT STATUS
  // =====================================================

  const handleUpdateAppointmentStatus = async (
    appointmentId,
    status
  ) => {
    setUpdatingAppointmentId(
      appointmentId
    );

    setMessage("");

    try {
      const response = await API.patch(
        `/appointments/${appointmentId}/status`,
        {
          status,
        }
      );

      setMessage(
        response.data.message ||
          "Appointment status updated successfully."
      );

      await fetchDoctorAppointments();
      await fetchDoctorAvailability();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update appointment."
      );
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (
      loggedIn &&
      user?.role === "patient"
    ) {
      fetchDoctors();
      fetchAppointments();
    }

    if (
      loggedIn &&
      user?.role === "doctor"
    ) {
      fetchDoctorProfile();
      fetchDoctorAppointments();
    }
  }, [loggedIn, user]);

  // =====================================================
  // LOAD DOCTOR AVAILABILITY
  // =====================================================

  useEffect(() => {
    if (
      loggedIn &&
      user?.role === "doctor" &&
      doctorProfile?._id
    ) {
      fetchDoctorAvailability();
    }
  }, [
    loggedIn,
    user,
    doctorProfile?._id,
  ]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedIn(false);
    setUser(null);

    setDoctors([]);
    setAppointments([]);

    setDoctorProfile(null);
    setDoctorAppointments([]);
    setDoctorAvailability([]);

    setSearchedDoctors([]);
    setSearchDate("");
    setSearchTime("");
    setSearchPerformed(false);

    setMessage("");
  };

  // =====================================================
  // LOGIN / REGISTER PAGE
  // =====================================================

  if (!loggedIn) {
    return (
      <div className="app">
        <div className="auth-card">

          <div className="header">
            <h1>
              🏥 Hospital Appointment
            </h1>

            <p>
              Healthcare Appointment Management
              System
            </p>
          </div>

          {!showRegister ? (
            <>
              <h2>Login</h2>

              <form onSubmit={handleLogin}>

                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password:
                        e.target.value,
                    })
                  }
                  required
                />

                <button type="submit">
                  Login
                </button>

              </form>

              <p className="switch-text">
                Don't have an account?

                <button
                  className="link-button"
                  onClick={() => {
                    setShowRegister(true);
                    setMessage("");
                  }}
                >
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Create Account</h2>

              <form onSubmit={handleRegister}>

                <label>Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password:
                        e.target.value,
                    })
                  }
                  required
                />

                <label>Role</label>

                <select
                  value={registerData.role}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="patient">
                    Patient
                  </option>

                  <option value="doctor">
                    Doctor
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>

                {/* DOCTOR FIELDS */}

                {registerData.role ===
                  "doctor" && (
                  <>
                    <label>
                      Specialization
                    </label>

                    <input
                      type="text"
                      placeholder="Example: Cardiologist"
                      value={
                        registerData.specialization
                      }
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          specialization:
                            e.target.value,
                        })
                      }
                      required
                    />

                    <label>
                      Department
                    </label>

                    <input
                      type="text"
                      placeholder="Example: Cardiology"
                      value={
                        registerData.department
                      }
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          department:
                            e.target.value,
                        })
                      }
                      required
                    />

                    <label>
                      Phone
                    </label>

                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={
                        registerData.phone
                      }
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          phone:
                            e.target.value,
                        })
                      }
                    />

                    <label>
                      Experience
                    </label>

                    <input
                      type="number"
                      placeholder="Years of experience"
                      value={
                        registerData.experience
                      }
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          experience:
                            e.target.value,
                        })
                      }
                    />
                  </>
                )}

                {/* PATIENT FIELDS */}

                {registerData.role ===
                  "patient" && (
                  <>
                    <label>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      value={
                        registerData.dateOfBirth
                      }
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          dateOfBirth:
                            e.target.value,
                        })
                      }
                    />

                    <label>
                      Gender
                    </label>

                    <select
                      value={
                        registerData.gender
                      }
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          gender:
                            e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Select Gender
                      </option>

                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>

                      <option value="other">
                        Other
                      </option>
                    </select>

                    <label>
                      Phone
                    </label>

                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={
                        registerData.phone
                      }
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          phone:
                            e.target.value,
                        })
                      }
                    />

                    <label>
                      Address
                    </label>

                    <input
                      type="text"
                      placeholder="Enter address"
                      value={
                        registerData.address
                      }
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          address:
                            e.target.value,
                        })
                      }
                    />
                  </>
                )}

                <button type="submit">
                  Create Account
                </button>

              </form>

              <p className="switch-text">
                Already have an account?

                <button
                  className="link-button"
                  onClick={() => {
                    setShowRegister(false);
                    setMessage("");
                  }}
                >
                  Login
                </button>
              </p>
            </>
          )}

          {message && (
            <div className="message">
              {message}
            </div>
          )}

        </div>
      </div>
    );
  }

  // =====================================================
  // PATIENT DASHBOARD
  // =====================================================

  if (user?.role === "patient") {
    return (
      <div className="dashboard">

        <header className="dashboard-header">
          <div>
            <h1>
              🏥 Hospital Appointment
            </h1>

            <p>
              Patient Dashboard
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <main className="dashboard-content">

          {/* WELCOME */}

          <div className="welcome-card">
            <h2>
              Welcome, {user?.name} 👋
            </h2>

            <p>
              Find doctors and book your
              appointments.
            </p>
          </div>

          {message && (
            <div className="dashboard-message">
              {message}
            </div>
          )}

          {/* =================================================
              SEARCH DOCTORS
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-header">
              <h2>
                🔍 Find Available Doctors
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}
            >

              <div>
                <label>
                  📅 Date
                </label>

                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) =>
                    setSearchDate(
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label>
                  🕐 Time
                </label>

                <input
                  type="time"
                  value={searchTime}
                  onChange={(e) =>
                    setSearchTime(
                      e.target.value
                    )
                  }
                />
              </div>

            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >

              <button
                className="book-button"
                onClick={
                  searchAvailableDoctors
                }
                disabled={
                  searchingDoctors
                }
              >
                {searchingDoctors
                  ? "Searching..."
                  : "🔍 Search Available Doctors"}
              </button>

              {searchPerformed && (
                <button
                  className="secondary-button"
                  onClick={
                    clearDoctorSearch
                  }
                >
                  Clear
                </button>
              )}

            </div>

            {/* SEARCH RESULTS */}

            {searchPerformed &&
              !searchingDoctors && (
                <div
                  style={{
                    marginTop: "20px",
                  }}
                >

                  <h3>
                    Available Doctors
                  </h3>

                  {searchedDoctors.length ===
                  0 ? (
                    <div className="empty-box">
                      <p>
                        No doctors are available
                        at this date and time.
                      </p>
                    </div>
                  ) : (
                    <div className="doctor-grid">

                      {searchedDoctors.map(
                        (result) => (
                          <div
                            className="doctor-card"
                            key={
                              result.slot._id
                            }
                          >

                            <div className="doctor-icon">
                              👨‍⚕️
                            </div>

                            <h3>
                              {result.doctor.user
                                ?.name ||
                                "Doctor"}
                            </h3>

                            <p>
                              <strong>
                                Specialization:
                              </strong>{" "}
                              {result.doctor
                                .specialization
                                ?.name ||
                                "N/A"}
                            </p>

                            <p>
                              <strong>
                                Department:
                              </strong>{" "}
                              {result.doctor
                                .department
                                ?.name ||
                                "N/A"}
                            </p>

                            <p>
                              <strong>
                                Date:
                              </strong>{" "}
                              {formatSlotDate(
                                result.slot.date
                              )}
                            </p>

                            <p>
                              <strong>
                                Time:
                              </strong>{" "}
                              {
                                result.slot
                                  .startTime
                              }{" "}
                              -{" "}
                              {
                                result.slot
                                  .endTime
                              }
                            </p>

                            <button
                              className="book-button"
                              onClick={() =>
                                openBooking(
                                  result.slot,
                                  result.doctor
                                )
                              }
                            >
                              Book Appointment
                            </button>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>
              )}

          </section>

          {/* =================================================
              ALL DOCTORS
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                👨‍⚕️ Available Doctors
              </h2>

              <button
                onClick={fetchDoctors}
                disabled={loadingDoctors}
              >
                {loadingDoctors
                  ? "Loading..."
                  : "Refresh"}
              </button>

            </div>

            {loadingDoctors ? (
              <p>
                Loading doctors...
              </p>
            ) : doctors.length === 0 ? (
              <p>
                No doctors found.
              </p>
            ) : (
              <div className="doctor-grid">

                {doctors.map(
                  (doctor) => (
                    <div
                      className="doctor-card"
                      key={doctor._id}
                    >

                      <div className="doctor-icon">
                        👨‍⚕️
                      </div>

                      <h3>
                        {doctor.user?.name ||
                          "Doctor"}
                      </h3>

                      <p>
                        <strong>
                          Specialization:
                        </strong>{" "}
                        {doctor.specialization
                          ?.name ||
                          "Not available"}
                      </p>

                      <p>
                        <strong>
                          Department:
                        </strong>{" "}
                        {doctor.department
                          ?.name ||
                          "Not available"}
                      </p>

                      <p>
                        <strong>
                          Experience:
                        </strong>{" "}
                        {doctor.experience ||
                          0} years
                      </p>

                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {doctor.phone ||
                          "N/A"}
                      </p>

                      <button
                        className="book-button"
                        onClick={() =>
                          viewAvailability(
                            doctor
                          )
                        }
                      >
                        View Availability
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </section>

          {/* =================================================
              PATIENT APPOINTMENTS
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                📅 My Appointments
              </h2>

              <button
                onClick={
                  fetchAppointments
                }
                disabled={
                  loadingAppointments
                }
              >
                {loadingAppointments
                  ? "Loading..."
                  : "Refresh"}
              </button>

            </div>

            {loadingAppointments ? (
              <p>
                Loading appointments...
              </p>
            ) : appointments.length ===
              0 ? (
              <p>
                You don't have any
                appointments yet.
              </p>
            ) : (
              <div className="appointment-list">

                {appointments.map(
                  (appointment) => (
                    <div
                      className="appointment-card"
                      key={appointment._id}
                    >

                      <h3>
                        {appointment.doctor?.user
                          ?.name ||
                          "Doctor"}
                      </h3>

                      <p>
                        <strong>
                          Department:
                        </strong>{" "}
                        {appointment.department
                          ?.name ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Date:
                        </strong>{" "}
                        {appointment
                          .appointmentDate
                          ? new Date(
                              appointment.appointmentDate
                            ).toLocaleString()
                          : "N/A"}
                      </p>

                      <p>
                        <strong>
                          Reason:
                        </strong>{" "}
                        {appointment.reason ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}

                        <span
                          className={`status ${appointment.status}`}
                        >
                          {appointment.status}
                        </span>
                      </p>

                      {appointment.status !==
                        "completed" &&
                        appointment.status !==
                          "cancelled" && (
                          <button
                            className="cancel-button"
                            onClick={() =>
                              handleCancelAppointment(
                                appointment._id
                              )
                            }
                            disabled={
                              cancellingId ===
                              appointment._id
                            }
                          >
                            {cancellingId ===
                            appointment._id
                              ? "Cancelling..."
                              : "Cancel Appointment"}
                          </button>
                        )}

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </main>

        {/* =================================================
            AVAILABILITY MODAL
        ================================================= */}

        {showAvailability && (
          <div className="modal-overlay">

            <div className="modal">

              <div className="modal-header">

                <div>

                  <h2>
                    Available Slots
                  </h2>

                  <p>
                    {selectedDoctor?.user
                      ?.name}
                  </p>

                </div>

                <button
                  className="close-button"
                  onClick={
                    closeAvailability
                  }
                >
                  ✕
                </button>

              </div>

              {loadingAvailability ? (
                <div className="loading-box">
                  Loading availability...
                </div>
              ) : availability.length ===
                0 ? (
                <div className="empty-box">
                  No available slots for
                  this doctor.
                </div>
              ) : (
                <div className="availability-list">

                  {availability.map(
                    (slot) => (
                      <div
                        className="availability-card"
                        key={slot._id}
                      >

                        <div>

                          <h3>
                            📅{" "}
                            {formatSlotDate(
                              slot.date
                            )}
                          </h3>

                          <p>
                            🕐{" "}
                            {slot.startTime} -{" "}
                            {slot.endTime}
                          </p>

                          <p>
                            <strong>
                              {slot.dayOfWeek}
                            </strong>
                          </p>

                        </div>

                        <button
                          className="book-button"
                          onClick={() =>
                            openBooking(
                              slot
                            )
                          }
                        >
                          Book Appointment
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

          </div>
        )}

        {/* =================================================
            BOOKING MODAL
        ================================================= */}

        {bookingSlot && (
          <div className="modal-overlay">

            <div className="booking-modal">

              <div className="modal-header">

                <h2>
                  Book Appointment
                </h2>

                <button
                  className="close-button"
                  onClick={() =>
                    setBookingSlot(null)
                  }
                >
                  ✕
                </button>

              </div>

              <div className="booking-details">

                <p>
                  <strong>
                    Doctor:
                  </strong>{" "}
                  {selectedDoctor?.user
                    ?.name}
                </p>

                <p>
                  <strong>
                    Department:
                  </strong>{" "}
                  {selectedDoctor?.department
                    ?.name ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    Date:
                  </strong>{" "}
                  {formatSlotDate(
                    bookingSlot.date
                  )}
                </p>

                <p>
                  <strong>
                    Time:
                  </strong>{" "}
                  {bookingSlot.startTime} -{" "}
                  {bookingSlot.endTime}
                </p>

              </div>

              <label>
                Reason for Visit
              </label>

              <textarea
                placeholder="Enter reason for appointment"
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                rows="4"
              />

              <div className="booking-actions">

                <button
                  className="secondary-button"
                  onClick={() =>
                    setBookingSlot(null)
                  }
                  disabled={booking}
                >
                  Back
                </button>

                <button
                  className="book-button"
                  onClick={
                    handleBookAppointment
                  }
                  disabled={booking}
                >
                  {booking
                    ? "Booking..."
                    : "Confirm Booking"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    );
  }

  // =====================================================
  // DOCTOR DASHBOARD
  // =====================================================

  if (user?.role === "doctor") {
    return (
      <div className="dashboard">

        <header className="dashboard-header">

          <div>

            <h1>
              🏥 Hospital Appointment
            </h1>

            <p>
              Doctor Dashboard
            </p>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>

        <main className="dashboard-content">

          {/* WELCOME */}

          <div className="welcome-card">

            <h2>
              Welcome, {user?.name} 👋
            </h2>

            <p>
              Manage your appointments
              and availability from here.
            </p>

          </div>

          {message && (
            <div className="dashboard-message">
              {message}
            </div>
          )}

          {/* =================================================
              PROFILE
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                👨‍⚕️ My Profile
              </h2>

              <button
                onClick={
                  fetchDoctorProfile
                }
                disabled={
                  loadingDoctorProfile
                }
              >
                {loadingDoctorProfile
                  ? "Loading..."
                  : "Refresh"}
              </button>

            </div>

            {loadingDoctorProfile ? (
              <p>
                Loading profile...
              </p>
            ) : !doctorProfile ? (
              <p>
                Doctor profile not found.
              </p>
            ) : (
              <div className="doctor-card">

                <h3>
                  {doctorProfile.user
                    ?.name}
                </h3>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {doctorProfile.user
                    ?.email}
                </p>

                <p>
                  <strong>
                    Specialization:
                  </strong>{" "}
                  {doctorProfile
                    .specialization
                    ?.name ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    Department:
                  </strong>{" "}
                  {doctorProfile.department
                    ?.name ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    Experience:
                  </strong>{" "}
                  {doctorProfile
                    .experience ||
                    0} years
                </p>

                <p>
                  <strong>
                    Phone:
                  </strong>{" "}
                  {doctorProfile.phone ||
                    "N/A"}
                </p>

              </div>
            )}

          </section>

          {/* =================================================
              AVAILABILITY
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                🕐 My Availability
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >

                <button
                  onClick={
                    fetchDoctorAvailability
                  }
                  disabled={
                    loadingDoctorAvailability
                  }
                >
                  {loadingDoctorAvailability
                    ? "Loading..."
                    : "Refresh"}
                </button>

                <button
                  onClick={() => {
                    setShowAddAvailability(
                      true
                    );
                    setMessage("");
                  }}
                >
                  + Add Availability
                </button>

              </div>

            </div>

            {loadingDoctorAvailability ? (
              <div className="loading-box">
                Loading availability...
              </div>
            ) : doctorAvailability.length ===
              0 ? (
              <div className="empty-box">

                <p>
                  No availability
                  slots yet.
                </p>

                <button
                  className="book-button"
                  onClick={() =>
                    setShowAddAvailability(
                      true
                    )
                  }
                >
                  + Create Availability
                </button>

              </div>
            ) : (
              <div className="availability-list">

                {doctorAvailability.map(
                  (slot) => (
                    <div
                      className="availability-card"
                      key={slot._id}
                    >

                      <div>

                        <h3>
                          📅{" "}
                          {formatSlotDate(
                            slot.date
                          )}
                        </h3>

                        <p>
                          🕐{" "}
                          {slot.startTime} -{" "}
                          {slot.endTime}
                        </p>

                        <p>
                          <strong>
                            {slot.dayOfWeek}
                          </strong>
                        </p>

                        <p>
                          <strong>
                            Status:
                          </strong>{" "}

                          <span
                            className={
                              slot.isBooked
                                ? "status confirmed"
                                : "status completed"
                            }
                          >
                            {slot.isBooked
                              ? "Booked"
                              : "Available"}
                          </span>

                        </p>

                      </div>

                      {!slot.isBooked && (
                        <button
                          className="cancel-button"
                          onClick={() =>
                            handleDeleteAvailability(
                              slot._id
                            )
                          }
                          disabled={
                            deletingAvailabilityId ===
                            slot._id
                          }
                        >
                          {deletingAvailabilityId ===
                          slot._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </section>

          {/* =================================================
              DOCTOR APPOINTMENTS
          ================================================= */}

          <section className="dashboard-section">

            <div className="section-header">

              <h2>
                📅 Patient Appointments
              </h2>

              <button
                onClick={
                  fetchDoctorAppointments
                }
                disabled={
                  loadingDoctorAppointments
                }
              >
                {loadingDoctorAppointments
                  ? "Loading..."
                  : "Refresh"}
              </button>

            </div>

            {loadingDoctorAppointments ? (
              <p>
                Loading appointments...
              </p>
            ) : doctorAppointments.length ===
              0 ? (
              <p>
                No appointments found.
              </p>
            ) : (
              <div className="appointment-list">

                {doctorAppointments.map(
                  (appointment) => (
                    <div
                      className="appointment-card"
                      key={
                        appointment._id
                      }
                    >

                      <h3>
                        👤{" "}
                        {appointment.patient
                          ?.user?.name ||
                          "Patient"}
                      </h3>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {appointment.patient
                          ?.user?.email ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Department:
                        </strong>{" "}
                        {appointment
                          .department
                          ?.name ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Date:
                        </strong>{" "}
                        {appointment
                          .appointmentDate
                          ? new Date(
                              appointment.appointmentDate
                            ).toLocaleString()
                          : "N/A"}
                      </p>

                      <p>
                        <strong>
                          Reason:
                        </strong>{" "}
                        {appointment.reason ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}

                        <span
                          className={`status ${appointment.status}`}
                        >
                          {appointment.status}
                        </span>

                      </p>

                      {appointment.status !==
                        "completed" &&
                        appointment.status !==
                          "cancelled" && (

                        <div
                          className="booking-actions"
                        >

                          {appointment.status ===
                            "pending" && (
                            <button
                              className="book-button"
                              onClick={() =>
                                handleUpdateAppointmentStatus(
                                  appointment._id,
                                  "confirmed"
                                )
                              }
                              disabled={
                                updatingAppointmentId ===
                                appointment._id
                              }
                            >
                              {updatingAppointmentId ===
                              appointment._id
                                ? "Updating..."
                                : "Confirm"}
                            </button>
                          )}

                          {appointment.status ===
                            "confirmed" && (
                            <button
                              className="book-button"
                              onClick={() =>
                                handleUpdateAppointmentStatus(
                                  appointment._id,
                                  "completed"
                                )
                              }
                              disabled={
                                updatingAppointmentId ===
                                appointment._id
                              }
                            >
                              {updatingAppointmentId ===
                              appointment._id
                                ? "Updating..."
                                : "Mark Completed"}
                            </button>
                          )}

                          <button
                            className="cancel-button"
                            onClick={() =>
                              handleUpdateAppointmentStatus(
                                appointment._id,
                                "cancelled"
                              )
                            }
                            disabled={
                              updatingAppointmentId ===
                              appointment._id
                            }
                          >
                            {updatingAppointmentId ===
                            appointment._id
                              ? "Updating..."
                              : "Cancel Appointment"}
                          </button>

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </main>

        {/* =================================================
            ADD AVAILABILITY MODAL
        ================================================= */}

        {showAddAvailability && (
          <div className="modal-overlay">

            <div className="booking-modal">

              <div className="modal-header">

                <div>

                  <h2>
                    Add Availability
                  </h2>

                  <p>
                    Create a new appointment
                    time slot
                  </p>

                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setShowAddAvailability(
                      false
                    )
                  }
                >
                  ✕
                </button>

              </div>

              <form
                onSubmit={
                  handleCreateAvailability
                }
              >

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={
                    availabilityForm.date
                  }
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      date:
                        e.target.value,
                    })
                  }
                  required
                />

                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  value={
                    availabilityForm.startTime
                  }
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      startTime:
                        e.target.value,
                    })
                  }
                  required
                />

                <label>
                  End Time
                </label>

                <input
                  type="time"
                  value={
                    availabilityForm.endTime
                  }
                  onChange={(e) =>
                    setAvailabilityForm({
                      ...availabilityForm,
                      endTime:
                        e.target.value,
                    })
                  }
                  required
                />

                <div className="booking-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setShowAddAvailability(
                        false
                      )
                    }
                    disabled={
                      creatingAvailability
                    }
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="book-button"
                    disabled={
                      creatingAvailability
                    }
                  >
                    {creatingAvailability
                      ? "Creating..."
                      : "Create Availability"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    );
  }

  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  return (
    <div className="dashboard">

      <header className="dashboard-header">

        <div>

          <h1>
            🏥 Hospital Appointment
          </h1>

          <p>
            Admin Dashboard
          </p>

        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      <main className="dashboard-content">

        <div className="welcome-card">

          <h2>
            Welcome, {user?.name} 👋
          </h2>

          <p>
            Admin dashboard will be added
            next.
          </p>

        </div>

        {message && (
          <div className="dashboard-message">
            {message}
          </div>
        )}

      </main>

    </div>
  );
}

export default App;
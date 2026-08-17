document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "http://localhost:5000/api/students";


    // =====================================================
    // DASHBOARD
    // =====================================================

    const totalStudents = document.getElementById("totalStudents");
    const iseStudents = document.getElementById("iseStudents");
    const cseStudents = document.getElementById("cseStudents");
    const otherStudents = document.getElementById("otherStudents");
    const recentStudents = document.getElementById("recentStudents");


    async function loadDashboard() {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to load students");
            }

            const data = await response.json();

            const students = data.students || [];


            // Total
            totalStudents.textContent = students.length;


            // ISE
            const iseCount = students.filter(student =>
                student.department === "ISE"
            ).length;

            iseStudents.textContent = iseCount;


            // CSE
            const cseCount = students.filter(student =>
                student.department === "CSE"
            ).length;

            cseStudents.textContent = cseCount;


            // Other
            const otherCount = students.filter(student =>
                student.department !== "ISE" &&
                student.department !== "CSE"
            ).length;

            otherStudents.textContent = otherCount;


            // Recent students
            if (students.length === 0) {

                recentStudents.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty">
                            No students registered yet.
                        </td>
                    </tr>
                `;

                return;
            }


            const latestStudents =
                students.slice(-5).reverse();


            recentStudents.innerHTML =
                latestStudents.map(student => `
                    
                    <tr>

                        <td>
                            ${student.id}
                        </td>

                        <td>
                            <strong>
                                ${student.name}
                            </strong>
                        </td>

                        <td>
                            ${student.email}
                        </td>

                        <td>
                            ${student.department}
                        </td>

                        <td>
                            ${student.semester}
                        </td>

                    </tr>

                `).join("");


        } catch (error) {

            console.error("Dashboard error:", error);

            if (totalStudents) totalStudents.textContent = "-";
            if (iseStudents) iseStudents.textContent = "-";
            if (cseStudents) cseStudents.textContent = "-";
            if (otherStudents) otherStudents.textContent = "-";


            if (recentStudents) {

                recentStudents.innerHTML = `
                    <tr>
                        <td colspan="5" class="empty">
                            Unable to connect to backend.
                        </td>
                    </tr>
                `;

            }

        }

    }


    // =====================================================
    // STUDENTS PAGE
    // =====================================================

    const studentsTableBody =
        document.getElementById("studentsTableBody");

    const studentCount =
        document.getElementById("studentCount");

    const searchInput =
        document.getElementById("searchInput");

    const departmentFilter =
        document.getElementById("departmentFilter");

    const semesterFilter =
        document.getElementById("semesterFilter");

    const addStudentBtn =
        document.getElementById("addStudentBtn");


    let allStudents = [];


    async function loadStudents() {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to load students");
            }

            const data = await response.json();

            allStudents = data.students || [];

            displayStudents(allStudents);

        } catch (error) {

            console.error("Students error:", error);

            if (studentsTableBody) {

                studentsTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty">
                            Unable to connect to backend.
                        </td>
                    </tr>
                `;

            }

        }

    }


    // =====================================================
    // DISPLAY STUDENTS
    // =====================================================

    function displayStudents(students) {

        if (!studentsTableBody) {
            return;
        }


        if (students.length === 0) {

            studentsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        No students found.
                    </td>
                </tr>
            `;

            if (studentCount) {
                studentCount.textContent = "0 Students";
            }

            return;
        }


        if (studentCount) {

            studentCount.textContent =
                `${students.length} Students`;

        }


        studentsTableBody.innerHTML =
            students.map(student => `

                <tr>

                    <td>
                        ${student.id}
                    </td>

                    <td>
                        <strong>
                            ${student.name}
                        </strong>
                    </td>

                    <td>
                        ${student.email}
                    </td>

                    <td>
                        ${student.department}
                    </td>

                    <td>
                        ${student.semester}
                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editStudent(${student.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent(${student.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `).join("");

    }


    // =====================================================
    // FILTER STUDENTS
    // =====================================================

    function filterStudents() {

        const search =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";

        const department =
            departmentFilter
                ? departmentFilter.value
                : "";

        const semester =
            semesterFilter
                ? semesterFilter.value
                : "";


        const filteredStudents =
            allStudents.filter(student => {

                const matchesSearch =
                    !search ||
                    student.name.toLowerCase().includes(search) ||
                    student.email.toLowerCase().includes(search) ||
                    String(student.id).includes(search);


                const matchesDepartment =
                    !department ||
                    student.department === department;


                const matchesSemester =
                    !semester ||
                    String(student.semester) === semester;


                return (
                    matchesSearch &&
                    matchesDepartment &&
                    matchesSemester
                );

            });


        displayStudents(filteredStudents);

    }


    // Search
    if (searchInput) {
        searchInput.addEventListener(
            "input",
            filterStudents
        );
    }


    // Department filter
    if (departmentFilter) {
        departmentFilter.addEventListener(
            "change",
            filterStudents
        );
    }


    // Semester filter
    if (semesterFilter) {
        semesterFilter.addEventListener(
            "change",
            filterStudents
        );
    }


    // =====================================================
    // ADD STUDENT BUTTON
    // =====================================================

    if (addStudentBtn) {

        addStudentBtn.addEventListener("click", function () {

            alert("Add Student form can be connected here.");

        });

    }


    // =====================================================
    // DELETE STUDENT
    // =====================================================

    window.deleteStudent = async function (id) {

        const confirmDelete =
            confirm("Are you sure you want to delete this student?");


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to delete student."
                );

                return;
            }


            alert("Student deleted successfully.");


            loadStudents();


        } catch (error) {

            console.error("Delete error:", error);

            alert("Unable to connect to backend.");

        }

    };


    // =====================================================
    // EDIT STUDENT
    // =====================================================

    window.editStudent = async function (id) {

        const student =
            allStudents.find(
                student => student.id === id
            );


        if (!student) {
            return;
        }


        const name =
            prompt(
                "Student Name:",
                student.name
            );


        if (name === null) {
            return;
        }


        const email =
            prompt(
                "Email:",
                student.email
            );


        if (email === null) {
            return;
        }


        const department =
            prompt(
                "Department:",
                student.department
            );


        if (department === null) {
            return;
        }


        const semester =
            prompt(
                "Semester:",
                student.semester
            );


        if (semester === null) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            department,
                            semester
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to update student."
                );

                return;
            }


            alert("Student updated successfully.");


            loadStudents();


        } catch (error) {

            console.error("Update error:", error);

            alert(
                "Unable to connect to backend."
            );

        }

    };


    // =====================================================
    // RUN ONLY WHERE NEEDED
    // =====================================================

    if (totalStudents) {
        loadDashboard();
    }


    if (studentsTableBody) {
        loadStudents();
    }

});
// ==========================================
// LOAD SAVED SETTINGS EVERYWHERE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const savedSettings =
        localStorage.getItem("studentHubSettings");

    if (!savedSettings) {
        return;
    }

    const settings =
        JSON.parse(savedSettings);


    // Update system name
    const systemName =
        document.querySelector(".logo-text h2");

    if (systemName) {

        systemName.textContent =
            settings.systemName || "StudentHub";
    }


    // Update administrator name
    const adminName =
        document.querySelector(".sidebar .user strong");

    if (adminName) {

        adminName.textContent =
            settings.adminName || "Admin";
    }

});
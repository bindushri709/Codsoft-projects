document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "http://localhost:5000/api/students";

    const addStudentBtn = document.getElementById("addStudentBtn");
    const studentModal = document.getElementById("studentModal");
    const closeModal = document.getElementById("closeModal");
    const cancelModal = document.getElementById("cancelModal");

    const studentForm = document.getElementById("studentForm");

    const studentName = document.getElementById("studentName");
    const studentEmail = document.getElementById("studentEmail");
    const studentDepartment = document.getElementById("studentDepartment");
    const studentSemester = document.getElementById("studentSemester");

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


    // =========================
    // OPEN MODAL
    // =========================

    addStudentBtn.addEventListener("click", function () {

        studentForm.reset();

        delete studentForm.dataset.editingId;

        studentModal.classList.add("show");

    });


    // =========================
    // CLOSE MODAL
    // =========================

    closeModal.addEventListener("click", function () {
        studentModal.classList.remove("show");
    });


    cancelModal.addEventListener("click", function () {
        studentModal.classList.remove("show");
    });


    studentModal.addEventListener("click", function (event) {

        if (event.target === studentModal) {
            studentModal.classList.remove("show");
        }

    });


   // =========================
// LOAD STUDENTS
// =========================

async function loadStudents() {

    try {

        studentsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Loading students...
                </td>
            </tr>
        `;

        // Get current search/filter values
        const searchText =
            searchInput.value.trim();

        const department =
            departmentFilter.value;

        const semester =
            semesterFilter.value;


        // Build backend search URL
        const params = new URLSearchParams();


        // Search by ID or name
        if (searchText) {

            // If search contains only numbers,
            // treat it as Student ID
            if (/^\d+$/.test(searchText)) {

                params.append("id", searchText);

            } else {

                params.append("name", searchText);

            }

        }


        // Department filter
        if (department) {
            params.append("department", department);
        }


        // Semester filter
        if (semester) {
            params.append("semester", semester);
        }


        const searchURL =
            params.toString()
                ? `${API_URL}/search?${params.toString()}`
                : API_URL;


        const response =
            await fetch(searchURL);


        if (!response.ok) {
            throw new Error("Failed to load students");
        }


        const data =
            await response.json();


        console.log("Students received:", data);


        const students =
            Array.isArray(data)
                ? data
                : data.students || data.data || [];


        displayStudents(students);


    } catch (error) {

        console.error("Student loading error:", error);


        studentsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Unable to connect to backend.
                </td>
            </tr>
        `;


        studentCount.textContent =
            "0 Students";

    }

}


// =========================
// DISPLAY STUDENTS
// =========================

function displayStudents(students) {

    studentCount.textContent =
        `${students.length} Students`;


    if (students.length === 0) {

        studentsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }


    studentsTableBody.innerHTML =
        students.map(function (student) {

            return `
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
                            onclick="editStudent(${student.id})">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent(${student.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        }).join("");

}
    // =========================
    // ADD / UPDATE STUDENT
    // =========================

    studentForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const editingId =
            studentForm.dataset.editingId;


        const student = {

            name: studentName.value.trim(),

            email: studentEmail.value.trim(),

            department: studentDepartment.value,

            semester: Number(studentSemester.value)

        };


        try {

            let response;


            // =========================
            // UPDATE
            // =========================

            if (editingId) {

                response = await fetch(
                    `${API_URL}/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(student)
                    }
                );

            }


            // =========================
            // ADD
            // =========================

            else {

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(student)
                    }
                );

            }


            const data = await response.json();

            console.log("Server response:", data);


            if (!response.ok) {

                const errorMessage =
                    data.message ||
                    data.errors?.[0]?.msg ||
                    "Unable to save student";

                alert(errorMessage);

                return;
            }


            if (editingId) {

                alert("Student updated successfully!");

            } else {

                alert("Student added successfully!");

            }


            studentForm.reset();

            delete studentForm.dataset.editingId;

            studentModal.classList.remove("show");

            loadStudents();


        } catch (error) {

            console.error("Save student error:", error);

            alert(
                "Cannot connect to backend. Make sure your Node.js server is running."
            );

        }

    });


    // =========================
    // DELETE STUDENT
    // =========================

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
                    "Unable to delete student"
                );

                return;
            }


            alert("Student deleted successfully!");

            loadStudents();


        } catch (error) {

            console.error(error);

            alert("Cannot connect to backend.");

        }

    };


    // =========================
    // EDIT STUDENT
    // =========================

    window.editStudent = async function (id) {

        try {

            const response =
                await fetch(`${API_URL}/${id}`);


            if (!response.ok) {
                throw new Error("Unable to get student");
            }


            const data = await response.json();


            const student =
                data.student ||
                data.data ||
                data;


            studentName.value =
                student.name || "";

            studentEmail.value =
                student.email || "";

            studentDepartment.value =
                student.department || "";

            studentSemester.value =
                student.semester || "";


            studentForm.dataset.editingId = id;

            studentModal.classList.add("show");


        } catch (error) {

            console.error(error);

            alert("Unable to load student.");

        }

    };


    // =========================
    // SEARCH + FILTER
    // =========================

    searchInput.addEventListener(
        "input",
        loadStudents
    );


    departmentFilter.addEventListener(
        "change",
        loadStudents
    );


    semesterFilter.addEventListener(
        "change",
        loadStudents
    );


    // =========================
    // INITIAL LOAD
    // =========================

    loadStudents();

});
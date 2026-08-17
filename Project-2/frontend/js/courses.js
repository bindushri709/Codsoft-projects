document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "http://localhost:5000/api/courses";

    // =========================
    // GET HTML ELEMENTS
    // =========================

    const addCourseBtn = document.getElementById("addCourseBtn");
    const courseModal = document.getElementById("courseModal");
    const closeCourseModal = document.getElementById("closeCourseModal");
    const cancelCourse = document.getElementById("cancelCourse");

    const courseForm = document.getElementById("courseForm");

    const courseId = document.getElementById("courseId");
    const courseName = document.getElementById("courseName");
    const courseCode = document.getElementById("courseCode");
    const courseDepartment = document.getElementById("courseDepartment");
    const courseCredits = document.getElementById("courseCredits");

    const courseSearch = document.getElementById("courseSearch");
    const coursesTableBody = document.getElementById("coursesTableBody");
    const courseCount = document.getElementById("courseCount");

    let courses = [];


    // =========================
    // LOAD COURSES FROM MYSQL
    // =========================

    async function loadCourses() {

        try {

            coursesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        Loading courses...
                    </td>
                </tr>
            `;

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load courses");
            }

            const data = await response.json();

            console.log("Courses received:", data);

            courses = Array.isArray(data)
                ? data
                : data.courses || [];

            renderCourses();

        } catch (error) {

            console.error("Course loading error:", error);

            coursesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        Unable to load courses.
                    </td>
                </tr>
            `;

            courseCount.textContent = "0 Courses";
        }
    }


    // =========================
    // DISPLAY COURSES
    // =========================

    function renderCourses() {

        const searchText =
            courseSearch.value.toLowerCase().trim();


        const filteredCourses = courses.filter(function (course) {

            const name =
                String(course.name || "").toLowerCase();

            const code =
                String(course.code || "").toLowerCase();

            const department =
                String(course.department || "").toLowerCase();


            return (
                name.includes(searchText) ||
                code.includes(searchText) ||
                department.includes(searchText)
            );

        });


        courseCount.textContent =
            `${filteredCourses.length} Course${
                filteredCourses.length !== 1 ? "s" : ""
            }`;


        if (filteredCourses.length === 0) {

            coursesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        No courses found.
                    </td>
                </tr>
            `;

            return;
        }


        coursesTableBody.innerHTML =
            filteredCourses.map(function (course) {

                return `
                    <tr>

                        <td>
                            ${course.id}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(course.name)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(course.code)}
                        </td>

                        <td>
                            ${escapeHTML(course.department)}
                        </td>

                        <td>
                            ${course.credits}
                        </td>

                        <td>

                            <button
                                class="edit-btn"
                                onclick="editCourse(${course.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteCourse(${course.id})"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>
                `;

            }).join("");
    }


    // =========================
    // OPEN ADD COURSE MODAL
    // =========================

    addCourseBtn.addEventListener("click", function () {

        courseForm.reset();

        courseId.value = "";

        document.getElementById(
            "courseModalTitle"
        ).textContent = "Add Course";

        courseModal.classList.add("show");
    });


    // =========================
    // CLOSE MODAL
    // =========================

    function closeModal() {

        courseModal.classList.remove("show");

    }


    closeCourseModal.addEventListener(
        "click",
        closeModal
    );


    cancelCourse.addEventListener(
        "click",
        closeModal
    );


    courseModal.addEventListener(
        "click",
        function (event) {

            if (event.target === courseModal) {
                closeModal();
            }

        }
    );


    // =========================
    // ADD / UPDATE COURSE
    // =========================

    courseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id = courseId.value;


            const course = {

                name: courseName.value.trim(),

                code: courseCode.value
                    .trim()
                    .toUpperCase(),

                department: courseDepartment.value,

                credits: Number(courseCredits.value)

            };


            // =========================
            // VALIDATION
            // =========================

            if (
                !course.name ||
                !course.code ||
                !course.department ||
                !course.credits
            ) {

                alert(
                    "Please fill all course details."
                );

                return;
            }


            try {

                let response;


                // =========================
                // UPDATE
                // =========================

                if (id) {

                    response = await fetch(
                        `${API_URL}/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify(course)
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

                            body: JSON.stringify(course)
                        }
                    );

                }


                const data = await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to save course"
                    );

                    return;
                }


                if (id) {

                    alert(
                        "Course updated successfully!"
                    );

                } else {

                    alert(
                        "Course added successfully!"
                    );

                }


                courseForm.reset();

                courseId.value = "";

                closeModal();

                await loadCourses();

            } catch (error) {

                console.error(
                    "Save course error:",
                    error
                );

                alert(
                    "Cannot connect to backend. Make sure your Node.js server is running."
                );
            }

        }
    );


    // =========================
    // EDIT COURSE
    // =========================

    window.editCourse = async function (id) {

        try {

            const response =
                await fetch(`${API_URL}/${id}`);


            if (!response.ok) {

                throw new Error(
                    "Unable to get course"
                );

            }


            const data = await response.json();


            const course =
                data.course ||
                data.data ||
                data;


            courseId.value =
                course.id || "";

            courseName.value =
                course.name || "";

            courseCode.value =
                course.code || "";

            courseDepartment.value =
                course.department || "";

            courseCredits.value =
                course.credits || "";


            document.getElementById(
                "courseModalTitle"
            ).textContent = "Edit Course";


            courseModal.classList.add("show");

        } catch (error) {

            console.error(
                "Edit course error:",
                error
            );

            alert(
                "Unable to load course."
            );

        }

    };


    // =========================
    // DELETE COURSE
    // =========================

    window.deleteCourse = async function (id) {

        const course =
            courses.find(function (item) {
                return Number(item.id) === Number(id);
            });


        if (!course) {
            return;
        }


        const confirmed =
            confirm(
                `Delete "${course.name}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to delete course"
                );

                return;
            }


            alert(
                "Course deleted successfully!"
            );


            await loadCourses();

        } catch (error) {

            console.error(
                "Delete course error:",
                error
            );

            alert(
                "Cannot connect to backend."
            );

        }

    };


    // =========================
    // SEARCH COURSES
    // =========================

    courseSearch.addEventListener(
        "input",
        renderCourses
    );


    // =========================
    // ESCAPE HTML
    // =========================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =========================
    // INITIAL LOAD
    // =========================

    loadCourses();

});
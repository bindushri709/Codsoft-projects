document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "http://localhost:5000/api/students";


    const totalStudents =
        document.getElementById("reportTotalStudents");

    const cseStudents =
        document.getElementById("reportCSE");

    const iseStudents =
        document.getElementById("reportISE");

    const otherStudents =
        document.getElementById("reportOther");

    const departmentReport =
        document.getElementById("departmentReport");

    const semesterReport =
        document.getElementById("semesterReport");


    async function loadReports() {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to load students");
            }

            const data = await response.json();

            const students =
                Array.isArray(data)
                    ? data
                    : data.students || data.data || [];


            generateStatistics(students);

            generateDepartmentReport(students);

            generateSemesterReport(students);


        } catch (error) {

            console.error("Report error:", error);

            departmentReport.innerHTML = `
                <tr>
                    <td colspan="3" class="empty">
                        Unable to load report.
                    </td>
                </tr>
            `;

            semesterReport.innerHTML = `
                <tr>
                    <td colspan="2" class="empty">
                        Unable to load report.
                    </td>
                </tr>
            `;

        }

    }


    // =========================
    // STATISTICS
    // =========================

    function generateStatistics(students) {

        const total = students.length;

        const cse =
            students.filter(
                student => student.department === "CSE"
            ).length;

        const ise =
            students.filter(
                student => student.department === "ISE"
            ).length;

        const other = total - cse - ise;


        totalStudents.textContent = total;

        cseStudents.textContent = cse;

        iseStudents.textContent = ise;

        otherStudents.textContent = other;

    }


    // =========================
    // DEPARTMENT REPORT
    // =========================

    function generateDepartmentReport(students) {

        const departments = {};

        students.forEach(function (student) {

            const department =
                student.department || "Other";

            departments[department] =
                (departments[department] || 0) + 1;

        });


        const total = students.length;


        if (Object.keys(departments).length === 0) {

            departmentReport.innerHTML = `
                <tr>
                    <td colspan="3" class="empty">
                        No student data available.
                    </td>
                </tr>
            `;

            return;
        }


        departmentReport.innerHTML =
            Object.entries(departments)
                .map(function ([department, count]) {

                    const percentage =
                        total === 0
                            ? 0
                            : ((count / total) * 100).toFixed(1);


                    return `
                        <tr>

                            <td>
                                <strong>${department}</strong>
                            </td>

                            <td>
                                ${count}
                            </td>

                            <td>
                                ${percentage}%
                            </td>

                        </tr>
                    `;

                })
                .join("");

    }


    // =========================
    // SEMESTER REPORT
    // =========================

    function generateSemesterReport(students) {

        const semesters = {};


        students.forEach(function (student) {

            const semester =
                student.semester || "Unknown";

            semesters[semester] =
                (semesters[semester] || 0) + 1;

        });


        if (Object.keys(semesters).length === 0) {

            semesterReport.innerHTML = `
                <tr>
                    <td colspan="2" class="empty">
                        No student data available.
                    </td>
                </tr>
            `;

            return;
        }


        semesterReport.innerHTML =
            Object.entries(semesters)
                .sort(function (a, b) {

                    return Number(a[0]) - Number(b[0]);

                })
                .map(function ([semester, count]) {

                    return `
                        <tr>

                            <td>
                                Semester ${semester}
                            </td>

                            <td>
                                ${count}
                            </td>

                        </tr>
                    `;

                })
                .join("");

    }


    // =========================
    // START
    // =========================

    loadReports();

});
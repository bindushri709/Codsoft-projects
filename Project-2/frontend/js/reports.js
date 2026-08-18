document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "http://localhost:5000/api/students";

    const totalStudents = document.getElementById("reportTotalStudents");
    const cseStudents = document.getElementById("reportCSE");
    const iseStudents = document.getElementById("reportISE");
    const otherStudents = document.getElementById("reportOther");

    const departmentReport = document.getElementById("departmentReport");
    const semesterReport = document.getElementById("semesterReport");

    const calculateButton = document.getElementById("calculateReportButton");


    // ============================
    // LOAD REPORTS
    // ============================

    async function loadReports() {

        try {

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load students");
            }

            const data = await response.json();

            let students = [];

            if (Array.isArray(data)) {
                students = data;
            } else if (Array.isArray(data.students)) {
                students = data.students;
            } else if (Array.isArray(data.data)) {
                students = data.data;
            }

            showStatistics(students);
            showDepartmentReport(students);
            showSemesterReport(students);

        } catch (error) {

            console.error("Report Error:", error);

            departmentReport.innerHTML =
                "<tr><td colspan='3'>Unable to load report</td></tr>";

            semesterReport.innerHTML =
                "<tr><td colspan='2'>Unable to load report</td></tr>";
        }
    }


    // ============================
    // STATISTICS
    // ============================

    function showStatistics(students) {

        let total = students.length;
        let cse = 0;
        let ise = 0;

        students.forEach(function (student) {

            const department =
                String(student.department || "")
                    .trim()
                    .toUpperCase();

            if (department === "CSE") {
                cse++;
            }

            if (department === "ISE") {
                ise++;
            }
        });
    

        const other = total - cse - ise;


        totalStudents.textContent = total;

        cseStudents.textContent = cse;

        iseStudents.textContent = ise;

        otherStudents.textContent = other;

    }


    // ============================
    // DEPARTMENT REPORT
    // ============================

    function showDepartmentReport(students) {

        const departments = {};

        students.forEach(function (student) {

            const department =
                String(student.department || "Other").trim();

            if (departments[department]) {
                departments[department]++;
            } else {
                departments[department] = 1;
            }
        });

        if (students.length === 0) {

            departmentReport.innerHTML =
                "<tr><td colspan='3'>No student data available</td></tr>";

            return;
        }

        let html = "";

        for (const department in departments) {

            const count = departments[department];

            const percentage =
                ((count / students.length) * 100).toFixed(1);

            html +=
                "<tr>" +
                "<td>" + department + "</td>" +
                "<td>" + count + "</td>" +
                "<td>" + percentage + "%</td>" +
                "</tr>";
        }

        departmentReport.innerHTML = html;
    }


    // ============================
    // SEMESTER REPORT
    // ============================

    function showSemesterReport(students) {

        const semesters = {};


        students.forEach(function (student) {

            const semester =
                student.semester || "Unknown";

            if (semesters[semester]) {
                semesters[semester]++;
            } else {
                semesters[semester] = 1;
            }
        });


        if (students.length === 0) {

            semesterReport.innerHTML =
                "<tr><td colspan='2'>No student data available</td></tr>";

            return;
        }

        let html = "";

        for (const semester in semesters) {

            html +=
                "<tr>" +
                "<td>Semester " + semester + "</td>" +
                "<td>" + semesters[semester] + "</td>" +
                "</tr>";
        }

        semesterReport.innerHTML = html;
    }


    // ============================
    // GRADE CALCULATOR
    // ============================

    function calculateStudentReport() {

        const name =
            document.getElementById("reportStudentName").value.trim();

        const roll =
            document.getElementById("reportRollNumber").value.trim();

        if (name === "") {
            alert("Please enter student name.");
            return;
        }

        if (roll === "") {
            alert("Please enter roll number.");
            return;
        }


        const maths =
            Number(document.getElementById("reportMaths").value);

        const physics =
            Number(document.getElementById("reportPhysics").value);

        const computer =
            Number(document.getElementById("reportComputer").value);

        const english =
            Number(document.getElementById("reportEnglish").value);

        const programming =
            Number(document.getElementById("reportProgramming").value);


        const marks = [
            maths,
            physics,
            computer,
            english,
            programming
        ];


        for (let i = 0; i < marks.length; i++) {

            if (
                !Number.isFinite(marks[i]) ||
                marks[i] < 0 ||
                marks[i] > 100
            ) {

                alert(
                    "Please enter marks between 0 and 100 for all subjects."
                );

                return;
            }
        }


        // TOTAL

        const total =
            maths +
            physics +
            computer +
            english +
            programming;


        // AVERAGE

        const average = total / 5;


        // GRADE

        let grade;

        if (average >= 90) {
            grade = "A+";
        } else if (average >= 80) {
            grade = "A";
        } else if (average >= 70) {
            grade = "B";
        } else if (average >= 60) {
            grade = "C";
        } else if (average >= 50) {
            grade = "D";
        } else {
            grade = "F";
        }


        // PASS / FAIL

        let result = "PASS";

        for (let i = 0; i < marks.length; i++) {

            if (marks[i] < 35) {
                result = "FAIL";
                break;
            }
        }


        // DISPLAY RESULT

        document.getElementById("resultStudentName").textContent = name;

        document.getElementById("resultRollNumber").textContent = roll;

        document.getElementById("resultTotalMarks").textContent =
            total + " / 500";

        document.getElementById("resultAverageMarks").textContent =
            average.toFixed(2) + "%";

        document.getElementById("resultGrade").textContent =
            grade;

        document.getElementById("resultStatus").textContent =
            result;

        document.getElementById("studentReportResult").style.display =
            "block";
    }


    // ============================
    // BUTTON
    // ============================

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateStudentReport
        );
    }


    // ============================
    // START
    // ============================

    loadReports();

});

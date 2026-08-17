document.addEventListener("DOMContentLoaded", function () {

    const savedSettings =
        localStorage.getItem("studentHubSettings");

    if (!savedSettings) {
        return;
    }

    try {

        const settings = JSON.parse(savedSettings);


        // ==============================
        // UPDATE SYSTEM NAME
        // ==============================

        const systemName =
            document.querySelector(".logo-text h2");

        if (systemName) {

            systemName.textContent =
                settings.systemName || "StudentHub";
        }


        // ==============================
        // UPDATE ADMIN NAME
        // ==============================

        const adminName =
            document.querySelector(".sidebar .user strong");

        if (adminName) {

            adminName.textContent =
                settings.adminName || "Admin";
        }


    } catch (error) {

        console.error(
            "Unable to load saved settings:",
            error
        );

    }

});
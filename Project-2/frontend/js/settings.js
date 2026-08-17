document.addEventListener("DOMContentLoaded", function () {

    const systemName = document.getElementById("systemName");
    const adminName = document.getElementById("adminName");
    const adminEmail = document.getElementById("adminEmail");
    const notificationToggle =
        document.getElementById("notificationToggle");
    const saveSettings =
        document.getElementById("saveSettings");


    // ==========================================
    // LOAD SETTINGS
    // ==========================================

    function loadSettings() {

        const savedSettings =
            localStorage.getItem("studentHubSettings");

        if (!savedSettings) {
            return;
        }

        const settings =
            JSON.parse(savedSettings);


        systemName.value =
            settings.systemName || "StudentHub";

        adminName.value =
            settings.adminName || "Admin";

        adminEmail.value =
            settings.adminEmail || "";

        notificationToggle.checked =
            settings.notifications !== false;
    }


    // ==========================================
    // SAVE SETTINGS
    // ==========================================

    saveSettings.addEventListener("click", function () {

        const settings = {

            systemName:
                systemName.value.trim() || "StudentHub",

            adminName:
                adminName.value.trim() || "Admin",

            adminEmail:
                adminEmail.value.trim(),

            notifications:
                notificationToggle.checked
        };


        // Save settings
        localStorage.setItem(
            "studentHubSettings",
            JSON.stringify(settings)
        );


        // Update sidebar on the current page
        updateSidebar(settings);


        alert("Settings saved successfully!");

    });


    // ==========================================
    // UPDATE SIDEBAR
    // ==========================================

    function updateSidebar(settings) {

        const sidebarAdminName =
            document.querySelector(".sidebar .user strong");

        const sidebarSystemName =
            document.querySelector(".sidebar .logo-text h2");


        if (sidebarAdminName) {

            sidebarAdminName.textContent =
                settings.adminName || "Admin";
        }


        if (sidebarSystemName) {

            sidebarSystemName.textContent =
                settings.systemName || "StudentHub";
        }
    }


    // ==========================================
    // LOAD SAVED SETTINGS WHEN PAGE OPENS
    // ==========================================

    loadSettings();


    // Also update the sidebar immediately
    const savedSettings =
        localStorage.getItem("studentHubSettings");

    if (savedSettings) {

        const settings =
            JSON.parse(savedSettings);

        updateSidebar(settings);
    }

});
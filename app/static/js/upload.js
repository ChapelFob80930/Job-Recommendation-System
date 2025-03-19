document.addEventListener("DOMContentLoaded", function () {
    let dropArea = document.getElementById("drop-area");
    let fileElem = document.getElementById("fileElem");
    let fileNameDisplay = document.getElementById("file-name");

    // Highlight drop area on drag over
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("highlight");
    });

    // Remove highlight on drag leave
    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("highlight");
    });

    // Handle file drop
    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("highlight");

        let files = event.dataTransfer.files;
        if (files.length > 0) {
            fileElem.files = files;
            fileNameDisplay.textContent = `Selected File: ${files[0].name}`;
        }
    });

    // Handle file selection via browse button
    fileElem.addEventListener("change", () => {
        if (fileElem.files.length > 0) {
            fileNameDisplay.textContent = `Selected File: ${fileElem.files[0].name}`;
        }
    });

    // Clicking on drop area should open file dialog
    dropArea.addEventListener("click", () => fileElem.click());
});

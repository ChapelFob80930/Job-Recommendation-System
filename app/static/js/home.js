document.addEventListener('DOMContentLoaded', function() {
    const fileElem = document.getElementById('fileElem');
    const browseButton = document.querySelector('.browse-button');
    const fileNameDisplay = document.getElementById('file-name');

    browseButton.addEventListener('click', function(e) {
        if (fileElem) {
            fileElem.click();
        }
    });

    fileElem.addEventListener('change', function(e) {
        if (fileElem.files.length > 0) {
            fileNameDisplay.textContent = fileElem.files[0].name;
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    // Drag and Drop Functionality
    const dropArea = document.getElementById('drop-area');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        if (files.length > 0 && files[0].type === 'application/pdf') {
            fileElem.files = files; // Set the files to the file input
            fileNameDisplay.textContent = files[0].name;
        } else {
            fileNameDisplay.textContent = 'Invalid file type. Please upload a PDF.';
        }
    }
});
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
document.getElementById("fileElem").addEventListener("change", function () {
    const fileName = this.files[0]?.name || "No file selected";
    document.getElementById("file-name").textContent = fileName;
});console.log('File input element:', fileElem);
console.log('Browse button element:', browseButton);
console.log('File name display element:', fileNameDisplay);
console.log('Drop area element:', dropArea);

browseButton.addEventListener('click', function(e) {
    console.log('Browse button clicked');
    if (fileElem) {
        console.log('File input element clicked');
        fileElem.click();
    }
});

fileElem.addEventListener('change', function(e) {
    console.log('File input element changed');
    if (fileElem.files.length > 0) {
        console.log('File selected:', fileElem.files[0].name);
        fileNameDisplay.textContent = fileElem.files[0].name;
    } else {
        console.log('No file selected');
        fileNameDisplay.textContent = '';
    }
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, function(e) {
        console.log(`Drop area ${eventName} event`);
        preventDefaults(e);
    }, false);
});

function preventDefaults(e) {
    console.log('Preventing default behavior');
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, function(e) {
        console.log(`Drop area ${eventName} event`);
        highlight(e);
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, function(e) {
        console.log(`Drop area ${eventName} event`);
        unhighlight(e);
    }, false);
});

function highlight(e) {
    console.log('Highlighting drop area');
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    console.log('Unhighlighting drop area');
    dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', function(e) {
    console.log('Drop event');
    handleDrop(e);
}, false);

function handleDrop(e) {
    console.log('Handling drop event');
    let dt = e.dataTransfer;
    let files = dt.files;

    if (files.length > 0 && files[0].type === 'application/pdf') {
        console.log('Valid PDF file dropped');
        fileElem.files = files; // Set the files to the file input
        fileNameDisplay.textContent = files[0].name;
    } else {
        console.log('Invalid file type');
        fileNameDisplay.textContent = 'Invalid file type. Please upload a PDF.';
    }
}

document.getElementById("fileElem").addEventListener("change", function () {
    console.log('File input element changed');
    const fileName = this.files[0]?.name || "No file selected";
    console.log('File name:', fileName);
    document.getElementById("file-name").textContent = fileName;
});
document.getElementById("recommend-btn").addEventListener("click", function () {
    fetch("/recommend-jobs")  // Request recommendations from Flask
        .then(response => response.json())
        .then(data => {
            let output = "<h2>Your Job Recommendations</h2>";
            if (data.length === 0) {
                output += "<p>No matching jobs found.</p>";
            } else {
                output += `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Job Title</th>
                                <th>Match Score</th>
                                <th>Missing Skills</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                data.forEach(job => {
                    output += `
                        <tr>
                            <td><img src="${job.company_logo}" alt="${job.company}" width="50"></td>
                            <td>${job.job_title}</td>
                            <td>${job.match_score.toFixed(2)}%</td>
                            <td>${job.missing_skills}</td>
                        </tr>
                    `;
                });
                output += "</tbody></table>";
            }
            document.getElementById("recommendations").innerHTML = output;
        })
        .catch(error => console.error("Error fetching recommendations:", error));
});
document.getElementById("recommend-btn").addEventListener("click", function (event) {
    event.preventDefault();  // Prevent default navigation

    fetch("/recommend-jobs")
        .then(response => response.json())
        .then(data => {
            console.log("Recommendations:", data);
            displayRecommendations(data); // Function to update the table
        })
        .catch(error => console.error("Error fetching recommendations:", error));
});

function displayRecommendations(recommendations) {
    let tableBody = document.querySelector("#recommendations tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    if (recommendations.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4'>No recommendations yet.</td></tr>";
        return;
    }

    recommendations.forEach(rec => {
        let row = `<tr>
            <td><img src="${rec.company_logo}" alt="${rec.company}" width="50"></td>
            <td>${rec.job_title}</td>
            <td>${rec.match_score.toFixed(2)}%</td>
            <td>${rec.missing_skills}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

/* job_details.css */

.linkedin-job-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

.job-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.company-logo {
    max-width: 80px;
    height: auto;
    margin-right: 20px;
    border-radius: 5px;
}

.job-title-company h1 {
    font-size: 1.8em;
    margin-bottom: 5px;
}

.job-title-company h2 {
    font-size: 1.2em;
    color: #666;
}

.job-details h3 {
    font-size: 1.4em;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.job-description p, .job-requirements ul {
    line-height: 1.6;
}

.job-requirements ul {
    list-style-type: disc;
    margin-left: 20px;
}

.job-actions {
    text-align: left;
    margin-top: 20px;
}

#apply-btn {
    padding: 10px 20px;
    background-color: #0077B5; /* LinkedIn blue */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#apply-btn:hover {
    background-color: #005582;
}

/* Responsive Design */
@media (max-width: 600px) {
    .linkedin-job-container {
        padding: 10px;
    }

    .company-logo {
        max-width: 60px;
        margin-right: 10px;
    }

    .job-title-company h1 {
        font-size: 1.5em;
    }
}
from flask import render_template, request, redirect, url_for, session, flash
from werkzeug.utils import secure_filename
import os
from app import app
from app.models import upload_resume  # Keep only resume upload functionality
from app.jobs import jobs
from werkzeug.utils import secure_filename
# Configure upload folder
UPLOAD_FOLDER = "static/resumes/"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/')
def home():
    return render_template('home.html')

from app.jobs import jobs

from app.jobs import jobs

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))

    # Filter jobs with match score > 80%
    filtered_jobs = [job for job in jobs if job["match_score"] > 80]


    if not filtered_jobs:
        return render_template('dashboard.html', jobs=[], message="No matching jobs found.")

    return render_template('dashboard.html', jobs=filtered_jobs)


@app.route('/upload', methods=['POST'])
def upload():
    if 'user' not in session:
        return redirect(url_for('login'))

    file = request.files.get('resume')

    if not file or file.filename == '':
        flash("No file selected!", "danger")
        return redirect(request.referrer)

    if not file.filename.endswith('.pdf'):
        flash("Only PDF files are allowed!", "danger")
        return redirect(request.referrer)

    # Ensure the upload directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    try:
        print(f"Attempting to save file: {file_path}")
        file.save(file_path)
        print(f"File saved successfully: {file_path}")

        # Simulate storing filename in DB (replace with actual DB operation)
        print(f"Resume '{filename}' uploaded for user '{session['user']}'")

        flash("Resume uploaded successfully!", "success")
    except Exception as e:
        print(f"Error saving file: {e}")
        flash(f"Error uploading resume: {e}", "danger")

    return redirect(request.referrer)
@app.route('/job/<int:job_id>')
def job_details(job_id):
    job = next((job for job in jobs if job["id"] == job_id), None)
    if not job:
        flash("Job not found", "danger")
        return redirect(url_for('dashboard'))

    return render_template('job_details.html', job=job)


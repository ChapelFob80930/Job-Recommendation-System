from flask import render_template, request, redirect, url_for, session, flash
import os
from app.jobs import jobs
from app import app, db  # Import db from your app instance
from werkzeug.utils import secure_filename
import io
import PyPDF2
import re
from app.models import User, UserSkill, JobRecommendation
from app.resume import process_resume_and_save_recommendations
# Configure upload folder
UPLOAD_FOLDER = "static/resumes/"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/')
def home():
    recommendations = []
    if 'user' in session:
        user_id = session['user']['id']
        recommendations = JobRecommendation.query.filter_by(user_id=user_id).all()
    return render_template('home.html', recommendations=recommendations)

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))

    return render_template('dashboard.html', jobs=jobs)


@app.route('/job/<int:job_id>')
def job_details(job_id):
    job = next((job for job in jobs if job["id"] == job_id), None)
    if not job:
        flash("Job not found", "danger")
        return redirect(url_for('dashboard'))

    return render_template('job_details.html', job=job)


@app.route('/upload', methods=['POST'])
def upload():
    """
    Handles resume uploads.
    Extracts skills from the uploaded resume, matches jobs, and saves recommendations.
    """
    # Check if the user is logged in
    if 'user' not in session:
        flash("User not logged in!", "danger")
        return redirect(url_for('login'))

    # Get the uploaded file
    file = request.files.get('resume')
    if not file or file.filename == '':
        flash("No file selected!", "danger")
        return redirect(request.referrer)

    # Validate file type (only PDF allowed)
    if not file.filename.endswith('.pdf'):
        flash("Only PDF files are allowed!", "danger")
        return redirect(request.referrer)

    try:
        # Read the uploaded file into a stream
        file_stream = io.BytesIO(file.read())

        # Get the user ID from the session
        user_id = session['user']['id']

        # Process the resume and save recommendations
        process_resume_and_save_recommendations(user_id, file_stream)

        flash("Resume processed and skills saved!", "success")
    except Exception as e:
        flash(f"Error processing resume: {e}", "danger")

    return redirect(request.referrer)
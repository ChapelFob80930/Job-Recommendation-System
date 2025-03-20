from flask import render_template, request, redirect, url_for, session, flash,jsonify
import os
from app.jobs import jobs
from app import app, db  # Import db from your app instance
from werkzeug.utils import secure_filename
import io
import PyPDF2
import re
from app.models import User, UserSkill, JobRecommendation
from app.resume import process_resume_and_save_recommendations
from app.nlp import fetch_skills_and_recommend_jobs
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

    user_id = session['user']['id']
    
    # Fetch match_score from JobRecommendation along with jobs
    jobs = db.session.query(JobRecommendation.job_title, JobRecommendation.match_score).filter_by(user_id=user_id).all()

    # Convert to list of dictionaries for Jinja rendering
    jobs = [{"company": job.job_title, "match_score": job.match_score} for job in jobs]

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
    if 'user' not in session:
        flash("User not logged in!", "danger")
        return redirect(url_for('login'))

    file = request.files.get('resume')
    if not file or file.filename == '':
        flash("No file selected!", "danger")
        return redirect(request.referrer)

    if not file.filename.endswith('.pdf'):
        flash("Only PDF files are allowed!", "danger")
        return redirect(request.referrer)

    try:
        file_stream = io.BytesIO(file.read())
        user_id = session['user']['id']

        # Process resume, extract skills, and save in DB
        process_resume_and_save_recommendations(user_id, file_stream)

        flash("Resume processed successfully!", "success")
    except Exception as e:
        flash(f"Error processing resume: {str(e)}", "danger")

    return redirect(url_for('home'))  # Redirect to home page
@app.route("/recommend-jobs", methods=["GET"])
def recommend_jobs():
    if "user" not in session:
        return jsonify({"error": "User not logged in"}), 401

    user_id = session["user"]["id"]  # ✅ Correctly accessing user ID

    recommendations = fetch_skills_and_recommend_jobs(user_id)
    print("Generated Recommendations:", recommendations)  # Debugging

    return jsonify(recommendations)



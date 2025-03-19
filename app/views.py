from flask import render_template, request, redirect, url_for, session, flash
from werkzeug.utils import secure_filename
import os
from app import app
from app.models import upload_resume  # Keep only resume upload functionality

# Configure upload folder
UPLOAD_FOLDER = "static/resumes/"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    return render_template('dashboard.html')  # No job recommendations for now

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        file = request.files.get('resume')
        
        if not file or file.filename == '':
            flash("No file selected!", "danger")
            return redirect(request.url)

        if not file.filename.endswith('.pdf'):
            flash("Only PDF files are allowed!", "danger")
            return redirect(request.url)
        
        # Ensure the upload directory exists
        if not os.path.exists(app.config["UPLOAD_FOLDER"]):
            os.makedirs(app.config["UPLOAD_FOLDER"])

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

        # Store filename in DB for the user
        upload_resume(session['user'], filename)

        flash("Resume uploaded successfully!", "success")
        return redirect(url_for('dashboard'))

    return render_template('upload.html')
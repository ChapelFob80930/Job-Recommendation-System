import io
import PyPDF2
from app import db
from app.models import UserSkill

def extract_text_from_pdf(file_stream):
    """
    Extracts text from a PDF file.
    """
    reader = PyPDF2.PdfReader(file_stream)
    text = " ".join([page.extract_text() or "" for page in reader.pages])
    return text.strip()

def extract_skills_from_text(text):
    """
    Extract skills from the extracted resume text.
    """
    predefined_skills = {"Python", "Java", "C++", "Django", "Flask", "Machine Learning",
                         "Deep Learning", "SQL", "AWS", "React", "Node.js", "TensorFlow"}

    words = text.split()
    extracted_skills = [word for word in words if word in predefined_skills]

    return list(set(extracted_skills))  # Remove duplicates

def process_resume_and_save_recommendations(user_id, file_stream):
    """
    Extracts text from a resume PDF, finds relevant skills, and saves them in the database.
    """
    text = extract_text_from_pdf(file_stream)
    skills = extract_skills_from_text(text)

    if not skills:
        raise ValueError("No skills found in the resume.")

    # Save extracted skills in the database
    user_skills_entry = UserSkill(user_id=user_id, skills=",".join(skills))
    db.session.add(user_skills_entry)
    db.session.commit()

    print(f"Extracted Skills for User {user_id}: {skills}")

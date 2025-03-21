import pandas as pd
from sentence_transformers import SentenceTransformer, util
from app import db
from app.models import UserSkill, JobRecommendation
from app.jobs import jobs  # Import job data

model = SentenceTransformer('all-MiniLM-L6-v2')

def match_jobs(extracted_skills):
    """
    Matches extracted skills with job requirements and provides recommendations.
    """
    recommended_jobs = []

    for job in jobs:
        required_skills = job["requirements"]
        matched_skills = [skill for skill in required_skills if skill in extracted_skills]
        missing_skills = [skill for skill in required_skills if skill not in extracted_skills]

        match_score = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
        if match_score >= 30:
            recommended_jobs.append({
                "job_title": job["position"],
                "company": job["company"],
                "company_logo": job["logo"],
                "match_score": match_score,
                "missing_skills": ", ".join(missing_skills)
            })

    return recommended_jobs

def fetch_skills_and_recommend_jobs(user_id):
    """
    Fetches user's extracted skills from DB, matches them with jobs, 
    and stores recommendations in the database.
    """
    user_skills_entry = UserSkill.query.filter_by(user_id=user_id).first()

    if not user_skills_entry:
        return []

    extracted_skills = user_skills_entry.skills.split(",")
    recommendations = match_jobs(extracted_skills)

    # Clear old recommendations for the user before adding new ones
    JobRecommendation.query.filter_by(user_id=user_id).delete()

    # Store new recommendations in the database
    for rec in recommendations:
        new_recommendation = JobRecommendation(
            user_id=user_id,
            company=rec["company"], 
            job_title=rec["job_title"],
            match_score=rec["match_score"],
            missing_skills=rec["missing_skills"]
        )
        db.session.add(new_recommendation)
    print(new_recommendation)
    db.session.commit()  # Save to database

    return recommendations


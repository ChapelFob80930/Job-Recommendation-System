import pandas as pd
from sentence_transformers import SentenceTransformer, util
from app.models import JobRecommendation
from app.jobs import jobs  # Import dummy job data

# Load the model for sentence embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

# Extended user skills dataset
user_skills_extended = [
    ["Python", "Machine Learning", "Deep Learning", "Data Science", "AI", "TensorFlow", "PyTorch"],
    ["Java", "C++", "Software Development", "Data Structures", "Algorithms", "Object-Oriented Programming (OOP)", "Agile"],
    ["AI", "Python", "Data Science", "TensorFlow", "Keras", "Deep Learning", "Reinforcement Learning"],
    ["JavaScript", "React", "Node.js", "Web Development", "CSS", "HTML", "Django", "Flask"],
    ["Python", "SQL", "Data Analysis", "Pandas", "Data Visualization", "Tableau", "NumPy"],
    ["AWS", "Cloud Computing", "DevOps", "Docker", "Kubernetes", "CI/CD", "Terraform", "Ansible"],
    ["C++", "Machine Learning", "Data Structures", "Algorithms", "Big Data", "Spark", "Hadoop"],
    ["Python", "TensorFlow", "Deep Learning", "AI", "NLP", "Generative Adversarial Networks (GANs)"],
    ["SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "Databases", "Data Warehousing", "ETL Pipelines"],
    ["Java", "Spring", "Software Development", "API Design", "Microservices", "Agile"],
    ["HTML", "CSS", "JavaScript", "React", "Node.js", "Vue.js", "Web Development"],
    ["C++", "Machine Learning", "AI", "Deep Learning", "Quantum Computing", "Qiskit"],
    ["Java", "C++", "Data Science", "SQL", "Data Visualization", "Big Data", "Apache Spark"],
    ["Git", "GitHub", "Version Control", "Software Development", "Collaborative Development", "GitLab"],
    ["Python", "Flask", "Web Development", "Backend", "SQL", "Microservices", "API"],
    ["Python", "AI", "Deep Learning", "Computer Vision", "TensorFlow", "PyTorch"],
    ["JavaScript", "React", "Node.js", "MongoDB", "Full Stack Development", "Microservices"],
    ["Ethical Hacking", "Cybersecurity", "Penetration Testing", "Network Security", "VPN", "Load Balancing"],
    ["Java", "C++", "Python", "Machine Learning", "AI", "Data Science", "Data Structures", "Cloud Computing"],
    ["Blockchain", "Ethereum", "Solidity", "Smart Contracts", "Cryptocurrency", "Distributed Systems"],
    ["SQL", "Data Science", "Tableau", "Data Visualization", "Hadoop", "Apache Spark"],
    ["C++", "Data Structures", "Algorithms", "Software Engineering", "System Design", "Concurrency"],
    ["DevOps", "AWS", "Docker", "CI/CD", "Kubernetes", "Jenkins", "Cloud Infrastructure"],
    ["Rust", "Systems Programming", "Concurrency", "Performance Optimization", "Linux", "Embedded Systems"],
    ["Python", "Deep Learning", "NLP", "PyTorch", "AI", "BERT"],
    ["Java", "Spring Boot", "Microservices", "Backend Development", "RESTful APIs", "Cloud Platforms"],
    ["Git", "GitLab", "Version Control", "Collaborative Development", "CI/CD", "TDD"],
    ["C#", "Unity", "Game Development", "Unreal Engine", "Game Design", "3D Modeling"],
    ["Python", "Raspberry Pi", "Arduino", "IoT", "Embedded Systems", "Sensor Networks"],
    ["Selenium", "Automation", "Puppet", "Ansible", "CI/CD", "Test Automation"],
    ["Quantum Computing", "Qiskit", "Quantum Algorithms", "AI", "Machine Learning"],
    ["AI", "Ethics", "Fairness", "Accountability", "Bias in AI", "AI Transparency"],
    ["Selenium", "JUnit", "TestNG", "Test Automation", "Behavior-Driven Development (BDD)", "Software Testing"],
    ["C++", "Data Structures", "Algorithms", "Cloud Computing", "Big Data", "Data Engineering"]
]

# Create a DataFrame of skills
df_extended = pd.DataFrame({"User_Skills": user_skills_extended})
skills_list = set(df_extended.explode("User_Skills")["User_Skills"].dropna().unique())


def extract_skills(resume_text):
    extracted_skills = []
    resume_embedding = model.encode(resume_text, convert_to_tensor=True)

    for skill in skills_list:
        skill_embedding = model.encode(skill, convert_to_tensor=True)
        similarity = util.pytorch_cos_sim(resume_embedding, skill_embedding).item()

        if similarity > 0.2:  # Adjust threshold as needed
            extracted_skills.append(skill)

    return extracted_skills


def match_jobs(extracted_skills):
    recommended_jobs = []

    for job in jobs:  # Use dummy job data
        required_skills = job["requirements"]
        matched_skills = [skill for skill in required_skills if skill in extracted_skills]
        missing_skills = [skill for skill in required_skills if skill not in extracted_skills]

        match_score = len(matched_skills) / len(required_skills) * 100  # Calculate match score as percentage
        if match_score >= 30:  # Only consider jobs with a match score of 30% or higher
            recommended_jobs.append({
                "job_title": job["position"],
                "match_score": match_score,
                "missing_skills": ",".join(missing_skills),
            })

    return recommended_jobs


def save_recommendations(user_id, extracted_skills):
    # Match jobs based on extracted skills
    recommendations = match_jobs(extracted_skills)

    # Save recommendations to the database
    for rec in recommendations:
        job_recommendation = JobRecommendation(
            user_id=user_id,
            job_title=rec["job_title"],
            match_score=rec["match_score"],
            missing_skills=rec["missing_skills"]
        )
        db.session.add(job_recommendation)
    db.session.commit()
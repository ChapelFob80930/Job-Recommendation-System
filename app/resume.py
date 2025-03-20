import io
import PyPDF2
import re
from app.nlp import extract_skills, save_recommendations

def extract_skills_from_pdf(file_stream):
    """
    Extracts predefined skills from a PDF file using regex.
    """
    try:
        pdf_reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""

        # Extract predefined skills using regex
        skills = re.findall(
            r"\b(Python|Java|C\+\+|C|JavaScript|SQL|HTML|CSS|React|Node\.js|Django|Flask|TensorFlow|AWS|Azure|Docker|Kubernetes|Linux|MongoDB|Swift|Kotlin|Flutter|Salesforce|Apex|Lightning|OpenCV|Cybersecurity|WebRTC|Verilog|VHDL|FPGA|RTOS|Microcontrollers|PL/SQL|Spring Boot|MySQL|Shell Scripting)\b",
            text,
            re.IGNORECASE,
        )
        return list(set(skills))  # Return unique skills
    except Exception as e:
        print(f"Error extracting skills: {e}")
        return []


def process_resume_and_save_recommendations(user_id, file_stream):
    """
    Processes the uploaded resume, extracts skills, matches jobs, and saves recommendations.
    """
    # Extract text from the uploaded PDF
    resume_text = extract_skills_from_pdf(file_stream)

    # Extract skills using NLP logic
    extracted_skills = extract_skills(resume_text)

    # Save recommendations to the database
    save_recommendations(user_id, extracted_skills)
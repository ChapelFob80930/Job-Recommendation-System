from app import supabase

def create_user(email, password):
    return supabase.auth.sign_up({"email": email, "password": password})

def login_user(email, password):
    return supabase.auth.sign_in_with_password({"email": email, "password": password})

def upload_resume(user_id, filename):
    data = {"user_id": user_id, "resume": filename}
    return supabase.table("resumes").insert(data).execute()

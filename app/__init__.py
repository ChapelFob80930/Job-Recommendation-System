from flask import Flask
from supabase import create_client
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

# Supabase Connection
SUPABASE_URL = "https://xilivqaejwkathgrvtmw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbGl2cWFlandrYXRoZ3J2dG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzIxMDcsImV4cCI6MjA1Nzk0ODEwN30.zg7LUttYcHHSpRE_nFN2cuzqAOr4oZhWJH3QgcPGXjE"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Database Connection (SQLAlchemy)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:Jitpdx@742004@db.xilivqaejwkathgrvtmw.supabase.co:5432/postgres"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

from app import views, auth

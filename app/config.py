import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'  # SQLite database file
    SQLALCHEMY_TRACK_MODIFICATIONS = False
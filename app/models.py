from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)  # Added username field
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class UserSkill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    skills = db.Column(db.Text, nullable=False)

def create_user(username, email, password):
    """Create a new user."""
    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return False  # User with this email or username already exists
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return True


def login_user(email, password):
    """Authenticate a user."""
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user  # Return the user object if authentication succeeds
    return None  # Return None if authentication fails
class JobRecommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    job_title = db.Column(db.String(100), nullable=False)
    match_score = db.Column(db.Float, nullable=False)
    missing_skills = db.Column(db.String(255), nullable=True)
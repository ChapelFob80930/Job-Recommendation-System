from flask import request, session, redirect, url_for, flash, render_template
from app import app
from app.models import create_user, login_user

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        response = create_user(email, password)
        if response:
            flash("Account created successfully!", "success")
            # Removed redirect(url_for('login'))
        else:
            flash("Error creating account", "danger")
    return render_template('auth.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        response = login_user(email, password)
        if response:
            session['user'] = response.user.id
            return redirect(url_for('home'))
        else:
            flash("Invalid credentials", "danger")
    return render_template('auth.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))
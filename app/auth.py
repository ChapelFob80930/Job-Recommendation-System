from flask import request, session, redirect, url_for, flash, render_template
from app import app
from app.models import create_user, login_user

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']

        if password != confirm_password:
            flash("Passwords do not match", "danger")
        else:
            response = create_user(username, email, password)
            if response:
                flash("Account created successfully!", "success")
            else:
                flash("Error creating account. Username or email already exists.", "danger")

    return render_template('auth.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        response = login_user(email, password)
        if response:
            session['user'] = {'id': response.id}  # Store user id as dictionary
            return redirect(url_for('home'))
        else:
            flash("Invalid credentials", "danger")
    return render_template('auth.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))
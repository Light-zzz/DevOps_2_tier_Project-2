import os
import time
import pymysql
from flask import Flask, render_template, request, redirect, url_for, session, g
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Configure Flask secret key from environment variable
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'supersecretkey')

# MySQL Configuration from docker-compose environment variables
MYSQL_CONFIG = {
    'host': os.environ.get('MYSQL_HOST', 'db'),
    'user': os.environ.get('MYSQL_USER', 'root'),
    'password': os.environ.get('MYSQL_PASSWORD', 'root'),
    'database': os.environ.get('MYSQL_DATABASE', 'registration_db'),
    'port': int(os.environ.get('MYSQL_PORT', 3306)),
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db():
    """Get MySQL database connection"""
    if 'db' not in g:
        g.db = pymysql.connect(**MYSQL_CONFIG)
    return g.db

@app.teardown_appcontext
def close_db(error):
    """Close database connection"""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_database():
    """Initialize database and create users table if it doesn't exist"""
    max_retries = 30
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Test database connection
            conn = pymysql.connect(**MYSQL_CONFIG)
            cur = conn.cursor()
            
            # Create users table if it doesn't exist
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.commit()
            cur.close()
            conn.close()
            
            print("✅ Database initialized successfully!")
            print(f"✅ Users table created/verified in database: {MYSQL_CONFIG['database']}")
            return True
            
        except Exception as e:
            retry_count += 1
            if retry_count >= max_retries:
                print(f"❌ Failed to initialize database after {max_retries} attempts: {str(e)}")
                raise
            print(f"⏳ Waiting for MySQL to be ready... (Attempt {retry_count}/{max_retries})")
            time.sleep(2)
    
    return False

@app.route('/')
def home():
    if 'username' in session:
        return render_template('index.html', username=session['username'])
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        # Hash the password before storing
        hashed_password = generate_password_hash(password)
        
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute(
                "INSERT INTO users(username, email, password) VALUES (%s, %s, %s)",
                (username, email, hashed_password)
            )
            db.commit()
            cur.close()
            
            return redirect(url_for('login'))
        except Exception as e:
            error_msg = "Registration failed. Username or email may already exist."
            print(f"Registration error: {str(e)}")
            return render_template('registration.html', error=error_msg)
    
    return render_template('registration.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        try:
            db = get_db()
            cur = db.cursor()
            cur.execute("SELECT * FROM users WHERE username=%s", (username,))
            user = cur.fetchone()
            cur.close()
            
            if user and check_password_hash(user['password'], password):
                session['username'] = username
                return redirect(url_for('home'))
            
            return render_template('login.html', error="Invalid username or password")
        except Exception as e:
            print(f"Login error: {str(e)}")
            return render_template('login.html', error="Login failed. Please try again.")
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == "__main__":
    # Initialize database before starting the app
    print("🚀 Starting Flask application...")
    print(f"📊 Connecting to MySQL at {MYSQL_CONFIG['host']}:{MYSQL_CONFIG['port']}")
    print(f"📁 Database: {MYSQL_CONFIG['database']}")
    
    init_database()
    
    print("🌐 Flask app is ready!")
    app.run(host="0.0.0.0", port=5000, debug=False)

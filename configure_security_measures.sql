from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from flask_cors import CORS
import psycopg2
import redis
import os

app = Flask(__name__)
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY','super-secret')
jwt = JWTManager(app)

# Configure Redis Cache
cache = redis.Redis(host='redis', port=6379)

# Configure PostgreSQL Database
def get_db_connection():
    conn = psycopg2.connect(
        host="db",
        database="digital_clock",
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS')
    )
    return conn

@app.route('/auth/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    # Authenticate user (This is a placeholder, replace with actual authentication logic)
    if username == 'user' and password == 'pass':
        access_token = create_access_token(identity=username)
        return jsonify(token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401

@app.route('/auth/validate', methods=['GET'])
@jwt_required()
def validate():
    return jsonify(valid=True)

@app.route('/time', methods=['GET'])
@jwt_required()
def get_time():
    cached_time = cache.get('current_time')
    if cached_time:
        return jsonify({"time": cached_time.decode('utf-8')})

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT current_timestamp AS time;")
    current_time = cur.fetchone()[0]
    cur.close()
    conn.close()

    cache.set('current_time', current_time)
    return jsonify({"time": current_time})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
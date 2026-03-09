from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_talisman import Talisman
import jwt
import redis
import os

app = Flask(__name__)
CORS(app)

# Configure Talisman for HTTPS and CSP
talisman = Talisman(app)
talisman.content_security_policy = {
    'default-src': ["'self'"],
   'script-src': ["'self'", "'unsafe-inline'"],
   'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:'],
    'connect-src': ["'self'", 'https://example.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
}

# Redis cache configuration
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = os.getenv('REDIS_PORT', 6379)
cache = redis.Redis(host=redis_host, port=redis_port)

# Secret key for JWT
secret_key = os.getenv('SECRET_KEY','super-secret-key')

# Mock database
users = {
    'user1': {
        'password': 'password1',
        'role': 'admin'
    },
    'user2': {
        'password': 'password2',
        'role': 'user'
    }
}

def get_current_time():
    # Mock time service
    import datetime
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@app.route('/time', methods=['GET'])
def get_time():
    cached_time = cache.get('current_time')
    if cached_time:
        return jsonify({'time': cached_time.decode('utf-8')})
    
    current_time = get_current_time()
    cache.set('current_time', current_time)
    return jsonify({'time': current_time})

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username in users and users[username]['password'] == password:
        token = jwt.encode({'username': username, 'role': users[username]['role']}, secret_key, algorithm='HS256')
        return jsonify({'token': token})
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/auth/validate', methods=['GET'])
def validate_token():
    token = request.headers.get('Authorization').split()[1]
    try:
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
        return jsonify({'valid': True, 'role': decoded_token['role']})
    except jwt.ExpiredSignatureError:
        return jsonify({'valid': False}), 401
    except jwt.InvalidTokenError:
        return jsonify({'valid': False}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
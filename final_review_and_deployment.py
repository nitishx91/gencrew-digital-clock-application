import os
import json
import requests
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from flask_cors import CORS
from redis import Redis
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
CORS(app)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY','super-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI','sqlite:///users.db')
app.config['REDIS_URL'] = os.getenv('REDIS_URL','redis://localhost:6379/0')

# Initialize database
Base = declarative_base()
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
Session = sessionmaker(bind=engine)
session = Session()

# Initialize Redis
redis_client = Redis.from_url(app.config['REDIS_URL'])

# JWT Manager
jwt = JWTManager(app)

# User model
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

Base.metadata.create_all(engine)

# Mock user data
users = [
    {"username": "user", "password": "pass"}
]

# Create users in the database
for user in users:
    new_user = User(username=user['username'], password=user['password'])
    session.add(new_user)
session.commit()

# Authentication endpoint
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = session.query(User).filter_by(username=username).first()
    if user and user.password == password:
        access_token = create_access_token(identity=username)
        return jsonify(token=access_token)
    return jsonify({"msg": "Bad username or password"}), 401

# Validate JWT token
@app.route('/auth/validate', methods=['GET'])
@jwt_required()
def validate():
    return jsonify(valid=True)

# Time service endpoint
@app.route('/time', methods=['GET'])
@jwt_required()
def get_time():
    current_time = requests.get('http://worldtimeapi.org/api/ip').json().get('datetime')
    cache_key = 'current_time'
    cached_time = redis_client.get(cache_key)
    
    if cached_time:
        return jsonify({"time": cached_time.decode('utf-8')})
    
    redis_client.setex(cache_key, 60, current_time)  # Cache for 60 seconds
    return jsonify({"time": current_time})

if __name__ == '__main__':
    app.run(debug=True)
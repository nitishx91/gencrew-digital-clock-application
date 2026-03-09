import redis

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def get_current_time():
    # Check if the current time is in the cache
    cached_time = r.get('current_time')
    if cached_time:
        return cached_time

    # If not in cache, fetch from the database
    # Simulate fetching from a database
    current_time = "2024-06-18 12:34:56"
    
    # Cache the current time for future requests
    r.set('current_time', current_time, ex=60)  # Expires in 60 seconds

    return current_time

# Example usage
print(get_current_time())
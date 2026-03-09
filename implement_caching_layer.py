import redis

# Connect to Redis server
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def get_current_time():
    # Check if current time is in cache
    cached_time = redis_client.get('current_time')
    if cached_time:
        return cached_time

    # If not in cache, fetch from database and cache it
    current_time = fetch_time_from_database()
    redis_client.setex('current_time', 60, current_time)  # Cache for 60 seconds
    return current_time

def fetch_time_from_database():
    # Placeholder function to simulate fetching time from database
    import datetime
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Example usage
if __name__ == "__main__":
    print(get_current_time())
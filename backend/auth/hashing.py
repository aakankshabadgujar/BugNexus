import bcrypt

def get_password_hash(password: str) -> str:
    # 1. Convert password string to bytes
    pwd_bytes = password.encode('utf-8')
    # 2. Generate salt and hash
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    # 3. Return as string for database storage
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Convert both to bytes and compare
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )
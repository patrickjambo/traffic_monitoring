from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.core import security

def create_user():
    db = SessionLocal()
    email = "admin@traffic.com"
    password = "password123"
    
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if user:
        print(f"User {email} already exists. Updating password.")
        user.password_hash = security.get_password_hash(password)
    else:
        print(f"Creating user {email}")
        user = User(
            email=email,
            password_hash=security.get_password_hash(password),
            full_name="System Admin",
            role=UserRole.ADMIN,
            phone_number="0780000000",
            department="IT"
        )
        db.add(user)
    
    db.commit()
    print(f"User {email} created/updated with password: {password}")
    db.close()

if __name__ == "__main__":
    create_user()

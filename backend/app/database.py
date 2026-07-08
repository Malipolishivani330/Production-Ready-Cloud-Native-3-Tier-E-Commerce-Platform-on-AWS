import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read DATABASE_URL from Docker environment.
# If not running in Docker, use localhost.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:#M1a2l3i4@localhost:5432/ecommerce_db"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
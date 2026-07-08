from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app import models, schemas, crud

# Create database tables
models.Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI(
    title="Production Ready E-Commerce API",
    description="A Dockerized FastAPI CRUD API for an E-Commerce Application",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Home Route
@app.get("/")
def home():
    return {
        "message": "Production Ready E-Commerce API",
        "status": "Running Successfully",
        "version": "1.0.0"
    }

# Create Product
@app.post("/products")
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    return crud.create_product(db, product)

# Get All Products
@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    return crud.get_products(db)

# Update Product
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    return crud.update_product(db, product_id, product)

# Delete Product
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return crud.delete_product(db, product_id)
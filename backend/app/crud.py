from sqlalchemy.orm import Session
from app import models, schemas


def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        image=product.image
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_products(db: Session):
    return db.query(models.Product).all()


def update_product(db: Session, product_id: int, product: schemas.ProductCreate):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not db_product:
        return {"message": "Product not found"}

    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.image = product.image

    db.commit()
    db.refresh(db_product)

    return db_product


def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not db_product:
        return {"message": "Product not found"}

    db.delete(db_product)
    db.commit()

    return {"message": "Product deleted successfully"}
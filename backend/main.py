from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from models import CoffeeBean, SessionLocal, engine
import os
from pydantic import BaseModel

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CoffeeBeanCreate(BaseModel):
    name: str
    roaster: str
    origin: str
    roast_level: str
    price: float
    weight: float
    rank: int
    dose: float
    yield_ml: float
    brew_time: float
    temperature: float
    grind_size: str
    order_again: str
    tasting_notes: str

class CoffeeBeanUpdate(BaseModel):
    name: str = None
    roaster: str = None
    origin: str = None
    roast_level: str = None
    price: float = None
    weight: float = None
    rank: int = None
    dose: float = None
    yield_ml: float = None
    brew_time: float = None
    temperature: float = None
    grind_size: str = None
    order_again: str = None
    tasting_notes: str = None

@app.get("/api/beans")
def list_beans(db: Session = Depends(get_db)):
    return db.query(CoffeeBean).all()

@app.post("/api/beans")
def create_bean(bean: CoffeeBeanCreate, db: Session = Depends(get_db)):
    db_bean = CoffeeBean(**bean.dict())
    db.add(db_bean)
    db.commit()
    db.refresh(db_bean)
    return db_bean

@app.put("/api/beans/{id}")
def update_bean(id: int, bean: CoffeeBeanUpdate, db: Session = Depends(get_db)):
    db_bean = db.query(CoffeeBean).filter(CoffeeBean.id == id).first()
    if not db_bean:
        raise HTTPException(status_code=404, detail="Bean not found")
    bean_data = bean.dict(exclude_unset=True)
    for key, value in bean_data.items():
        setattr(db_bean, key, value)
    db.commit()
    db.refresh(db_bean)
    return db_bean

@app.delete("/api/beans/{id}")
def delete_bean(id: int, db: Session = Depends(get_db)):
    db_bean = db.query(CoffeeBean).filter(CoffeeBean.id == id).first()
    if not db_bean:
        raise HTTPException(status_code=404, detail="Bean not found")
    db.delete(db_bean)
    db.commit()
    return {"detail": "Bean deleted"}
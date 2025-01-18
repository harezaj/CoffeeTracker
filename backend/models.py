from sqlalchemy import Column, Integer, String, Float, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class CoffeeBean(Base):
    __tablename__ = "coffee_beans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    roaster = Column(String)
    origin = Column(String)
    roast_level = Column(String)
    price = Column(Float)
    weight = Column(Float)
    rank = Column(Integer)
    dose = Column(Float)
    yield_ml = Column(Float)
    brew_time = Column(Float)
    temperature = Column(Float)
    grind_size = Column(String)
    order_again = Column(String)
    tasting_notes = Column(String)

# Engine and session setup
engine = create_engine('sqlite:///./coffee_beans.db')
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)
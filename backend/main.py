from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AWS Route53 Clone API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Route53 Clone API"}

# Auth
@app.post("/api/auth/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if not db_user or db_user.password_hash != user.password + "hashed":
        if not db_user:
            db_user = crud.create_user(db, user)
        else:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"message": "Login successful", "user": {"id": db_user.id, "username": db_user.username}}

@app.post("/api/auth/logout")
def logout():
    return {"message": "Logout successful"}

# Hosted Zones
@app.get("/api/hostedzones", response_model=List[schemas.HostedZone])
def read_hosted_zones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    zones = crud.get_hosted_zones(db, skip=skip, limit=limit)
    return zones

@app.get("/api/hostedzones/{zone_id}", response_model=schemas.HostedZone)
def read_hosted_zone(zone_id: str, db: Session = Depends(get_db)):
    db_zone = crud.get_hosted_zone(db, zone_id=zone_id)
    if db_zone is None:
        raise HTTPException(status_code=404, detail="Hosted zone not found")
    return db_zone

@app.post("/api/hostedzones", response_model=schemas.HostedZone)
def create_hosted_zone(zone: schemas.HostedZoneCreate, db: Session = Depends(get_db)):
    return crud.create_hosted_zone(db=db, zone=zone)

@app.put("/api/hostedzones/{zone_id}", response_model=schemas.HostedZone)
def update_hosted_zone(zone_id: str, zone: schemas.HostedZoneUpdate, db: Session = Depends(get_db)):
    return crud.update_hosted_zone(db, zone_id, zone)

@app.delete("/api/hostedzones/{zone_id}")
def delete_hosted_zone(zone_id: str, db: Session = Depends(get_db)):
    crud.delete_hosted_zone(db, zone_id)
    return {"message": "Hosted zone deleted"}

# DNS Records
@app.get("/api/hostedzones/{zone_id}/records", response_model=List[schemas.DnsRecord])
def read_records(zone_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_records(db, zone_id=zone_id, skip=skip, limit=limit)

@app.post("/api/hostedzones/{zone_id}/records", response_model=schemas.DnsRecord)
def create_record(zone_id: str, record: schemas.DnsRecordCreate, db: Session = Depends(get_db)):
    return crud.create_record(db=db, zone_id=zone_id, record=record)

@app.put("/api/records/{record_id}", response_model=schemas.DnsRecord)
def update_record(record_id: str, record: schemas.DnsRecordUpdate, db: Session = Depends(get_db)):
    return crud.update_record(db, record_id, record)

@app.delete("/api/records/{record_id}")
def delete_record(record_id: str, db: Session = Depends(get_db)):
    crud.delete_record(db, record_id)
    return {"message": "Record deleted"}

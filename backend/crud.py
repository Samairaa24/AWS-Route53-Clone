from sqlalchemy.orm import Session
import models, schemas

# Auth CRUD (Mocked)
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Mocked hashing
    db_user = models.User(username=user.username, password_hash=user.password + "hashed")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Hosted Zones CRUD
def get_hosted_zones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.HostedZone).offset(skip).limit(limit).all()

def get_hosted_zone(db: Session, zone_id: str):
    return db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()

def create_hosted_zone(db: Session, zone: schemas.HostedZoneCreate):
    db_zone = models.HostedZone(**zone.model_dump())
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    # Automatically add NS and SOA records (mocked)
    ns_record = models.DnsRecord(
        hosted_zone_id=db_zone.id,
        name=db_zone.name,
        type="NS",
        value="ns-1.awsdns-route53.com.\nns-2.awsdns-route53.org.",
        ttl=172800,
        routing_policy="Simple"
    )
    soa_record = models.DnsRecord(
        hosted_zone_id=db_zone.id,
        name=db_zone.name,
        type="SOA",
        value="ns-1.awsdns-route53.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400",
        ttl=900,
        routing_policy="Simple"
    )
    db.add(ns_record)
    db.add(soa_record)
    db_zone.record_count = 2
    db.commit()
    
    return db_zone

def update_hosted_zone(db: Session, zone_id: str, zone: schemas.HostedZoneUpdate):
    db_zone = get_hosted_zone(db, zone_id)
    if db_zone:
        update_data = zone.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_zone, key, value)
        db.commit()
        db.refresh(db_zone)
    return db_zone

def delete_hosted_zone(db: Session, zone_id: str):
    db_zone = get_hosted_zone(db, zone_id)
    if db_zone:
        db.delete(db_zone)
        db.commit()
    return db_zone

# DNS Records CRUD
def get_records(db: Session, zone_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.DnsRecord).filter(models.DnsRecord.hosted_zone_id == zone_id).offset(skip).limit(limit).all()

def get_record(db: Session, record_id: str):
    return db.query(models.DnsRecord).filter(models.DnsRecord.id == record_id).first()

def create_record(db: Session, zone_id: str, record: schemas.DnsRecordCreate):
    db_record = models.DnsRecord(**record.model_dump(), hosted_zone_id=zone_id)
    db.add(db_record)
    
    # Update record count
    db_zone = get_hosted_zone(db, zone_id)
    if db_zone:
        db_zone.record_count += 1
        
    db.commit()
    db.refresh(db_record)
    return db_record

def update_record(db: Session, record_id: str, record: schemas.DnsRecordUpdate):
    db_record = get_record(db, record_id)
    if db_record:
        update_data = record.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_record, key, value)
        db.commit()
        db.refresh(db_record)
    return db_record

def delete_record(db: Session, record_id: str):
    db_record = get_record(db, record_id)
    if db_record:
        zone_id = db_record.hosted_zone_id
        db.delete(db_record)
        
        # Update record count
        db_zone = get_hosted_zone(db, zone_id)
        if db_zone:
            db_zone.record_count -= 1
            
        db.commit()
    return db_record

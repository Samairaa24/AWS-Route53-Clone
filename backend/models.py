from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Integer, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)

class HostedZone(Base):
    __tablename__ = "hosted_zones"
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    name = Column(String, index=True)
    caller_reference = Column(String, unique=True, index=True, default=generate_uuid)
    comment = Column(String, nullable=True)
    is_private = Column(Boolean, default=False)
    record_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    records = relationship("DnsRecord", back_populates="hosted_zone", cascade="all, delete-orphan")

class DnsRecord(Base):
    __tablename__ = "dns_records"
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    hosted_zone_id = Column(String, ForeignKey("hosted_zones.id"))
    name = Column(String, index=True)
    type = Column(String, index=True) # A, AAAA, CNAME, etc.
    value = Column(String)
    ttl = Column(Integer, default=300)
    routing_policy = Column(String, default="Simple")
    
    hosted_zone = relationship("HostedZone", back_populates="records")

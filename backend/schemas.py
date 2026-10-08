from pydantic import BaseModel
from typing import List, Optional
import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    class Config:
        from_attributes = True

class DnsRecordBase(BaseModel):
    name: str
    type: str
    value: str
    ttl: Optional[int] = 300
    routing_policy: Optional[str] = "Simple"

class DnsRecordCreate(DnsRecordBase):
    pass

class DnsRecordUpdate(DnsRecordBase):
    pass

class DnsRecord(DnsRecordBase):
    id: str
    hosted_zone_id: str
    class Config:
        from_attributes = True

class HostedZoneBase(BaseModel):
    name: str
    comment: Optional[str] = None
    is_private: Optional[bool] = False

class HostedZoneCreate(HostedZoneBase):
    pass

class HostedZoneUpdate(HostedZoneBase):
    pass

class HostedZone(HostedZoneBase):
    id: str
    caller_reference: str
    record_count: int
    created_at: datetime.datetime
    
    class Config:
        from_attributes = True

class HostedZoneWithRecords(HostedZone):
    records: List[DnsRecord] = []

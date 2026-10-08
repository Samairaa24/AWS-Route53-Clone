# AWS Route53 Clone

This is a clone of the AWS Route 53 console for managing Hosted Zones and DNS Records. It aims to replicate the core workflows and UI/UX of Route 53 using modern web technologies.

## Hosted Working Link
🔗 **[https://awsclone.vercel.app](https://awsclone.vercel.app)**

## Architecture Overview

- **Frontend**: Next.js 14 (App Router), React, TypeScript. Vanilla CSS mimics the AWS UI.
- **Backend**: FastAPI (Python), SQLAlchemy for ORM.
- **Database**: SQLite (local persistence).

The frontend communicates with the backend via RESTful APIs. Next.js uses standard API proxies (configured in `next.config.js`) to handle CORS issues and map `/api/*` to the FastAPI backend. 

## Database Schema

- **Users**: 
  - `id` (PK, UUID)
  - `username` (String)
  - `password_hash` (String)

- **HostedZones**: 
  - `id` (PK, UUID)
  - `name` (String)
  - `caller_reference` (String)
  - `comment` (String)
  - `is_private` (Boolean)
  - `record_count` (Integer)
  - `created_at` (DateTime)

- **DnsRecords**:
  - `id` (PK, UUID)
  - `hosted_zone_id` (FK to HostedZones.id)
  - `name` (String)
  - `type` (String - A, AAAA, CNAME, etc.)
  - `value` (String)
  - `ttl` (Integer)
  - `routing_policy` (String)

## API Overview

### Hosted Zones
- `GET /api/hostedzones`: List all hosted zones.
- `GET /api/hostedzones/{zone_id}`: Retrieve a specific hosted zone.
- `POST /api/hostedzones`: Create a new hosted zone (automatically creates default NS and SOA records).
- `DELETE /api/hostedzones/{zone_id}`: Delete a hosted zone and its associated records.

### DNS Records
- `GET /api/hostedzones/{zone_id}/records`: List all records for a hosted zone.
- `POST /api/hostedzones/{zone_id}/records`: Create a new DNS record.
- `DELETE /api/records/{record_id}`: Delete a specific DNS record.

### Auth (Mocked)
- `POST /api/auth/login`: Mock login system.
- `POST /api/auth/logout`: Mock logout.

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the FastAPI server: `uvicorn main:app --reload`
6. The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the application at `http://localhost:3000`.

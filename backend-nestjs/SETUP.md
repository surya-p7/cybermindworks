# NestJS Backend Setup

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE jobmanagement;
```

3. **IMPORTANT:** If you have existing data, reset the database:
```bash
# Connect to PostgreSQL
psql -U postgres -d jobmanagement

# Run the reset script
\i reset-database.sql
```

4. Create a `.env` file in the backend-nestjs directory with the following content:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=jobmanagement

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. The application will automatically create tables on first run (synchronize: true)
3. TypeORM will create all necessary tables with proper relationships

## Running the Application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication (NEW!)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile (requires auth)

### Users (NEW!)
- `GET /users/profile` - Get current user profile with applications and jobs (requires auth)
- `PATCH /users/profile` - Update user profile (requires auth)
- `GET /users/:id` - Get user by ID (public)

### Jobs
- `GET /jobs` - Get all jobs (public)
- `GET /jobs/:id` - Get a specific job with applicants (public)
- `GET /jobs/my-jobs` - Get jobs posted by current user (requires auth)
- `POST /jobs` - Create a new job (requires auth)
- `PATCH /jobs/:id` - Update a job (requires auth, only by poster)
- `DELETE /jobs/:id` - Delete a job (requires auth, only by poster)

### Applications (NEW!)
- `POST /applications` - Apply to a job (requires auth)
- `GET /applications/my-applications` - Get current user's applications (requires auth)
- `GET /applications/job/:jobId` - Get all applicants for a job (requires auth, only by job poster)
- `PATCH /applications/:id/status` - Update application status (requires auth, only by job poster)

## API Documentation
Visit `http://localhost:3001/api` for interactive Swagger documentation

## Example Requests

### 1. Register a User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "role": "employer",
    "phone": "+1234567890",
    "location": "New York, USA"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
Response will include `access_token` - use this for authenticated requests.

### 3. Create a Job (Requires Authentication)
```bash
curl -X POST http://localhost:3001/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Senior Frontend Developer",
    "company": "Tech Corp",
    "location": "New York",
    "jobType": "Full-time",
    "salary": "$120,000 - $150,000",
    "description": "We are looking for an experienced frontend developer...",
    "requirements": "5+ years of React experience",
    "responsibilities": "Build and maintain web applications",
    "deadline": "2024-12-31"
  }'
```

### 4. Apply to a Job (Requires Authentication)
```bash
curl -X POST http://localhost:3001/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jobId": "job-uuid-here",
    "coverLetter": "I am very interested in this position...",
    "resume": "https://example.com/resume.pdf"
  }'
```

## Testing

Run the comprehensive test suite:
```bash
# Make sure backend is running
npm run start:dev

# In another terminal
cd ..
node test-auth-flow.js
```

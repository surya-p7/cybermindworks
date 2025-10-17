# Quick Start Guide - Updated Job Portal

## ⚠️ IMPORTANT: Database Reset Required

The backend has been updated with authentication and new database relationships. You need to reset your database before starting.

---

## Step 1: Reset Database

### Option A: Using psql (Recommended)
```bash
# Open PowerShell and connect to PostgreSQL
psql -U postgres

# Switch to your database
\c jobmanagement

# Drop all tables
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

# Exit psql
\q
```

### Option B: Using SQL File
```bash
# Navigate to backend directory
cd backend-nestjs

# Run the reset script
psql -U postgres -d jobmanagement -f reset-database.sql
```

---

## Step 2: Update Environment Variables

Make sure your `backend-nestjs/.env` file has these variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=surya213
DB_NAME=jobmanagement

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT Secret (REQUIRED!)
JWT_SECRET=my-super-secret-jwt-key-for-development-change-in-production
```

---

## Step 3: Start Backend

```bash
cd backend-nestjs
npm run start:dev
```

**Wait for this message:**
```
Application is running on: http://localhost:3001
```

TypeORM will automatically create all tables with the new schema.

---

## Step 4: Test Backend (Optional but Recommended)

Open a new terminal:

```bash
cd cybermindworks-repo
node test-auth-flow.js
```

This will run 14 tests covering:
- User registration & login
- Job creation with authentication
- Job applications
- Viewing applicants
- Profile management

---

## Step 5: Start Frontend

```bash
cd frontend
npm start
```

---

## What's New?

### ✅ Authentication System
- Users must register/login to post jobs or apply
- JWT token-based authentication
- Secure password hashing

### ✅ Job Applications Working
- Users can apply to jobs with cover letter
- Prevents duplicate applications
- Job posters can view all applicants

### ✅ User Profiles
- View all your applications
- View all your posted jobs
- Update profile information

### ✅ Authorization
- Only job posters can edit/delete their jobs
- Only job posters can view applicants
- Only job posters can update application status

---

## API Endpoints

### Public Endpoints (No Auth Required)
- `GET /jobs` - View all jobs
- `GET /jobs/:id` - View job details
- `POST /auth/register` - Register
- `POST /auth/login` - Login

### Protected Endpoints (Auth Required)
- `POST /jobs` - Create job
- `POST /applications` - Apply to job
- `GET /applications/my-applications` - View your applications
- `GET /applications/job/:jobId` - View job applicants (poster only)
- `GET /users/profile` - View your profile
- `PATCH /users/profile` - Update profile

---

## Swagger Documentation

Visit: **http://localhost:3001/api**

Interactive API documentation with:
- All endpoints
- Request/response examples
- Try it out feature
- Bearer token authentication

---

## Troubleshooting

### Backend won't start - "column posted_by_id contains null values"
**Solution:** You didn't reset the database. Follow Step 1 again.

### Backend won't start - "JWT_SECRET not found"
**Solution:** Add `JWT_SECRET` to your `.env` file (Step 2).

### Tests failing - "ECONNREFUSED"
**Solution:** Make sure backend is running on port 3001.

### Frontend can't create jobs
**Solution:** Frontend needs to be updated to send authentication token. This is the next step!

---

## Next: Frontend Updates

The backend is now complete. Next steps:
1. ✅ Add login/register pages to frontend
2. ✅ Store JWT token in localStorage
3. ✅ Add Authorization header to API calls
4. ✅ Create protected routes
5. ✅ Update Profile page to show applications
6. ✅ Show applicants to job posters

---

## Database Schema

### Users Table
- id, email, password, fullName, role, phone, location, bio
- Relationships: postedJobs, applications

### Jobs Table
- id, title, company, location, description, jobType, salary
- requirements, responsibilities, deadline, status
- postedById (foreign key to users)
- Relationships: postedBy, applications

### Job Applications Table
- id, jobId, applicantId, coverLetter, resume, status
- Relationships: job, applicant

---

## Support

- Check backend logs for errors
- Visit Swagger docs: http://localhost:3001/api
- Run tests: `node test-auth-flow.js`
- Review: `BACKEND_CHANGES.md` for detailed changes
